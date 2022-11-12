const express = require("express");
const router = express.Router({ mergeParams: true });
const Visit = require('../models/Visit');
const authorization = require("../middle/auth");

router.get('/', authorization.authenticateTokenUser, async (req, res) => {
    try{
        const visit = await Visit.find();
        res.json(visit);
    } catch(e){
        res.status(500).json({ message: e.message });
    }
})

router.get('/:id', authorization.authenticateTokenUser, getVisit, (req, res) => {
    res.json(res.visit);
})

router.post('/', authorization.authenticateTokenUser, async (req, res) => {
    const visit = new Visit({
        description: req.body.description,
        userID: req.params.userID,
        specialistID: req.body.specialistID

    });

    try{
        const newVisit = await visit.save();
        res.status(201).json(newVisit);
    } catch(e){
        res.status(400).json({ message: e.message });
    }
})

router.put('/:id', authorization.authenticateTokenUser, getVisit, async (req, res) => {

    if(req.body.description != null && req.body.specialistID != null){
        res.visit.description = req.body.description;
        res.visit.specialistID = req.body.specialistID;
    }

    try{
        const updatedVisit = await res.visit.save();
        res.json(updatedVisit);
    } catch(e){
        res.status(400).json({ message: e.message });
    }
})

router.delete('/:id', authorization.authenticateTokenUser, getVisit, async (req, res) => {
    try{
        await res.visit.remove();
        res.json({ message: "Visit deleted" })
    } catch(e){
        res.status(500).json({ message: e.message });
    }
})

async function getVisit(req, res, next){
    
    let visit;

    try{
        visit = await Visit.findById(req.params.id);
        if(visit == null){
            return res.status(404).json({ message: 'Cannot find visit'});
        }
    } catch(e){
        res.status(500).json({ message: e.message });
    }

    res.visit = visit;
    next();
}


module.exports = router;