const express = require('express');
const cors = require('cors');
const app = express();
const router = require('./routes/index');
const dotenv = require('dotenv');
const corsOptions = {
    origin: true,
    allowedHeaders: [
        "Content-Type",
        "Authorization",
        "Access-Control-Allow-Methods",
        "Access-Control-Request-Headers",
    ],
    credentials: true,
    enablePreflight: true,
};

dotenv.config({ path: './token.env' });
app.use(cors(corsOptions));
app.use(express.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:8080");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});
app.use('/api', router);

app.listen(8081, () => {
    console.log("Server running on 8081");
});