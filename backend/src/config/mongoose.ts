import mongoose from "mongoose";

mongoose.connect("mongodb://localhot/drivetest");
const db = mongoose.connection;
db.on('error', console.error.bind(console, ' DB connection error:'));
db.once('open', () => {
    console.log("DB Connected Successfully...");
});

  module.exports = db;