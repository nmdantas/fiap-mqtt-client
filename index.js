const mqtt = require('./service/mqtt');
const repository = require('./repository/postgre');
const express = require('express');
const bodyParser  = require('body-parser');
const app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.json(mqtt.status);
});

app.post('/api/v1/messages', (req, res) => {
    const result = mqtt.publish(req.body);
    
    res.json(result);
});

app.get('/api/v1/users', async (req, res) => {
    const result = await repository.user.findAll();
    
    if (result.length > 0) {
        res.json(result);
    } else {
        res.status(404).end();
    }
});

app.post('/api/v1/users', async (req, res) => {
    const result = await repository.user.create(req.body.name);
    
    if (result) {
        res.json(result);
    } else {
        res.status(400).end();
    }
});

app.get('/api/v1/users/:id', async (req, res) => {
    const result = await repository.user.findById(req.params.id);
    
    if (result) {
        res.json(result);
    } else {
        res.status(404).end();
    }
});

app.delete('/api/v1/users/:id', async (req, res) => {
    const result = await repository.user.delete(req.params.id);
    
    if (result) {
        res.json(result);
    } else {
        res.status(404).end();
    }
});
   
app.listen(process.env.PORT || 3000);
