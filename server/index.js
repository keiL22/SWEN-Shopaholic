// importing framework
const express = require('express');
const app = express()
const cors = require("cors");
require("dotenv").config()

const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const session = require("express-session")

app.use(express.json());
const whitelist = ["https://ec2-3-91-190-197.compute-1.amazonaws.com"]
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true,
}
app.use(cors(corsOptions))

//Used for creating sessions and cookies
app.use(cookieParser())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

app.use(session({
    key: "userId",
    secret:"superSecretPasscode",
    resave: false,
    saveUninitialized: false,
    secure: true,
    proxy : true,
    cookie: {
        expires: 1000 * 60 * 60 * 24,
        sameSite: 'none',
    },
    httpOnly: false,
}))
app.use((req, res, next)=>{
    req["session"].secure = true;
    next();
});
app.set("trust proxy", 1)
//connecting database
const db =require('./models');

//Routers
const productRouter = require('./routes/Products');
app.use("/products", productRouter);
//using /auth routes to ./routes/Users
const userRouter = require('./routes/Users');
app.use("/auth", userRouter);

//server is listening for database requests on this port
db.sequelize.sync().then(() => {
        app.listen(process.env.PORT || 3001, () => {
            console.log("Server running on port 3001");
        })
    })
    .catch((err) => {
        console.log(err);
    })



