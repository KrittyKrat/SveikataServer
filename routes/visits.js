const express = require("express");
const router = express.Router();
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

router.get('/:id', authorization.authenticateTokenUser, getInstitution, (req, res) => {
    res.json(res.institution);
})

router.post('/', authorization.authenticateTokenAdmin, async (req, res) => {
    const institution = new Institution({
        name: req.body.name,
        adress: req.body.adress
    });

    try{
        const newInstitution = await institution.save();
        res.status(201).json(newInstitution);
    } catch(e){
        res.status(400).json({ message: e.message });
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