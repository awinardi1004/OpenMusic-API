const amqp = require('amqplib');

class ProducerService {
  constructor(server) {
    this.server = server || process.env.RABBITMQ_SERVER;
  }

  async sendMessage(queue, message) {
    const connection = await amqp.connect(this.server);
    const channel = await connection.createChannel();
    await channel.assertQueue(queue, {
      durable: true,
    });

    await channel.sendToQueue(queue, Buffer.from(message));

    setTimeout(() => {
      connection.close();
    }, 1000);
  }
}

module.exports = ProducerService;
