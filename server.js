const express = require('express');
const reload = require('reload');
const app = express();
app.use(express.static("./public"));
app.set("view engine", "ejs");
app.set("views","./views");

const server = require('http').Server(app);
const io = require("socket.io")(server);
server.listen(3000);

const userData = [ "aaa"]




app.get("/", function( req,res )  {
    res.render("trangchu");
});