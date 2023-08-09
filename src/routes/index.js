const express = require('express');
const router = express.Router();

router.get('/', async(req,res) => {
    res.render('pages/index');
});

router.get('/list-checklists', async(req,res) => {
    res.render('pages/list-checklists');
});


module.exports = router;