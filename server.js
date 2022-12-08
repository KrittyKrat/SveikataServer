const express = require("express");
const app = express();
const PORT = 4000;
const mongoose = require('mongoose');
const Institution = require('./models/Institution')
const Department = require("./models/Department");
const Specialist = require("./models/Specialist");
const Visit = require('./models/Visit');
const authorization = require("./middle/auth");
const jwt = require('jsonwebtoken')
const cors = require("cors");
require('dotenv/config')

mongoose.connect(
  process.env.DB_CONNECTION,
  () => console.log('Connected!')
);

app.use(express.json());
app.use(cors());

app.get('/api', async (req, res) => {
    res.send("Help");
})

const userRouter = require('./routes/users');
app.use('/api/users', userRouter);

const tokenRouter = require('./routes/tokens');
app.use('/api/tokens', tokenRouter);

const visitRouter = require('./routes/visits');
app.use('/api/users/:userID/visits', visitRouter);

const institutionRouter = require('./routes/institutions');
app.use('/api/institutions', institutionRouter);

const departmentRouter = require('./routes/departments');
app.use('/api/institutions/:institutionID/departments', departmentRouter);

const specialistRouter = require('./routes/specialists');
app.use('/api/institutions/:institutionID/departments/:departmentID/specialists', specialistRouter);

app.get('/api/visits', authorization.authenticateTokenAdmin, async (req, res) => {
    try{
        const visit = await Visit.find();
        res.json(visit);
    } catch(e){
        res.status(500).json({ message: e.message });
    }
})

app.get('/api/departments', authorization.authenticateTokenGeneral, async (req, res) => {
    try{
        const departments = await Department.find();
        res.json(departments);
    } catch(e){
        res.status(500).json({ message: e.message });
    }
})

app.get('/api/specialists', authorization.authenticateTokenGeneral, async (req, res) => {
    try{
        const specialists = await Specialist.find();
        res.json(specialists);
    } catch(e){
        res.status(500).json({ message: e.message });
    }
})

app.listen(process.env.PORT || PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
