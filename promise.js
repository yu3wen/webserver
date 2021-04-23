const rp = require('request-promise')

function conn(parma) {
	const options = {
		url: 'http://localhost:3000/number',
		method: 'post',
		form: {
			num: parma,
		},
	}
	return rp(options)
}

function pro(first, second) {
	const parma = Math.floor((first + second) / 2)
	conn(parma).then((res) => {
		if (res === 'big') {
			pro(first, Math.floor((first + second) / 2) - 1)
			return
		} if (res === 'small') {
			pro(Math.floor((first + second) / 2) + 1, second)
			return
		} if (res === 'equal') {
			console.log('number:', parma)
		}
	})
		.catch((err) => {
			console.log('err', err)
		})
}

pro(0, 1000000)
