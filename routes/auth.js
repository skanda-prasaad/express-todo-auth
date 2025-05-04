const express = require('express');
const router = express.Router();

router.post('/signup', function(req, res){
    const {username , password} = req.body;
    if(!username || !password){
        res.status(400).send("Username and password are required...");
    }
})