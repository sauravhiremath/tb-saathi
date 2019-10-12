import express from "express";
import hbs from "express-handlebars";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import session from "express-session";
import http from "http";

const app = express();
require("dotenv").config();
const port = process.env.PORT || 4000;
const server = new http.Server(app);
const MongoDBStore = require("connect-mongodb-session")(session);

export const mongo_uri = "mongodb://localhost:27017/tbsaathi";
export const connect = mongoose.connect(mongo_uri, { useMongoClient: true });

app.set("views", __dirname + "/views");

app.use("/static", express.static("static"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
	session({
		secret: process.env.SECRET_KEY,
		saveUninitialized: true,
		resave: true,
		store: new MongoDBStore({
			uri: "mongodb://localhost:27017/tbsaathi",
			collection: "mySessions"
		})
	})
);

