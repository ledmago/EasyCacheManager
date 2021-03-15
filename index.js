const redis = require("redis");

class EasyAutoCacheManager {


    constructor(redisOptions = {}, mongoConnection) {
        this.connectRedis(redisOptions)
    }

    connectRedis() {

        this.client = redis.createClient();

        client.on('connect', function () {
            console.log('Redis client bağlandı');
        });

        client.on('error', function (err) {
            // console.log('Redis Clientda bir hata var ' + err);
        });
    }

}


module.exports = EasyAutoCacheManager;