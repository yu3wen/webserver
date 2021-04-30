const request = require('supertest')
const should = require('should')
const app = require('./index')

const agent1 = request.agent(app)
const agent2 = request.agent(app)
describe('test', () => {
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
	it('start', (done) => {
		agent1
			.post('/login')
			.send({ name: 'new', password: 'test' })
			.expect(200, (err, res) => {
				should.not.exist(err)
				res.text.should.containEql('Hello')
				agent1
					.post('/start')
					.expect(200, (error, response) => {
						should.not.exist(error)
						response.text.should.containEql('success start')
					})
				done()
			})
	})
	it('number', (done) => {
		agent2
			.post('/login')
			.send({ name: 'new', password: 'test' })
			.expect(200, (err, res) => {
				should.not.exist(err)
				res.text.should.containEql('Hello')
				agent2
					.post('/number')
					.send({ num: 50 })
					.expect(200, (error, response) => {
						should.not.exist(error)
						response.text.should.equalOneOf(['big', 'small', 'equal'])
					})
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
