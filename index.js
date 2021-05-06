const Koa = require('koa')
const Router = require('koa-router')
const session = require('koa-session')
const bodyParser = require('koa-bodyparser')
const crypto = require('crypto')
const mongoose = require('mongoose')

const Catcherr = require('./exception')
const dbConnect = require('./mongodbconnect')
const identify = require('./identify')

const app = new Koa()
app.use(session(app))
app.use(bodyParser())
module.exports = app.listen(3000)
const router = new Router()
app.keys = ['somesecret']

let db
dbConnect.connect((res) => {
	db = res
})

function md5(s) {
	return crypto.createHash('md5').update(String(s)).digest('hex')
}

function register(uName, uPassword) {
	const usalt = Math.floor(100 * Math.random())
	const test = { name: uName, password: md5(uName + usalt + uPassword), salt: usalt }
	return db.collection('user').insertOne(test)
}

function login(uName) {
	return db.collection('user').findOne({ name: uName })
}

function start(userId, num) {
	return db.collection('number').updateOne({ userid: userId }, { $set: { number: num } }, { upsert: true })
}

function number(userId) {
	return db.collection('number').findOne({ userid: userId })
}

router.post('/register', Catcherr, async (ctx) => {
	const { name, password } = ctx.request.body
	await register(name, password)
	ctx.body = 'register sucess'
})

router.post('/login', Catcherr, async (ctx) => {
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

router.post('/start', Catcherr, identify, async (ctx) => {
	const { userid } = ctx.session
	const R = Math.floor(100 * Math.random())
	await start(userid, R)
	ctx.body = 'success start'
})

router.post('/number', Catcherr, identify, async (ctx) => {
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
	dbConnect.closeConn()
	ctx.body = 'close db connection'
})

function deleteUser(userid) {
	return db.collection('user').deleteOne({ _id: mongoose.Types.ObjectId(userid) })
}

function deleteNumber(userid) {
	return db.collection('number').deleteOne({ userid })
}

router.post('/delete', Catcherr, async (ctx) => {
	const { userid } = ctx.session
	await Promise.all([deleteUser(userid), deleteNumber(userid)])
	ctx.body = 'delete sucess'
})

app.use(router.routes())

console.log('running')
