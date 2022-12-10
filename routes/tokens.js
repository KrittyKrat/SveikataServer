require('dotenv').config()

const express = require("express");
const router = express.Router();
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const authorization = require("../middle/auth");

router.post('/login', async (req, res) => {

    const user = await User.findOne( { username: req.body.username } );
    if (user == null) {
        return res.status(400).send({ message: "Cannot find user" })
    }

    try {
        if(await bcrypt.compare(req.body.password, user.password)) {
            //res.status(201).json({ message: "Logged In" })
        } 
        else {
            res.status(400).json({ message: "Wrong password" })
        }
    } catch(e) {
        res.status(500).json( { message: e.message })
    }

    //const userForToken = { username: req.body.username, role: req.body.role };
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    //const refreshTokenDB = new RefreshToken({
    //    refreshToken: refreshToken,
    //});
    await refreshTokenDB.save();

    return res.status(201).json({ accessToken: accessToken, refreshToken: refreshToken })
})

router.delete("/logout", async (req, res) => {
    try {
        const refreshToken = await RefreshToken.findOne({ refreshToken: req.body.token });
        if (!refreshToken) return res.status(404).json({ message: "Token does not exist" });

        const refreshTokenDB = await RefreshToken.deleteOne({ refreshToken: refreshToken.refreshToken });
        res.status(200).json({ message: "Deleted" });
    } catch (e) {
        res.status(500).json({ message: e });
    }
})

router.put('/token', async (req, res) => {

    const refreshToken = req.body.token;
    if (!refreshToken) return res.sendStatus(401).json({ message: "No token" });

    const refreshTokenDB = await RefreshToken.findOne({ refreshToken: refreshToken });
    if (refreshTokenDB == null) return res.sendStatus(403);

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (e, user) => {
        
      if (e) return res.sendStatus(403).json({ message: e.message });
      const accessToken = generateAccessToken(user);
      return res.json({ accessToken: accessToken });
    })
})

function generateAccessToken(user){
    return jwt.sign({ id: user._id, username: user.username, role: user.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m'});
}

function generateRefreshToken(user){
    return refreshToken = jwt.sign({ id: user._id, username: user.username, role: user.role }, process.env.REFRESH_TOKEN_SECRET);
}

module.exports = router;
