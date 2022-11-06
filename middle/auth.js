require('dotenv').config()
const express = require('express')
const jwt = require('jsonwebtoken')

function authenticateTokenUser (req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
  
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (e, user) => {
        if (e) return res.sendStatus(403)
        req.user = user
        next()
    })
}

function authenticateTokenAdmin (req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
  
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (e, user) => {
        if (e || user.role != "Admin") return res.sendStatus(403)
        req.user = user
        next()
    })
}

module.exports = { authenticateTokenUser, authenticateTokenAdmin };