const identify = async function (ctx, next) {
	const allowPage = ['/login', '/register']
	const url = ctx.originalUrl
	if (allowPage.indexOf(url) === -1) {
		const { userid } = ctx.session
		if (!userid) {
			ctx.body = 'please login'
			ctx.throw(400, 'please login')
		}
	}
	await next()
}

module.exports = identify
