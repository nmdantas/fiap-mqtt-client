const mqtt = require('mqtt');
const redis = require('redis');

const mqttClient = mqtt.connect('mqtt://likyjqkw:Zwx1-XnEvWgV@tailor.cloudmqtt.com:14970');
const redisClient = redis.createClient('redis://h:p8ad81150b756c40e26aa0022d8b037a6eabef4613ea73750d2fee8cd3c77c3f4@ec2-52-202-177-173.compute-1.amazonaws.com:29379');

redisClient.on('ready', () => {
    console.info('REDIS:Ready');
});

redisClient.on('connect', () => {
    console.info('REDIS:Connect');
});

redisClient.on('error', (error) => {
    console.error('REDIS:Error');
    console.error(error);
});

redisClient.get('test/test', (error, reply) => {
    if (error) {
        console.error('REDIS:Error');
        console.error(error);
    } else {
        console.error('REDIS:Get');
        console.info(reply);
    }
});

mqttClient.on('connect', () => {
    console.info('MQTT:Connect');

    mqttClient.subscribe('test/test');
});

mqttClient.on('message', (topic, message) => {
    console.info('MQTT:Message:' + topic);

    if (topic === 'test/test') {
        console.info(message.toString());

        redisClient.set(topic, message.toString());
    }
});
