console.log("SERVER FILE LOADED");

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const messageRoutes = require("./routes/messageRoutes");

const { initSocket } = require("./socket/socket");


const app = express();


// middleware first
app.use(
    cors({
        origin:"http://localhost:5173",
        credentials:true
    })
);

app.use(express.json());


// database
connectDB();


// socket
const server = http.createServer(app);

initSocket(server);


// routes
app.get("/", (req,res)=>{
    res.send("Server Running");
});


app.get("/hello",(req,res)=>{
    res.json({
        message:"HELLO FROM SERVER",
        time:new Date(),
        port:5000
    });
});


app.use("/api/auth",authRoutes);
app.use("/api/messages",messageRoutes);



server.listen(5000,()=>{
    console.log("Server Started");
});