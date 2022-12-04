require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

//My routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");
const stripeRoutes = require("./routes/stripePayment")
const paymentBRoutes = require("./routes/paymentBRoutes")

// Db Connection
mongoose
.connect(process.env.DATABASE,{
    useUnifiedTopology:true,
    useNewUrlParser:true,
    useCreateIndex : true
})
.then(() => {
    console.log("DB CONNECTED")
});

//MiddleWare
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//My Routes
app.use("/api",authRoutes);
app.use("/api",userRoutes);
app.use("/api",categoryRoutes);
app.use("/api",productRoutes);
app.use("/api",orderRoutes);
app.use("/api",stripeRoutes);
app.use("/api",paymentBRoutes);


//PORT
const port = process.env.PORT || 8000;

// Strating a Server
app.listen(port,() => {
    console.log(`app is running at ${port}`);
});