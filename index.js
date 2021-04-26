const Koa = require('koa')
const Router = require('koa-router')
const views = require('koa-views')
const path = require('path')
const session = require('koa-session')
const bodyParser = require('koa-bodyparser')
const { MongoClient } = require('mongodb')
const md5 = require('md5-node')

const url = 'mongodb://localhost:27017'
const app = new Koa()
app.listen(3000)
const router = new Router()
app.use(session(app))
app.use(views(path.join(__dirname, './static'), {
	extension: 'ejs',
}))
app.keys = ['somesecret']
app.use(bodyParser())
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
			console.log('test:', test)
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
			console.log('login uname:', uname)
			try {
				const user = db.collection('user').findOne({ name: uname })
				resolve(user)
			} catch (error) {
				reject(error)
			}
		})
	})
}

function setRnum(userid, number) {
	console.log('setRnum', userid)
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

router.get('/', async (ctx) => {
	const message = ''
	await ctx.render('login', {
		message,
	})
})

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
	try {
		const user = await login(name)
		console.log('user', user)
		const upassword = md5(name + user.salt + password)
		if (upassword === user.password) {
			ctx.session.userid = user._id
			console.log('session:', ctx.session.userid)
			const message = `Hello ${user.name}`
			await ctx.render('index', {
				message,
			})
		} else {
			const message = 'login failed'
			await ctx.render('login', {
				message,
			})
		}
	} catch (err) {
		console.log('err:', err)
		ctx.body = 'error'
	}
})

router.post('/start', async (ctx) => {
	// const message = 'OK'
	const R = Math.floor(100 * Math.random())
	try {
		// console.log('start session:', ctx.session.userid)
		const { userid } = ctx.session
		if (userid) {
			await setRnum(userid, R)
			const message = 'success setRnum'
			await ctx.render('index', {
				message,
			})
		} else {
			const message = 'please login'
			await ctx.render('login', {
				message,
			})
		}
	} catch (err) {
		console.error(err)
	}
})

router.post('/number', async (ctx) => {
	const { userid } = ctx.session
	try {
		let message
		if (userid) {
			const number = await guess(userid)
			const num = Number(number.number)
			const Rnum = Number(ctx.request.body.num)
			if (num > Rnum) {
				message = 'small'
			} else if (num < Rnum) {
				message = 'big'
			} else if (num === Rnum) {
				message = 'equal'
			}
			await ctx.render('index', {
				message,
			})
		} else {
			message = 'please login'
			await ctx.render('login', {
				message,
			})
		}
	} catch (err) {
		console.error(err)
	}
	// console.log(R)
})

function deleteuser(name) {
	return new Promise((resolve, reject) => {
		client.connect((err) => {
			if (err) {
				reject(err)
			}
			const db = client.db(dbname)
			db.collection('user').deleteOne({ name }, (error, result) => {
				if (error) {
					reject(error)
				}
				resolve(result)
			})
		})
	})
}

router.post('/deleteuser', async (ctx) => {
	const uname = ctx.request.body.name
	try {
		await deleteuser(uname)
		ctx.body = 'sucess'
	} catch (err) {
		console.log('err:', err)
		ctx.body = 'error'
	}
})

app.use(router.routes())

console.log('running')
