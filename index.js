const Koa = require('koa')
const Router = require('koa-router')
const session = require('koa-session')
const bodyParser = require('koa-bodyparser')
const crypto = require('crypto')
const mongoose = require('mongoose')

const Catcherr = require('./exception')
const dbconnect = require('./mongodbconnect')

const app = new Koa()
app.use(Catcherr)
app.use(session(app))
app.use(bodyParser())
module.exports = app.listen(3000)
const router = new Router()
app.keys = ['somesecret']

let db
dbconnect.connect((res) => {
	db = res
})

function md5(s) {
	return crypto.createHash('md5').update(String(s)).digest('hex')
}

function register(uname, upassword) {
	const usalt = Math.floor(100 * Math.random())
	const test = { name: uname, password: md5(uname + usalt + upassword), salt: usalt }
	return db.collection('user').insertOne(test)
}

function login(uname) {
	return db.collection('user').findOne({ name: uname })
}

function start(userid, num) {
	return db.collection('number').updateOne({ userid }, { $set: { number: num } }, { upsert: true })
}

function number(userid) {
	return db.collection('number').findOne({ userid })
}

router.post('/register', async (ctx) => {
	const uname = ctx.request.body.name
	const upassword = ctx.request.body.password
	await register(uname, upassword)

	ctx.body = 'register sucess'
})

router.post('/login', async (ctx) => {
	const { name } = ctx.request.body
	const { password } = ctx.request.body
	/* eslint no-underscore-dangle: 0 */
	const user = await login(name)
	const upassword = md5(name + user.salt + password)
	if (upassword === user.password) {
		ctx.session.userid = user._id
		ctx.body = `Hello ${user.name}`
	} else {
		ctx.body = 'login failed'
	}
})

router.post('/start', async (ctx) => {
	const { userid } = ctx.session
	if (userid) {
		const R = Math.floor(100 * Math.random())
		await start(userid, R)
		ctx.body = 'success start'
	} else {
		ctx.body = 'please login'
	}
})

router.post('/number', async (ctx) => {
	const { userid } = ctx.session
	if (userid) {
		const Num = await number(userid)
		const num = Num.number
		const Rnum = Number(ctx.request.body.num)
		if (num > Rnum) {
			ctx.body = 'small'
		} else if (num < Rnum) {
			ctx.body = 'big'
		} else if (num === Rnum) {
			ctx.body = 'equal'
		}
	} else {
		ctx.body = 'please login'
	}
})

router.post('/closedb', async (ctx) => {
	dbconnect.closeconn()
	ctx.body = 'close db connection'
})

function deleteuser(userid) {
	return db.collection('user').deleteOne({ _id: mongoose.Types.ObjectId(userid) })
}

function deletenumber(userid) {
	return db.collection('number').deleteOne({ userid })
}

router.post('/delete', async (ctx) => {
	const { userid } = ctx.session
	await deleteuser(userid)
	await deletenumber(userid)
	ctx.body = 'delete sucess'
})

app.use(router.routes())

console.log('running')
