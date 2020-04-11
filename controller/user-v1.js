const router = require('express').Router();
const repository = require('../repository/postgre');

router.get('/users', async (req, res) => {
    const result = await repository.user.findAll();
    
    if (result.length > 0) {
        res.json(result);
    } else {
        res.status(404).end();
    }
});

router.post('/users', async (req, res) => {
    const result = await repository.user.create(req.body.name);
    
    if (result) {
        res.status(201).json(result);
    } else {
        res.status(400).end();
    }
});

router.get('/users/:id', async (req, res) => {
    const result = await repository.user.findById(req.params.id);
    
    if (result) {
        res.json(result);
    } else {
        res.status(404).end();
    }
});

router.delete('/users/:id', async (req, res) => {
    const result = await repository.user.delete(req.params.id);
    
    if (result) {
        res.json(result);
    } else {
        res.status(404).end();
    }
});

module.exports = router;