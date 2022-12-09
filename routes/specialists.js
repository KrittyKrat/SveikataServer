const express = require("express");
const Department = require("../models/Department");
const router = express.Router({ mergeParams: true });
const Specialist = require('../models/Specialist');
const authorization = require("../middle/auth");

router.get('/', authorization.authenticateTokenGeneral, async (req, res) => {
    try{

        const temp1 = await Department.find( {institutionID: req.params.institutionID });

        if(temp1.length == 0){
            res.json({ message: "Invalid Institution ID" });
            return;
        }

        let found = false;
        
        for(let i = 0; i < temp1.length; i++)
        {
            if(temp1.at(i).id == req.params.departmentID)
            {
                found = true;
                break;
            }
        }

        if(!found){
            res.json({ message: "Wrong Department ID" });
            return;
        }

        const Specialists = await Specialist.find({ departmentID: req.params.departmentID });

        res.json(Specialists);
    } catch(e){
        res.status(500).json({ message: e.message });
    }
})

router.get('/:id', authorization.authenticateTokenGeneral, getSpecialist, (req, res) => {
    res.json(res.specialist);
})

router.post('/', authorization.authenticateTokenAdmin, async (req, res) => {
    const specialist = new Specialist({
        name: req.body.name,
        surname: req.body.surname,
        age: req.body.age,
        departmentID: req.params.departmentID
    });

    try{
        const newSpecialist = await specialist.save();
        res.status(201).json(newSpecialist);
    } catch(e){
        res.status(400).json({ message: e.message });
    }
})

router.patch('/:id', authorization.authenticateTokenAdmin, getSpecialist, async (req, res) => {
    if(req.body.name != null){
        res.specialist.name = req.body.name;
    }

    if(req.body.surname != null){
        res.specialist.surname = req.body.surname;
    }

    if(req.body.age != null){
        res.specialist.age = req.body.age;
    }

    try{
        const updatedSpecialist = await res.specialist.save();
        res.json(updatedSpecialist);
    } catch(e){
        res.status(400).json({ message: e.message });
    }
})

router.delete('/:id', authorization.authenticateTokenAdmin, getSpecialist, async (req, res) => {
    try{
        await res.specialist.remove();
        res.json({ message: "Specialist deleted" })
    } catch(e){
        res.status(500).json({ message: e.message });
    }
})

async function getSpecialist(req, res, next){
    
    let specialist;

    try{

        const temp1 = await Department.find( {institutionID: req.params.institutionID });

        if(temp1.length == 0){
            res.json({ message: "Cannot find specialist" });
            return;
        }

        let found = false;
        
        for(let i = 0; i < temp1.length; i++)
        {
            if(temp1.at(i).id == req.params.departmentID)
            {
                found = true;
                break;
            }
        }

        if(!found){
            res.json({ message: "Wrong Department ID" });
            return;
        }

        if(!found){
            res.json({ message: "Cannot find specialist" });
            return;
        }

        specialist = await Specialist.findById(req.params.id);
        if(specialist == null){
            return res.status(404).json({ message: 'Cannot find specialist'});
        }
    } catch(e){
        res.status(500).json({ message: e.message });
    }

    res.specialist = specialist;
    next();
}

module.exports = router;