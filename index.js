const Koa = require('koa')
const Router = require('koa-router')
const Redis = require('redis')
const views = require('koa-views')
const path = require('path')
const bodyParser = require('koa-bodyparser')

const client = Redis.createClient(6379, 'localhost')
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

function sleep() {
	return new Promise((resolve) => {
		setTimeout(resolve, 6000)
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

router.post('/start', async (ctx) => {
	const R = Math.floor(1000000 * Math.random())
	try {
		await setredis(R)
		ctx.body = 'OK'
	} catch (err) {
		console.error(err)
	}
})

router.post('/number', async (ctx) => {
	const value = ctx.request.body.num || ''
	// console.log('value:', value)
	await sleep()
	try {
		let R = await getredis()
		if (Number(value) > R) {
			ctx.body = 'big'
		} else if (Number(value) === R) {
			ctx.body = 'equal'
			R = Math.floor(100 * Math.random())
			await setredis(R)
		} else if (Number(value) < R) {
			ctx.body = 'small'
		}
	} catch (err) {
		console.log(err)
	}
})

module.exports = { getredis }
app.use(router.routes())

console.log('running')
