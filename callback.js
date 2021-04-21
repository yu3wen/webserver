const rp = require('request-promise')

let num
function conn(R) {
	const option = {
		method: 'post',
		uri: 'http://localhost:3000/number',
		body: {
			num: R,
		},
		json: true,
	}

	rp(option)
		.then((htmlstring) => {
			console.log('R', R)
			console.log('res:', htmlstring)
			if (htmlstring === 'big') conn(R - 1)
			else if (htmlstring === 'small') conn(R + 1)
			else if (htmlstring === 'equal') num = R
		})
		.catch((error) => {
			console.error(error)
		})
}

function call(R, cb) {
	setTimeout(() => {
		cb(num)
	}, 3000)
	try {
		conn(R)
	} catch (err) {
		console.error(err)
	}
}
call(Math.floor(1000000 * Math.random()), (res) => {
	console.log('R number:', res)
})
