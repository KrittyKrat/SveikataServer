const express = require("express");
const Department = require("../models/Department");
const router = express.Router();
const Institution = require('../models/Institution');
const authorization = require("../middle/auth");

router.get('/', authorization.authenticateTokenUser, async (req, res) => {
    try{
        const institutions = await Institution.find();
        res.json(institutions);
    } catch(e){
        res.status(500).json({ message: e.message });
    }
})

router.get('/:id', getInstitution, (req, res) => {
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

router.put('/:id', getInstitution, async (req, res) => {

    if(req.body.name != null && req.body.adress != null){
        res.institution.name = req.body.name;
        res.institution.adress = req.body.adress;
    }

    try{
        const updatedInstitution = await res.institution.save();
        res.json(updatedInstitution);
    } catch(e){
        res.status(400).json({ message: e.message });
    }
})

router.delete('/:id', getInstitution, async (req, res) => {

    const departments = await Department.find({ institutionID: req.params.id });

    if(departments.length > 0){
        res.json({ message: "Delete departments first" })
        return;
    }

    try{
        //await res.institution.remove();
        res.json({ message: "Institution deleted" })
    } catch(e){
        res.status(500).json({ message: e.message });
    }
})

async function getInstitution(req, res, next){
    
    let institution;

    try{
        institution = await Institution.findById(req.params.id);
        if(institution == null){
            return res.status(404).json({ message: 'Cannot find institution'});
        }
    } catch(e){
        res.status(500).json({ message: e.message });
    }

    res.institution = institution;
    next();
}

module.exports = router;