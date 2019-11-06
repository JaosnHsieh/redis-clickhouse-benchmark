const readline = require('readline');
const fs = require('fs');
const redis = require('redis');
const client = redis.createClient();

// if you'd like to select database 3, instead of 0 (default), call
// client.select(3, function() { /* ... */ });

client.on('error', function(err) {
  console.log('Error ' + err);
});

client.on('ready', () => {
  addToReidsSet();
  //   queryTime();
});

function queryTime() {
  const startDate = new Date();
  client.SISMEMBER('ifas', '939bcbd6-085f-4135-863d-65593b94e28a', (err, reply) => {
    const endDate = new Date();
    console.log(`query duration`, endDate.getTime() - startDate.getTime());
    // console.log(`SISMEMBER cb reply`, reply);
  });
}

function addToReidsSet() {
  console.log(`start addToReidsSet`);
  const readInterface = readline.createInterface({
    input: fs.createReadStream(`${__dirname}/million-keys`),
    // output: process.stdout,
    console: false,
  });
  readInterface.on('line', function(line) {
    console.log(line);
    client.sadd('ifas', line);
  });
}
