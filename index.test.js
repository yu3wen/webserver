const request = require('supertest')
const should = require('should')
const rp = require('request-promise')

async function deleteuser() {
	const options = {
		url: 'http://localhost:3000/deleteuser',
		method: 'post',
		form: {
			name: 'new',
		},
	}
	try {
		await rp(options)
		// console.log('delete status:', message)
	} catch (err) {
		console.log('err:', err)
	}
}

describe('/register', () => {
	it('register', (done) => {
		request('localhost:3000')
			.post('/register')
			.send({ name: 'new', password: 'test' })
			.expect(200, (err, res) => {
				should.not.exist(err)
				res.text.should.containEql('register sucess')
				deleteuser()
				done()
			})
	})
})

describe('/login', () => {
	it('sucess', (done) => {
		request('localhost:3000')
			.post('/login')
			.send({ name: 'test', password: 'test' })
			.expect(200, (err, res) => {
				should.not.exist(err)
				res.text.should.containEql('Hello')
				deleteuser()
				done()
			})
	})
	it('false', (done) => {
		request('localhost:3000')
			.post('/login')
			.send({ name: 'test', password: 'test1' })
			.expect(200, (err, res) => {
				should.not.exist(err)
				res.text.should.containEql('login failed')
				deleteuser()
				done()
			})
	})
})

describe('/start', () => {
	it('success setRnum', (done) => {
		request('localhost:3000')
			.post('/start')
			.expect(200, (err, res) => {
				should.not.exist(err)
				res.text.should.containEql('success setRnum')
				deleteuser()
				done()
			})
	})
	it('please login', (done) => {
		request('localhost:3000')
			.post('/start')
			.expect(200, (err, res) => {
				should.not.exist(err)
				res.text.should.containEql('please login')
				deleteuser()
				done()
			})
	})
})
