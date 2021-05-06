const request = require('supertest')
const should = require('should')
const app = require('./index')

describe('register test', () => {
	it('register', (done) => {
		request(app)
			.post('/register')
			.send({ name: 'new', password: 'test' })
			.expect(200, (err, res) => {
				should.not.exist(err)
				res.text.should.containEql('register sucess')
				done()
			})
	})
})

describe('login test', () => {
	it('login', (done) => {
		request(app)
			.post('/login')
			.send({ name: 'new', password: 'test' })
			.expect(200, (err, res) => {
				should.not.exist(err)
				res.text.should.containEql('Hello')
				done()
			})
	})
})

describe('start test', () => {
	const agent = request.agent(app)
	it('start login', (done) => {
		agent
			.post('/login')
			.send({ name: 'new', password: 'test' })
			.expect(200, (err, res) => {
				should.not.exist(err)
				res.text.should.containEql('Hello')
				done()
			})
	})
	it('start', (done) => {
		agent
			.post('/start')
			.expect(200, (err, response) => {
				should.not.exist(err)
				response.text.should.containEql('success start')
				done()
			})
	})
})

describe('number test', () => {
	const agent1 = request.agent(app)
	it('number login', (done) => {
		agent1
			.post('/login')
			.send({ name: 'new', password: 'test' })
			.expect(200, (err, res) => {
				should.not.exist(err)
				res.text.should.containEql('Hello')
				done()
			})
	})
	it('number', (done) => {
		agent1
			.post('/number')
			.send({ num: 50 })
			.expect(200, (err, response) => {
				should.not.exist(err)
				response.text.should.equalOneOf(['big', 'small', 'equal'])
				done()
			})
	})
	it('delete all', (done) => {
		agent1
			.post('/delete')
			.expect(200, (err, res) => {
				should.not.exist(err)
				res.text.should.containEql('delete sucess')
				done()
			})
	})
})
