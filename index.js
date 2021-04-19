const Koa = require('koa')
const Router = require('koa-router')
const Redis = require('redis')

const client = Redis.createClient(6379, 'localhost')
let R
const app = new Koa()
app.listen(3000)

const router = new Router()

function getredis() {
	return new Promise((resolve) => {
		client.get('Rnum', (err, res) => {
			resolve(Number(res))
		})
	})
}

function setredis(num) {
	return new Promise((resolve) => {
		client.set('Rnum', num, (err, res) => {
			resolve(res)
			console.log('setredis:', res)
		})
	})
}

router.get('/start', async (ctx) => {
	R = Math.floor(100 * Math.random())

	const check = await setredis(R)
	if (check) {
		ctx.body = 'OK'
		console.log(check)
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
		const check = await setredis(R)
		if (!check) {
			ctx.body = 'error'
		}
	} else if (number < R) {
		ctx.body = 'bigger'
	}
	console.log('R', R)
})

app.use(router.routes())

console.log('running')
