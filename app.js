const express= require('express');
const app= express();
app.use(express.json());
const bcrypt = require('bcrypt');   
const jwt = require('jsonwebtoken');
const port = 3000;

app.get("/", (req, res) => {
    res.json({
        message: "Welcome to the news aggregator API by saiharish"
    });
});



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
