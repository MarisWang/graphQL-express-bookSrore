const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  bookname:String,
  genre:String,
  authorname:String,
});

module.exports = mongoose.model("Book",bookSchema);