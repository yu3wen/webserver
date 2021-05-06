function identify(ctx) {
	const { userid } = ctx.session
	if (!userid) {
		ctx.body = 'please login'
		ctx.throw(400, 'please login')
	}
}

module.exports = identify
