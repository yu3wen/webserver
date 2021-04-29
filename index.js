const Koa = require('koa')
const Router = require('koa-router')
const session = require('koa-session')
const bodyParser = require('koa-bodyparser')
const { MongoClient } = require('mongodb')
const crypto = require('crypto')
const mongoose = require('mongoose')
const Catcherr = require('./exception')

const url = 'mongodb://localhost:27017'
const app = new Koa()
app.use(Catcherr)
app.use(session(app))
app.use(bodyParser())
module.exports = app.listen(3000)
const router = new Router()
app.keys = ['somesecret']
const dbname = 'mongo'
const client = new MongoClient(url)

let db
client.connect((err) => {
	if (err) {
		throw new Error(err)
	}
	db = client.db(dbname)
})

function md5(s) {
	return crypto.createHash('md5').update(String(s)).digest('hex')
}

function register(uname, upassword) {
	const usalt = Math.floor(100 * Math.random())
	const test = { name: uname, password: md5(uname + usalt + upassword), salt: usalt }
	return new Promise((resolve, reject) => {
		db.collection('user').insertOne(test, (error, res) => {
			if (error) {
				reject(error)
			}
			resolve(res)
		})
	})
}

function login(uname) {
	return new Promise((resolve) => {
		const user = db.collection('user').findOne({ name: uname })
		resolve(user)
	})
}

function start(userid, number) {
	return new Promise((resolve, reject) => {
		db.collection('number').updateOne({ userid }, { $set: { number } }, { upsert: true }, (err, res) => {
			if (err) {
				reject(err)
			}
			resolve(res)
		})
	})
}

function guess(userid) {
	return new Promise((resolve) => {
		const number = db.collection('number').findOne({ userid })
		resolve(number)
	})
}

router.post('/yes', () => {
	throw new Error('yes')
})

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
	const R = Math.floor(100 * Math.random())
	const { userid } = ctx.session
	if (userid) {
		await start(userid, R)
		ctx.body = 'success start'
	} else {
		ctx.body = 'please login'
	}
})

router.post('/number', async (ctx) => {
	const { userid } = ctx.session

	if (userid) {
		const number = await guess(userid)
		const num = number.number
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

function closeconn() {
	client.close()
}

function deleteuser(userid) {
	return new Promise((resolve, reject) => {
		db.collection('user').deleteOne({ _id: mongoose.Types.ObjectId(userid) }, (err, result) => {
			if (err) {
				reject(err)
			}
			resolve(result)
		})
		db.collection('number').deleteOne({ userid }, (err, result) => {
			if (err) {
				reject(err)
			}
			resolve(result)
		})
		closeconn()
	})
}

router.post('/delete', async (ctx) => {
	const { userid } = ctx.session

	await deleteuser(userid)
	ctx.body = 'delete sucess'
})

app.use(router.routes())

console.log('running')
