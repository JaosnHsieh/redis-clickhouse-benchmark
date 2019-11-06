# create clickhouse server

server

`$ docker run -d --name some-clickhouse-server --ulimit nofile=262144:262144 yandex/clickhouse-server`

client

`$ docker run -it --rm --link some-clickhouse-server:clickhouse-server yandex/clickhouse-client --host clickhouse-server`

# create redis server

network
`$ docker network create some-redis`

server
`$ docker run --name some-redis --network some-redis -d redis redis-server --appendonly yes`

client
`docker run -it --network some-network --rm redis redis-cli -h some-redis`

## run benchmarks scripts functions to redis and clickhouse

redis.js

```javascript
await createTable();
//await insertAllFile();
//await queryTime();
```

clickhouse.js

```javascript
addToReidsSet();
//   queryTime();
```

### references

https://hub.docker.com/r/yandex/clickhouse-server/
https://hub.docker.com/_/redis
