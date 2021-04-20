const request = require('supertest')
const should = require('should')
const index = require('./index')

describe('/start', () => {
	it('OK', (done) => {
		request('http://172.16.2.16:3000')
			.post('/start')
			.expect(200, (err, res) => {
				should.not.exist(err)
				res.text.should.containEql('OK')
				done()
			})
	})
})

describe('/number', () => {
	it('small', (done) => {
		index.getredis().then((res) => {
			request('http://172.16.2.16:3000')
				.post('/number')
				.send({ num: res - 1 })
				.expect(200, (err, resl) => {
					should.not.exist(err)
					resl.text.should.containEql('small')
					done()
				})
		})
	})
	it('euqal', (done) => {
		index.getredis().then((res) => {
			request('http://172.16.2.16:3000')
				.post('/number')
				.send({ num: res })
				.expect(200, (err, resl) => {
					should.not.exist(err)
					resl.text.should.containEql('equal')
					done()
				})
		})
	})
	it('big', (done) => {
		index.getredis().then((res) => {
			request('http://172.16.2.16:3000')
				.post('/number')
				.send({ num: res + 1 })
				.expect(200, (err, resl) => {
					should.not.exist(err)
					resl.text.should.containEql('big')
					done()
				})
		})
	})
})
