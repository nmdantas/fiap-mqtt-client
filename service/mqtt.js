const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://likyjqkw:Zwx1-XnEvWgV@tailor.cloudmqtt.com:14970');
const database = require('../repository/postgre');

const messages = [];
const startDate = new Date();

let ready = false;

const publish = (message) => {
    console.info('MQTT:Publish');

    if (ready) {
        let content;

        if (typeof message.content === 'object') {
            content = JSON.stringify(message.content);
        } else {
            content = message.content.toString();
        }

        const result = client.publish(message.topic, content);

        return {
            correlationId: result.nextId
        };
    }
};

client.on('connect', () => {
    console.info('MQTT:Connect');

    client.subscribe('test/user');

    ready = true;
});

client.on('message', async (topic, message) => {
    console.info('MQTT:Message:' + topic);

    messages.push({
        date: new Date(),
        topic: topic,
        content: message.toString()
    });

    switch (topic) {
        case 'test/user':
            const userName = message.toString();
            console.info(userName);

            const newUser = await database.user.create(userName);
            console.info('MQTT:User-Insert:' + JSON.stringify(newUser));
            break;
        default:
            console.info(message.toString());
            break;
    }
});

module.exports = {
    publish: publish,
    status: {
        since: startDate,
        itens: messages
    }
};