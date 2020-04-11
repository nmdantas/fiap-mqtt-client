const router = require('express').Router();
const repository = require('../repository/postgre');

router.get('/establishments', async (req, res) => {
    const result = await repository.establishment.findAll(req.query.active);
    
    if (result.length > 0) {
        res.json(result);
    } else {
        res.status(404).end();
    }
});

router.post('/establishments', async (req, res) => {
    const result = await repository.establishment.create(req.body);
    
    if (result) {
        res.status(201).json(result);
    } else {
        res.status(400).end();
    }
});

router.get('/establishments/:id', async (req, res) => {
    const result = await repository.establishment.findById(req.params.id);
    
    if (result) {
        res.json(result);
    } else {
        res.status(404).end();
    }
});

router.get('/establishments/:id/assets', async (req, res) => {
    const result = await repository.asset.findByEstablishmentId(req.params.id);
    
    if (result.length > 0) {
        res.json(result);
    } else {
        res.status(404).end();
    }
});

router.put('/establishments/:id/assets/:asset_id', async (req, res) => {
    const result = await repository.asset.associate(req.params.id, req.params.asset_id);
    
    if (result) {
        res.json(result);
    } else {
        res.status(400).end();
    }
});

router.delete('/establishments/:id', async (req, res) => {
    const result = await repository.establishment.delete(req.params.id);
    
    if (result) {
        res.json(result);
    } else {
        res.status(404).end();
    }
});

module.exports = router;