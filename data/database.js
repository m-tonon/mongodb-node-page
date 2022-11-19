const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

let database;

async function connect() {
  const client = await MongoClient.connect('mongodb://localhost:27017');
  database = client.db('blog'); // this will talk to the database created on mongosh
}

function getDb() { // make 'database' available outside of this file
  if (!database) {
    throw { message: 'Database connection not established!' }; // error handling
  }
  return database;
}

module.exports = {
  connectToDatabase: connect,
  getDb: getDb,
};
