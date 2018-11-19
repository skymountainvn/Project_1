const express = require("express");
const bodyParser = require("body-parser");
const reload = require("reload");
const upload = require("./uploadConfig");
const user  = require("./models/user.model")