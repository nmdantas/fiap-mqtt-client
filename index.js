const DATABASE_URL = process.env.DATABASE_URL || 'postgres://taussjwjzozqga:764f36b6b3a9f0dd85ca7e2143ef24302bb0f283096e4ac2cd0c2bc80120296e@ec2-52-207-93-32.compute-1.amazonaws.com:5432/d9p6h72vsmi2k6';

const express = require('express');
const mqtt = require('mqtt');
const postgre = require('pg');

const app = express();
const mqttClient = mqtt.connect('mqtt://likyjqkw:Zwx1-XnEvWgV@tailor.cloudmqtt.com:14970');
const databasePool = new postgre.Pool({
    connectionString: DATABASE_URL
});

const createUser = (name) => {
    console.info('POSTGRE:Insert:' + name);

    const params = [];
    params.push(name);

    databasePool.query('insert into users (name) values ($1) returning *', params, (error, response) => {
        if (error) {
            console.error('POSTGRE:Error');
            console.error(error);
        } else {
            console.info('POSTGRE:Insert:' + JSON.stringify(response.rows[0]));
        }
    });
};

const startDate = new Date();
const messages = [];

app.get('/', (req, res) => {
    res.json({
        since: startDate,
        count: messages.length,
        itens: messages
    });
});

app.post('/', (req, res) => {
  
});
   
app.listen(process.env.PORT || 3000);

mqttClient.on('connect', () => {
    console.info('MQTT:Connect');

    mqttClient.subscribe('test/user');
});

mqttClient.on('message', (topic, message) => {
    console.info('MQTT:Message:' + topic);

    messages.push({
        topic: topic,
        content: message.toString()
    });

    if (topic === 'test/user') {
        const userName = message.toString();
        console.info(userName);

        createUser(userName);
    }
});
