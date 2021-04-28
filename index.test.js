const request = require('supertest')
const should = require('should')
const app = require('./index')

const agent = request.agent(app)
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
	it('login sucess', (done) => {
		agent
			.post('/login')
			.send({ name: 'new', password: 'test' })
			.expect(200, (err, res) => {
				should.not.exist(err)
				res.text.should.containEql('Hello')
				done()
			})
	})
	it('start success', (done) => {
		agent
			.post('/start')
			.expect(200, (err, response) => {
				should.not.exist(err)
				response.text.should.containEql('success start')
				done()
			})
	})
	it('guess success', (done) => {
		agent
			.post('/number')
			.send({ num: 50 })
			.expect(200, (err, res) => {
				should.not.exist(err)
				res.text.should.equalOneOf(['big', 'small', 'equal'])
				done()
			})
	})
	it('delete all', (done) => {
		agent
			.post('/delete')
			.expect(200, (err, res) => {
				should.not.exist(err)
				res.text.should.containEql('delete sucess')
				done()
			})
	})
})
