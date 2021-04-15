const Koa = require('koa')
const Router = require('koa-router')

let R
const app = new Koa()
app.listen(3000)
const router = new Router()
router.get('/start', (ctx) => {
	ctx.body = 'OK'
	R = Math.floor(100 * Math.random())
})

router.get('/:number', (ctx) => {
	const number = Math.floor(ctx.params.number)
	if (number > R) {
		ctx.body = 'smaller'
	} else if (number === R) {
		ctx.body = 'euqal'
		R = Math.floor(100 * Math.random())
	} else if (number < R) {
		ctx.body = 'bigger'
	}
})

app.use(router.routes())

console.log('running')
