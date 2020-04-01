const mqtt = require('./service/mqtt');
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
   
app.listen(process.env.PORT || 3000);
