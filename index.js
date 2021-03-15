const redis = require("redis");

class EasyAutoCacheManager {


    constructor(redisOptions = {}, mongoConnection) {
        this.connectRedis(redisOptions)
    }

    connectRedis() {

        this.client = redis.createClient();

        this.client.on('connect', function () {
            console.log('Redis client connected');
        });

        this.client.on('error', function (err) {
            console.log('Redis client connection error' + err);
        });
    }

}


module.exports = EasyAutoCacheManager;