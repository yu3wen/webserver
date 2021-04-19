const Koa = require('koa')
const Router = require('koa-router')
const Redis = require('redis')

const client = Redis.createClient(6379, 'localhost')
let R
const app = new Koa()
app.listen(3000)

const router = new Router()

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

router.get('/start', async (ctx) => {
	R = Math.floor(100 * Math.random())
	try {
		await setredis(R)
		ctx.body = 'OK'
	} catch (err) {
		ctx.body = 'err'
	}
})

router.get('/:number', async (ctx) => {
	const number = Math.floor(ctx.params.number)
	R = await getredis()
	if (number > R) {
		ctx.body = 'smaller'
	} else if (number === R) {
		ctx.body = 'euqal'
		R = Math.floor(100 * Math.random())
		try {
			await setredis(R)
		} catch (err) {
			ctx.body = 'err'
		}
	} else if (number < R) {
		ctx.body = 'bigger'
	}
	console.log('R', R)
})

app.use(router.routes())

console.log('running')
