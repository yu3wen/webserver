const Koa = require('koa')
const Router = require('koa-router')
const session = require('koa-session')
const bodyParser = require('koa-bodyparser')
const { MongoClient } = require('mongodb')
const md5 = require('md5-node')
const mongoose = require('mongoose')

const url = 'mongodb://localhost:27017'
const app = new Koa()
app.use(session(app))
app.use(bodyParser())
module.exports = app.listen(3000)
const router = new Router()
app.keys = ['somesecret']
const dbname = 'mongo'
const client = new MongoClient(url)

function register(uname, upassword) {
	const usalt = Math.floor(100 * Math.random())
	const test = { name: uname, password: md5(uname + usalt + upassword), salt: usalt }
	return new Promise((resolve, reject) => {
		client.connect((err) => {
			if (err) {
				reject(err)
			}
			const db = client.db(dbname)
			db.collection('user').insertOne(test, (error, res) => {
				if (error) {
					reject(error)
				}
				resolve(res)
			})
		})
	})
}

function login(uname) {
	return new Promise((resolve, reject) => {
		client.connect((err) => {
			if (err) {
				reject(err)
			}
			const db = client.db(dbname)
			try {
				const user = db.collection('user').findOne({ name: uname })
				resolve(user)
			} catch (error) {
				reject(error)
			}
		})
	})
}

function start(userid, number) {
	return new Promise((resolve, reject) => {
		client.connect((err) => {
			if (err) {
				reject(err)
			}
			const db = client.db(dbname)
			db.collection('number').insertOne({ userid, number }, (error, result) => {
				if (error) {
					reject(error)
				}
				resolve(result)
			})
		})
	})
}

function guess(userid) {
	return new Promise((resolve, reject) => {
		client.connect((err) => {
			if (err) {
				reject(err)
			}
			try {
				const db = client.db(dbname)
				const number = db.collection('number').findOne({ userid })
				resolve(number)
			} catch (error) {
				reject(error)
			}
		})
	})
}

router.post('/register', async (ctx) => {
	const uname = ctx.request.body.name
	const upassword = ctx.request.body.password
	try {
		await register(uname, upassword)
		ctx.body = 'register sucess'
	} catch (err) {
		console.log('err:', err)
		ctx.body = 'error'
	}
})

router.post('/login', async (ctx) => {
	const { name } = ctx.request.body
	const { password } = ctx.request.body
	/* eslint no-underscore-dangle: 0 */
	try {
		const user = await login(name)
		const upassword = md5(name + user.salt + password)
		if (upassword === user.password) {
			ctx.session.userid = user._id
			ctx.cookies.set('sessionid', user._id)
			ctx.body = `Hello ${user.name}`
		} else {
			ctx.body = 'login failed'
		}
	} catch (err) {
		console.log('err:', err)
		ctx.body = 'error'
	}
})

router.post('/start', async (ctx) => {
	const R = Math.floor(100 * Math.random())
	try {
		const { userid } = ctx.session
		if (userid) {
			await start(userid, R)
			ctx.body = 'success start'
		} else {
			ctx.body = 'please login'
		}
	} catch (err) {
		console.error(err)
	}
})

router.post('/number', async (ctx) => {
	const { userid } = ctx.session
	try {
		if (userid) {
			const number = await guess(userid)
			const num = Number(number.number)
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
	} catch (err) {
		console.error(err)
	}
})

function deleteuser(userid) {
	return new Promise((resolve, reject) => {
		client.connect((err) => {
			if (err) {
				reject(err)
			}
			const db = client.db(dbname)
			db.collection('user').deleteOne({ _id: mongoose.Types.ObjectId(userid) }, (error, result) => {
				if (error) {
					reject(error)
				}
				resolve(result)
			})
			db.collection('number').deleteOne({ userid }, (error, result) => {
				if (error) {
					reject(error)
				}
				resolve(result)
			})
			client.close()
		})
	})
}

router.post('/delete', async (ctx) => {
	const { userid } = ctx.session
	try {
		await deleteuser(userid)
		ctx.body = 'delete sucess'
	} catch (err) {
		console.log('err:', err)
		ctx.body = 'error'
	}
})

app.use(router.routes())

console.log('running')
