const mqtt = require('mqtt');
const redis = require('redis');

const mqttClient = mqtt.connect('mqtt://likyjqkw:Zwx1-XnEvWgV@tailor.cloudmqtt.com:14970');
const redisClient = redis.createClient('redis://h:pd3a1b8206963eea358af12e9ba519a1a39a0105c4e2df6d397744b6f3bfe268d@ec2-52-202-177-173.compute-1.amazonaws.com:12469');

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
        console.info('REDIS:Get');
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
