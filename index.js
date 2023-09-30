const express = require("express");
const bodyParser = require("body-parser");
const PORT = 3000;
const tasksData = require("./data/tasks.json");
const fs = require("fs");

const app = express();

app.use(bodyParser.json())

app.listen(PORT, (error) => {
    if (error) {
        console.log(error)
    }
    else {
        console.log(`Server running at ${PORT} successfully...`)
    }
})

app.get("/tasks", (request, response) => {
    return response.status(200).json({ data: tasksData });
})

app.get("/tasks/:id", (request, response) => {
    const { id } = request.params;
    const filteredTask = tasksData.find((task) => (parseInt(task.id) === parseInt(id)));
    console.log(filteredTask)
    return response.status(200).json({ data: filteredTask })
})

app.post("/tasks", (request, response) => {
    const { title, description, priority, completed } = request.body;
    const newTask = { id: tasksData.length + 1, title, taskDescription, priority, completed };
    tasksData.push(newTask)
    try {
        fs.writeFileSync("./data/tasks.json", JSON.stringify(tasksData, null, 4));
        response.status(201).json({ data: newTask, message: "Task created succesfully!" });
    } catch (error) {
        console.error("Error writing to tasks.json:", error);
        response.status(500).json({ error: "Internal Server Error" });
    }
})

app.put("/tasks/:id", (request, response) => {
    const { id } = request.params;
    const body = request.body;
    const requiredTaskId = tasksData.findIndex((task) => (task.id === parseInt(id)));
    if (requiredTaskId !== -1) {
        tasksData[requiredTaskId] = { ...tasksData[requiredTaskId], ...body };
        try {
            fs.writeFileSync("./data/tasks.json", JSON.stringify(tasksData, null, 4));
            response.status(200).json({ data: tasksData[requiredTaskId], message: "Task modified successfully!" });
        }
        catch (error) {
            response.status(500).json({ message: "Internal Server Error" })
        }
    }
    else {
        response.status(404).json({ messsage: "Task not found." })
    }
})

app.delete("/tasks/:id", (request, response) => {
    const { id } = request.params;
    const requestedTaskId = tasksData.findIndex((task) => (task.id === parseInt(id)));
    if (requestedTaskId !== -1) {
        tasksData.splice(requestedTaskId, 1);
        try {
            fs.writeFileSync("./data/tasks.json", JSON.stringify(tasksData, null, 4));
            response.status(200).json({ message: "Task deleted successfully!" });
        } catch (error) {
            console.error("Error writing to tasks.json:", error);
            response.status(500).json({ error: "Internal Server Error" });
        }
    } else {
        response.status(404).json({ message: "Task not found" });
    }
})