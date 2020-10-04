const mqtt = require('./service/mqtt');
const userV1 = require('./controller/user-v1');
const assetV1 = require('./controller/asset-v1');
const establishmentV1 = require('./controller/establishment-v1');
const express = require('express');
const bodyParser  = require('body-parser');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.json(mqtt.status);
});

app.post('/api/v1/messages', (req, res) => {
    const result = mqtt.publish(req.body);
    
    res.json(result);
});

app.use('/api/v1', userV1);
app.use('/api/v1', assetV1);
app.use('/api/v1', establishmentV1);
   
app.listen(process.env.PORT || 3000);

console.log('Server started...');
