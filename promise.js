const re = require('request')

function conn(first, second, cb) {
	const number = Math.floor((first + second) / 2)
	const options = {
		url: 'http://localhost:3000/number',
		method: 'post',
		form: {
			num: number,
		},
	}
	re(options, (err, res, body) => {
		if (err) cb(err)
		if (body === 'big') {
			conn(first, Math.floor((first + second) / 2) - 1, cb)
		} else if (body === 'small') {
			conn(Math.floor((first + second) / 2) + 1, second, cb)
		} else if (body === 'equal') {
			cb(number)
		}
	})
}

function pro() {
	return new Promise((resolve, reject) => {
		conn(0, 1000000, (err, res) => {
			if (err) reject(err)
			resolve(res)
		})
	})
}

pro().then((res) => {
	console('num:', res)
})
	.catch((err) => {
		console.log('err:', err)
	})
