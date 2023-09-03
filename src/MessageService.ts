import { RabbitmqServiceConfig, RabbitmqService } from "./RabbitmqService";
import amqp from "amqplib";


interface MessageServiceConfig {
    rabbitmq: RabbitmqService
}

export class MessageService {
    private rabbitmq: RabbitmqService;

    constructor(config: MessageServiceConfig) {
        this.rabbitmq = config.rabbitmq;
    }

    static async create(options: RabbitmqServiceConfig): Promise<MessageService> {
        const config = await this.init(options);
        const instance = new MessageService(config);
        return instance;
    }

    // public sendWebhookPayload(payload: webhookPayload) {
    //     try {
    //         this.webhookChannel.sendToQueue(this.webhookQueue.queue || 'webhook_queue', Buffer.from(`${payload.guildId} ${payload.code}`));
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    static async init(options: RabbitmqServiceConfig): Promise<MessageServiceConfig> {
        return new Promise(async (resolve, reject) => {
            try {
                // Create connection to RabbitMQ
                const rabbitmq = await this.setupConnection(options);
                const initializedService = { rabbitmq };
                resolve(initializedService);
            } catch (error) {
                reject(error);
            }
        })
    }

    static async setupConnection(options: RabbitmqServiceConfig): Promise<RabbitmqService> {
        return new Promise(async (resolve, reject) => {
            try {
                const rabbitmq = new RabbitmqService(options);
                await rabbitmq.connect();
                resolve(rabbitmq);               
            } catch(error) {
                reject(error);
            }
        });
    }

    async createChannel(): Promise<amqp.Channel> {
        return new Promise(async (resolve, reject) => {
            try {
                const channel = await this.rabbitmq.createChannel();
                channel.prefetch(1);
                resolve(channel);
            } catch (error) {
                reject(error);
            }
        })
    }

    async createStream(channel: amqp.Channel, queueName: string) {
        console.log(`Setting up stream ${queueName}`);
        const queue = await channel.assertQueue(queueName, {
            durable: true,
            arguments: {
            "x-queue-type": "stream",
            // 'exclusive': 'false'
            },
        })
        return queue;
    }
}

