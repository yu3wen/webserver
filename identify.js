async function identify(ctx, next) {
	const { userid } = ctx.session
	if (!userid) {
		ctx.body = 'please login'
		ctx.throw(400, 'please login')
	}
	await next()
}

module.exports = identify
