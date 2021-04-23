const rp = require('request-promise')

function conn(parma) {
	const options = {
		url: 'http://localhost:3000/number',
		method: 'post',
		form: {
			num: parma,
		},
	}
	return rp(options).then((res) => new Promise((resolve) => {
		resolve(res)
	}))
		.catch((err) => {
			console.log(err)
		})
}

function pro(first, second) {
	const parma = Math.floor((first + second) / 2)
	return new Promise((resolve) => {
		conn(parma).then((res) => {
			if (res === 'big') pro(first, Math.floor((first + second) / 2) - 1)
			else if (res === 'small') pro(Math.floor((first + second) / 2) + 1, second)
			else if (res === 'equal') resolve(parma)
		})
	}).then((result) => { console.log('number:', result) })
}

pro(0, 1000000)
