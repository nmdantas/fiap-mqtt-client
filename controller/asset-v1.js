const router = require('express').Router();
const repository = require('../repository/postgre');

router.get('/assets', async (req, res) => {
    const result = await repository.asset.findAll(req.query.active);
    
    if (result.length > 0) {
        res.json(result);
    } else {
        res.status(404).end();
    }
});

router.post('/assets', async (req, res) => {
    const result = await repository.asset.create(req.body);
    
    if (result) {
        res.status(201).json(result);
    } else {
        res.status(400).end();
    }
});

router.get('/assets/:id', async (req, res) => {
    const result = await repository.asset.findById(req.params.id);
    
    if (result) {
        res.json(result);
    } else {
        res.status(404).end();
    }
});

router.delete('/assets/:id', async (req, res) => {
    const result = await repository.asset.delete(req.params.id);
    
    if (result) {
        res.json(result);
    } else {
        res.status(404).end();
    }
});

router.get('/assets/:id/logs', async (req, res) => {
    const result = await repository.asset.location.history(req.params.id);
    
    if (result.length > 0) {
        res.json(result);
    } else {
        res.status(404).end();
    }
});

router.put('/assets/:id/logs', async (req, res) => {
    req.body.timestamp = new Date();

    const result = await repository.asset.location.update(req.params.id, req.body);
    
    if (result) {
        res.json(result);
    } else {
        res.status(400).end();
    }
});

module.exports = router;