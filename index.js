const Koa = require('koa')
const Router = require('koa-router')
var R
let app = new Koa()
app.listen(3000)
let router = new Router()
router.get('/start', (ctx, next) => {
	ctx.body = 'OK'
	R = parseInt(100 * Math.random())


})

router.get('/:number', (ctx, next) => {
	var number = parseInt(ctx.params['number'])
	if (number > R) {
		ctx.body = 'smaller'
	}
	else if (number == R) {
		ctx.body = 'euqal'
	}
	else if (number < R) {
		ctx.body = 'bigger'
	}
	R = parseInt(100 * Math.random())

})

app.use(router.routes())

console.log('running')