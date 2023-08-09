 const express = require('express');

const checklistDependentRoute = express.Router();
const individualRoute = express.Router();

const Checklist = require('../../config/src/models/checklist');
const Task = require('../../config/src/models/task');

checklistDependentRoute.get('/:id/tasks/new', async(req,res) => {

    try {

        const task = new Task();
        res.status(200).render('tasks/new', { checklistId: req.params.id, task  });
        
    } catch (error) {
        res.status(422).render('pages/error', { errors: 'Erro ao carregar formulário' });
    }

});

checklistDependentRoute.post('/:id/tasks', async(req,res) => {
    
    const { name } = req.body.task;
    const task = new Task({ name, checklist: req.params.id });
    
    try {

        await task.save();

        const checklist = await Checklist.findById(req.params.id);
        checklist.tasks.push(task);
        await checklist.save();

        res.status(200).redirect(`/checklists/${req.params.id}`);
        
    } catch (error) {
        
        const errors = error.errors;
        res.status(422).render('tasks/new', { task: {...task, errors} , checklistId: req.params.id })

    }
});

individualRoute.delete('/:id', async(req,res) => {

    try {

        const id = req.params.id;
        const task = await Task.findByIdAndDelete(id);

        const checklist = await Checklist.findById(task.checklist._id);
        const taskToRemove = checklist.tasks.indexOf(task);
        checklist.tasks.splice(taskToRemove, 1); // usamos splice pra remover item de um array

        checklist.save();

        res.status(200).redirect(`/checklists/${checklist._id}`);
        
    } catch (error) {
        
        const errors = error.errors;
        res.status(400).render('pages/error', { error: errors });

    }

});

individualRoute.put('/:id', async(req, res) => {
    
    const id = req.params.id;
    const task = await Task.findById(id);
    
    try {

        task.set(req.body.task);
        await task.save();

        res.status(200).json({ task });
        
    } catch (error) {
    
        const errors = error.errors;
        res.status(400).render('pages/error', { error: errors }); 

    }

});

module.exports = { checklistDependentRoute, individualRoute };