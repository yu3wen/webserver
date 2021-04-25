const rp = require('request-promise')

async function conn(first, second) {
	const parma = Math.floor((first + second) / 2)
	const options = {
		url: 'http://localhost:3000/number',
		method: 'post',
		form: {
			num: parma,
		},
	}
	try {
		const message = await rp(options)
		if (message === 'big') {
			return conn(first, Math.floor((first + second) / 2) - 1)
		}
		if (message === 'small') {
			return conn(Math.floor((first + second) / 2) + 1, second)
		}
		if (message === 'equal') {
			return parma
		}
	} catch (err) {
		throw Error(err)
	}
	return null
}

async function asy() {
	try {
		const message = await conn(0, 1000000)
		console.log('number', message)
	} catch (err) {
		console.log('Error', err)
	}
}

asy()
