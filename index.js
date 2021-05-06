const Koa = require('koa')
const Router = require('koa-router')
const session = require('koa-session')
const bodyParser = require('koa-bodyparser')
const crypto = require('crypto')
const mongoose = require('mongoose')

const Catcherr = require('./exception')
const dbconnect = require('./mongodbconnect')
const identify = require('./identify')

const app = new Koa()
app.use(session(app))
app.use(bodyParser())
app.use(Catcherr)// catch errors
app.use(identify)// user identify
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
	const { name, password } = ctx.request.body
	await register(name, password)
	ctx.body = 'register sucess'
})

router.post('/login', async (ctx) => {
	const { name, password } = ctx.request.body
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
	const R = Math.floor(100 * Math.random())
	await start(userid, R)
	ctx.body = 'success start'
})

router.post('/number', async (ctx) => {
	const { userid } = ctx.session
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
})

router.post('/closedb', async (ctx) => {
	dbconnect.closeconn()
	ctx.body = 'close db connection'
})

function deleteUser(userid) {
	return db.collection('user').deleteOne({ _id: mongoose.Types.ObjectId(userid) })
}

function deleteNumber(userid) {
	return db.collection('number').deleteOne({ userid })
}

router.post('/delete', async (ctx) => {
	const { userid } = ctx.session
	await Promise.all(deleteUser(userid), deleteNumber(userid))
	ctx.body = 'delete sucess'
})

app.use(router.routes())

console.log('running')
