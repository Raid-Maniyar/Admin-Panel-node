const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/raid-adminPanel');
    console.log("MongoDB Connected successfully");
  } catch (err) {
    console.error(err);
  }
};

module.exports = connectDB;