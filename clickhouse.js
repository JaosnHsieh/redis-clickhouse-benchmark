const fs = require('fs');
const readline = require('readline');

const ClickHouse = require('@apla/clickhouse');
const ch = new ClickHouse({ host: `localhost`, port: 8123, dataObjects: true });

const currentDate = new Date();
async function main() {
  await createTable();
  // await insertAllFile();
  // await queryTime();
}

async function queryTime() {
  const start = new Date();
  const result = await ch.querying(
    `select count(*) from ifas where id='302659cf-6a37-4ce4-b5bc-cc05216335fa'`,
    {},
  );
  const end = new Date();
  console.log('result', result);
  console.log(`duration ${end.getTime() - start.getTime()}`);
}
async function wait() {
  return new Promise(resolve =>
    setTimeout(() => {
      resolve();
    }, 200),
  );
}

async function insertIds(ids) {
  return new Promise((resolve, reject) => {
    let str = '';
    ids.map(id => {
      str += `('${id}','',${currentDate.getTime()}),`;
    });
    str = str.substring(0, str.length - 1);

    ch.query(`INSERT INTO TABLE ifas(id,otherId,createdAt) values ${str}`, (err, data) => {
      if (err) {
        console.log('insert into err', err);
        reject();
      }
      resolve();
      queryCount();
    });
  });
}

function queryCount() {
  console.log('querying count....');
  const stream = ch.query('select * from ifas', (err, data) => {
    if (err) {
      console.log(`query count err`, err);
    }
    console.log(`query count data`, data);
  });
}

async function insertAllFile() {
  await wait();
  const rl = readline.createInterface({
    input: fs.createReadStream(`${__dirname}/million-keys`),
    crlfDelay: Infinity,
  });

  let i = 0;
  let ids = [];
  for await (const line of rl) {
    console.log(line, i);
    ids.push(line);
    ++i;
    if (i % 10000 === 0) {
      await insertIds(ids);

      ids = [];

      await wait();
      i = 0;
    }
  }
}

async function createTable() {
  ch.query(
    'CREATE TABLE IF NOT EXISTS ifas (     `id` String,     `otherId` String, `createdAt` Date ) ENGINE = MergeTree(createdAt,(id,otherId), 8192)',
    (err, data) => {
      if (err) {
        console.log(`createTable err`, err);
      }
      console.log(`create table successfully`);
    },
  );
}

main();
