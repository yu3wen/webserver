const re = require('request')

function conn(first, second, resolve, reject) {
	const number = Math.floor((first + second) / 2)
	const options = {
		url: 'http://localhost:3000/number',
		method: 'post',
		form: {
			num: number,
		},
	}
	re(options, (err, res, body) => {
		if (err) { reject(err) }
		if (body === 'big') {
			conn(first, Math.floor((first + second) / 2) - 1, resolve, reject)
		} else if (body === 'small') {
			conn(Math.floor((first + second) / 2) + 1, second, resolve, reject)
		} else if (body === 'equal') {
			resolve(number)
		}
	})
}

const promise = new Promise((resolve, reject) => {
	conn(0, 1000000, resolve, reject)
})

try {
	promise.then((res) => {
		console.log('num:', res)
	})
} catch (err) {
	console.log(err)
}
