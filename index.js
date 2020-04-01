const REDIS_URL = process.env.REDIS_URL || 'redis://h:pd3a1b8206963eea358af12e9ba519a1a39a0105c4e2df6d397744b6f3bfe268d@ec2-52-202-177-173.compute-1.amazonaws.com:12469';
const DATABASE_URL = process.env.DATABASE_URL || 'postgres://taussjwjzozqga:764f36b6b3a9f0dd85ca7e2143ef24302bb0f283096e4ac2cd0c2bc80120296e@ec2-52-207-93-32.compute-1.amazonaws.com:5432/d9p6h72vsmi2k6';

const mqtt = require('mqtt');
const redis = require('redis');
const postgre = require('pg');

const mqttClient = mqtt.connect('mqtt://likyjqkw:Zwx1-XnEvWgV@tailor.cloudmqtt.com:14970');
const redisClient = redis.createClient(REDIS_URL);
const pool = new postgre.Pool({
    connectionString: DATABASE_URL
});

const createUser = (name) => {
    console.info('POSTGRE:Insert:' + name);

    const params = [];
    params.push(name);

    pool.query('insert into users (name) values ($1) returning *', params, (error, response) => {
        if (error) {
            console.error('POSTGRE:Error');
            console.error(error);
        } else {
            console.info('POSTGRE:Insert:' + response.rows[0]);
        }
    });
};

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

redisClient.get('test/user', (error, reply) => {
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

    mqttClient.subscribe('test/user');
});

mqttClient.on('message', (topic, message) => {
    console.info('MQTT:Message:' + topic);

    if (topic === 'test/user') {
        const userName = message.toString();
        console.info(userName);

        redisClient.set(topic, userName);

        createUser(userName);
    }
});
