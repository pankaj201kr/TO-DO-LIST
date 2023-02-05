const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const path = require('path')
require('dotenv').config({ path: path.relative(process.cwd(), path.join(__dirname, '../.env')) });
const cors = require('cors');
const todoModel = require("../model/todoModel")

const app = express();
app.use(cors());

const server = http.createServer(app);
const webSocket = require('ws').Server;
const ws = new webSocket({ server });

mongoose.connect("mongodb://localhost:27017/to-do-list")
    .then(() => console.log("connect to database"))
    .catch(err => console.log('could not connect', JSON.stringify(err)));


ws.on('connection', async (socket) => {
    socket.isAlive = true;
    socket.on('pong', () => {
        socket.isAlive = true;
    });
    socket.on('message', async () => {

        const data = await todoModel.find({});
        socket.send(data.toString());

    });
    socket.on('close', () => {
        console.log('Lost a client');
    });
    console.log("one more client connected");
});

app.get("/", (req, res) => {
    res.send("successfull");

});


server.listen(3000, () => {
    console.log(`Server start on port ${3000}`);
});