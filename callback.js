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
		if (body === 'big') {
			conn(first, Math.floor((first + second) / 2) - 1, cb)
		} else if (body === 'small') {
			conn(Math.floor((first + second) / 2) + 1, second, cb)
		} else if (body === 'equal') {
			cb(number)
		}
	})
}

try {
	conn(0, 1000000, (res) => {
		console.log('num:', res)
	})
} catch (err) {
	console.log(err)
}
