const express = require('express');
const router = express.Router();

const todoController = require("../controller/todoController")

router.post("/create", todoController.createTodo)
router.get("/fetchAllTasks", todoController.dataFromRedis, todoController.getTodoList)


module.exports = router;