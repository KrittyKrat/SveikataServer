require('dotenv').config()

const express = require("express");
const router = express.Router();
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const authorization = require("../middle/auth");

router.get('/:id', authorization.authenticateTokenAdmin, async (req, res) => {

    try{
        const user = await User.findById(req.params.id);
        res.json(user);
    } catch(e){
        res.status(500).json({ message: e.message });
    }
})

router.get('/', authorization.authenticateTokenAdmin, async (req, res) => {

    try{
        const users = await User.find();
        res.json(users);
    } catch(e){
        res.status(500).json({ message: e.message });
    }
})

router.post('/register', async (req, res) => {

    const userCount = await User.find( { username: req.body.username } );
    if(userCount.length > 0){
        return res.status(400).json( { message: "Username exists"});
    }

    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            username: req.body.username,
            password: hashedPassword,
            role: req.body.role
        });

        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch(e) {
        res.status(500).json({ message: e.message });
  }
})

module.exports = router;