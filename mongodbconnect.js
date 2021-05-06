const { MongoClient } = require('mongodb')

const url = 'mongodb://localhost:27017'
const client = new MongoClient(url)
const dbname = 'mongo'

function connect(cb) {
	client.connect((err) => {
		if (err) {
			throw new Error(err)
		}
		cb(client.db(dbname))
	})
}
function closeConn() {
	client.close()
}

module.exports = { connect, closeConn }
