const todoModel = require("../model/todoModel");
const httpStatus = require("http-status")
const redis = require('redis');


// connection of redis
const client = redis.createClient({
    port: 33713,
    host: "apn1-brave-adder-33713.upstash.io",
    password: "69b6358deaf14b44a0f44fbdb31adf8b"
})
console.log(client.isOpen)
client.on('connect', () => console.log('Redis Client Connected'));
client.on('error', (err) => console.log('Redis Client Connection Error', err));



const createTodo = async (req, res) => {
    const data = {
        title: req.body.title,
        content: req.body.content
    };
    if (!data.title) {
        return res.status(httpStatus.BAD_REQUEST).send({ message: "title is required" })
    }
    if (!data.content) {
        return res.status(httpStatus.BAD_REQUEST).send({ message: "content is required" })
    }

    const result = await todoModel.create(data);

    return res.status(httpStatus.CREATED).send({ message: "created successfully", data: result })

};


const getTodoList = async (req, res) => {

    const result = await todoModel.find();
    const datasetRedis = await client.set("todo", 6000, JSON.stringify(result));
    if (!datasetRedis) {
        return
    }
    return res.status(httpStatus.OK).send({ message: "data is....", data: result })
};

const dataFromRedis = async (req, res, next) => {
    client.get("todo", (err, redis_data) => {
        if (err) {
            throw err;
        } else if (redis_data) {
            return res.status(httpStatus.OK).send(JSON.parse(redis_data))
        } else {
            next()
        }
    })
}

module.exports = {
    createTodo,
    getTodoList,
    dataFromRedis
}