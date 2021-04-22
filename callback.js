const re = require('request')

function conn(first, second, cb) {
	const number = Math.floor((first + second) / 2)
	// console.log('first: ', first)
	// console.log('second: ', second)
	const options = {
		url: 'http://localhost:3000/number',
		method: 'post',
		form: {
			num: number,
		},
	}
	re(options, (err, res, body) => {
		// console.log(err)
		// console.log('result:', body)
		if (body === 'big') {
			conn(first, Math.floor((first + second) / 2) - 1, cb)
			//	conn(first, Math.floor((first + Math.floor((first + second) / 2) - 1) / 2) - 1)// 二次折半查询
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
	conn(0, 1000000, (res) => {
		console.log('num:', res)
	})
} catch (err) {
	console.log(err)
}
