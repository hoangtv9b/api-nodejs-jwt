const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const initWebRouter = require("./routes/web");
const initAuthRouter = require("./routes/auth");
const cookieParser = require("cookie-parser");
const app = express();
dotenv.config();
app.use(express.json());
app.use(cookieParser());
mongoose.connect(process.env.CONNECT_MONGODB)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error);
  });
initWebRouter(app);
initAuthRouter(app);
app.listen(process.env.PORT, ()=>{
  console.log(`Server is running port ${process.env.PORT}`);
})