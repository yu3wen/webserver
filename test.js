const rp = require('request-promise')

async function conn() {
	const options = {
		url: 'http://localhost:3000/register',
		method: 'post',
		form: {
			name: 'test',
			password: 'test'
		},
	}
	try {
		const message = await rp(options)
		console.log('insert status:', message)
	} catch (err) {
		console.log('err:', err)
	}
}

async function login() {
	const options = {
		url: 'http://localhost:3000/login',
		method: 'post',
		form: {
			name: 'test',
			password: 'test'
		},
	}
	try {
		const message = await rp(options)
		console.log('login status:', message)
		//start()
	} catch (err) {
		console.log('err:', err)
	}
}

async function start() {
	const options = {
		url: 'http://localhost:3000/start',
		method: 'get',
		form: {
			name: 'test',
			password: 'test'
		},
	}
	try {
		const status = await rp(options)
		console.log('start:', status)
	} catch (err) {
		console.log('err:', err)
	}
}


async function test() {
	const options = {
		url: 'http://localhost:3000/test',
		method: 'get',
	}
	try {
		const status = await rp(options)
		console.log('start:', status)
	} catch (err) {
		console.log('err:', err)
	}
}

test()
