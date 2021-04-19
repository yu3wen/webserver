const Koa = require('koa')
const Router = require('koa-router')
const Redis = require('redis')
const views = require('koa-views')
const path = require('path')
const bodyParser = require('koa-bodyparser')

const client = Redis.createClient(6379, 'localhost')
let R
let message
const app = new Koa()
app.listen(3000)
const router = new Router()

app.use(views(path.join(__dirname, './static'), {
	extension: 'ejs',
}))

app.use(bodyParser())

function getredis() {
	return new Promise((resolve, reject) => {
		client.get('Rnum', (err, res) => {
			if (res) resolve(Number(res))
			else if (err) reject(err)
		})
	})
}

function setredis(num) {
	return new Promise((resolve, reject) => {
		client.set('Rnum', num, (err, res) => {
			if (res) resolve(res)
			else if (err) reject(err)
		})
	})
}

router.get('/', async (ctx) => {
	message = ''
	await ctx.render('index', {
		message,
	})
})

router.post('/start', async (ctx) => {
	message = 'OK'
	R = Math.floor(100 * Math.random())
	try {
		await setredis(R)
		await ctx.render('index', {
			message,
		})
	} catch (err) {
		console.error(err)
	}
})

router.post('/number', async (ctx) => {
	const value = ctx.request.body.num || ''
	console('value:', value)
	try {
		R = await getredis()
		if (Number(value) > R) {
			message = 'small'
			await ctx.render('index', {
				message,
			})
		} else if (Number(value) === R) {
			message = 'equal'
			await ctx.render('index', {
				message,
			})
			R = Math.floor(100 * Math.random())
			await setredis(R)
		} else if (Number(value) < R) {
			message = 'big'
			await ctx.render('index', {
				message,
			})
		}
	} catch (err) {
		console.log(err)
	}
	console.log(R)
})

app.use(router.routes())

console.log('running')
