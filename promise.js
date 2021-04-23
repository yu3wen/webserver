const rp = require('request-promise')

function conn(first, second) {
	const parma = Math.floor((first + second) / 2)
	const options = {
		url: 'http://localhost:3000/number',
		method: 'post',
		form: {
			num: parma,
		},
	}
	return rp(options).then((res) => {
		if (res === 'big') {
			return conn(first, Math.floor((first + second) / 2) - 1)
		} if (res === 'small') {
			return conn(Math.floor((first + second) / 2) + 1, second)
		} if (res === 'equal') {
			return parma
		}
		return null
	})
}

conn(0, 1000000).then((res) => {
	console.log('res:', res)
})
