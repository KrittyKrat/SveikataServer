const express = require("express");
const router = express.Router({ mergeParams: true });
const Department = require('../models/Department');
const Institution = require("../models/Institution");
const Specialist = require("../models/Specialist");
const authorization = require("../middle/auth");

router.get('/', async (req, res) => {
    try{
        const departments = await Department.find({ institutionID: req.params.institutionID });
        res.json(departments);
    } catch(e){
        res.status(500).json({ message: e.message });
    }
})

router.get('/:id', getDepartment, (req, res) => {
    res.json(res.department);
})

router.post('/', async (req, res) => {
    const department = new Department({
        name: req.body.name,
        description: req.body.description,
        institutionID: req.params.institutionID
    });

    try{
        const newDepartment = await department.save();
        res.status(201).json(newDepartment);
    } catch(e){
        res.status(400).json({ message: e.message });
    }
})

router.put('/:id', getDepartment, async (req, res) => {

    if(req.body.name != null && req.body.description != null){
        res.department.name = req.body.name;
        res.department.description = req.body.description;
    }

    try{
        const updatedDepartment = await res.department.save();
        res.json(updatedDepartment);
    } catch(e){
        res.status(400).json({ message: e.message });
    }
})

router.delete('/:id', getDepartment, async (req, res) => {

    const specialists = await Specialist.find({ departmentID: req.params.id });

    if(specialists.length > 0){
        res.json({ message: "Delete specialists first" })
        return;
    }

    try{
        await res.department.remove();
        res.json({ message: "Department deleted" })
    } catch(e){
        res.status(500).json({ message: e.message });
    }
})

async function getDepartment(req, res, next){
    
    let department;

    try{
        department = await Department.findById(req.params.id);
        const test = await Department.find({ institutionID: req.params.institutionID });

        if(department == null || test.length == 0){
            return res.status(404).json({ message: 'Cannot find department'});
        }
    } catch(e){
        res.status(500).json({ message: e.message });
    }

    res.department = department;
    next();
}

module.exports = router;