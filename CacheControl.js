const Keys = require('./CacheKeys');
const RedisModel = require('./Redis');
class CacheControl {


    constructor(props, Model, Key) {
        this.props = props;
        this.Model = Model;
        this.Key = Key;
    }



    async getObjectFromCache() {
        let val = null;
        const _redisModel = await new RedisModel();
        val = await _redisModel.get(this.props.id, this.Key);
        return val;


    }
    async saveToCache(object) {
        // Redis'e Kaydet
        const _redisModel = await new RedisModel();
        await _redisModel.set(object._id.toString(), this.Key, object);
    }

    async removeFromCache(object) {
        // Redis'e Kaydet
        const _redisModel = await new RedisModel();
        await _redisModel.delete(this.props.id, this.Key);
    }

    renewObjectInCache(object) {
        this.saveToCache(object);
    }
    async findFromDb() {
        const obj = await this.Model.findOne(this.props);
        return obj;
    }

    async getObjectFromDb() {

        try {
            let object;
            if (this.props.id) {
                object = await this.Model.findById(this.props.id);
            }
            else {
                object = await this.findFromDb();
            }

            if (object) {
                this.saveToCache(object);
                return object;
            }
            else {
                return null;
            }

        }
        catch (e) {
            return null;

        }



    }


    async get() {
        if (global.redisClient.connected && this.props.id) { // Eğer bağlanmadıysa bile dbden çeka
            let getFromCache = await this.getObjectFromCache();
            if (getFromCache) {
                console.log("Cache den geldi")
                return getFromCache;
            }
            else {
                console.log("Db den geldi")
                return await this.getObjectFromDb();
            }
        }
        else {
            console.log("Db den geldi")
            return await this.getObjectFromDb();
        }

    }

    async update(obj) {
        // update in mongo db 
        let newObj = null;
        if (this.props.id) {
            newObj = await this.Model.findByIdAndUpdate(this.props.id, obj, { new: true });
        }
        else {

            newObj = await this.Model.findOneAndUpdate(this.props, obj, { new: true });
        }

        if (global.redisClient.connected) {
            // update in redis;
            this.saveToCache(newObj);
        }
        return newObj;
    }

    async delete() {
        // update in mongo db
        await this.Model.findByIdAndDelete(this.props.id)
        if (global.redisClient.connected) {
            // update in redis;
            this.removeFromCache();
        }
        return true;
    }



}
module.exports = CacheControl;