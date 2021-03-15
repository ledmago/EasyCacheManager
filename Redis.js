const Keys = require('./CacheKeys');
class Redis {

    constructor(redisClient) {
        this.client = redisClient;
    }


    async get(key, hashKey) {
        if (!this.client.connected) { return false; }
        return new Promise((resolve, reject) => {
            if (!this.client.connected) { resolve(false); }
            this.client.hget(hashKey, key, (err, val) => {
                if (err) {
                    resolve(false);
                }
                else {

                    let returnVal = val;
                    try {
                        returnVal = JSON.parse(val);
                    }
                    catch (e) {

                    }
                    resolve(returnVal);
                }
            });


        })

    }

    async set(key, hashKey, val) {
        if (!this.client.connected) { return false; }
        try {
            val = JSON.stringify(val)

        }
        catch (e) {
        }


        return new Promise((resolve, reject) => {
            this.client.hset(hashKey, key, val, (err, valx) => {
                if (err) {
                    resolve(false)
                }
                else {
                    resolve(true)
                }
            });


        })

    }

    async delete(key, hashKey) {
        if (!this.client.connected) { return false; }
        return new Promise((resolve, reject) => {
            this.client.hdel(hashKey, key, (err, val) => {
                if (err) {
                    reject(false)
                }
                else {
                    resolve(true)
                }
            });


        })

    }




}
module.exports = Redis;