const express = require('express');
const router = express.Router();
const Checklist = require('../../config/src/models/checklist');

router.get('/', async (req,res) => {
    try {
        const checklist = await Checklist.find();
        res.status(200).render('checklists/index', { checklists: checklist });
    } catch(e) {
        res.status(500).render('pages/error', { error: 'Erro ao exibir as listas' });
    }
});

router.get('/new', async(req,res) => {
    try {

        let checklist = new Checklist();
        res.status(200).render('checklists/new', { checklist })

    } catch(e) {
        res.status(500).render('pages/error', {error: 'Erro'});
    }
});

router.get('/:id/edit', async (req,res) => {

    try {

        const id = req.params.id;
        const checklist = await Checklist.findById(id);
        res.status(200).render('checklists/edit', { checklist });

    } catch(e) {
        res.status(400).render('pages/error', { error: 'Erro ao exibir as listas' });
    }
});

router.get('/:id', async (req,res) => {
    try {
        const id = req.params.id;

        /* 
        
            Chamamos o populate('taks') para que ele busque e injete
            todas as tasks associadas a esse checklist.

            Esse populate é similar ao aggregate(), a diferenca é que 
            o mongoose não reconhece esse metodo aggregate, seu método
            é o populate.
        
        */ 

        const checklist = await Checklist.findById(id).populate('tasks');
        res.status(200).render('checklists/show', { checklist });
    } catch(e) {
        res.status(400).render('pages/error', { error: 'Erro ao exibir as listas' });
    }
});

router.post('/', async (req,res) => {
    const { name } = req.body.checklist;
    const checklist = new Checklist({name});
    
    try {
        await checklist.save();
        res.redirect('/checklists');
    } catch(e) {
        res.status(422).render('checklists/new', { checklists: {...checklist}, error: e });
    }

});

router.put('/:id', async (req,res) => {
    
    const { name } = req.body.checklist;
    const checklist = await Checklist.findById(req.params.id);

    try {

        // filter + operador atomico e  objeto de valores novos
        await Checklist.updateOne({ _id: req.params.id }, { $set: { name } });
        res.status(200).redirect('/checklists'); // redireciona para a page checklist

    } catch(e) {
        const errors = e.errors;
        res.status(400).render('/checklists/edit', { checklist: {...checklist}, errors });
    }
});


router.delete('/:id', async (req,res) => {
    
    try {
        await Checklist.findByIdAndDelete(req.params.id);
        res.status(200).redirect('/checklists');
    } catch (e) {
        res.status(500).render('pages/error', {error: 'Erro ao deletar lista de tarefas '});
    }

});


/* 
    O : indica que nesse ponto da URL é esperado
    um parâmetro que indica o id do item.

    : = parâmetro
    ? = query

 */


module.exports = router;