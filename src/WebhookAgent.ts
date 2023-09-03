import { MessageService } from "./MessageService";
import { MessageAgent } from './MessageAgent';
import amqp, { ConsumeMessage } from 'amqplib';

interface WebhookStream {
    channel: amqp.Channel,
    queueName: string,
    stream: amqp.Replies.AssertQueue
}

/* WebhookAgent 
* WebhookAgent is a special class of MessageAgent that handles the webhook angle
*/
export class WebhookAgent extends MessageAgent {
    // variables
    private stream: WebhookStream;

    constructor(messageService: MessageService, webhookStream: WebhookStream) {
        super(messageService, webhookStream.queueName);
        this.stream = webhookStream;
        this.registerErrorHandlers();
    }

    static async create(messageService: MessageService, queueName: string): Promise<WebhookAgent> {
        const stream = await this.init(messageService, queueName)
        const instance = new WebhookAgent(messageService, stream);
        return instance;
    }

    static async init(messageService: MessageService, queueName: string): Promise<WebhookStream> {
        const channel = await messageService.createChannel();
        const webhookStream = await messageService.createStream(channel, queueName);
        const stream: WebhookStream = { channel, queueName, stream: webhookStream }
        return stream;
    }

    public sendPayload(payload: Buffer) {
        try {
            this.stream.channel.sendToQueue(this.stream.queueName,
                payload
                );
        } catch (error) {
            console.log(error);
        }
    }

    public setupConsumer(onMessage: (msg: ConsumeMessage | null) => void) {
        let consumerTag = this.stream.channel.consume(
            this.stream.queueName, (msg: ConsumeMessage | null) => {
            try {
                if (msg) {
                    onMessage(msg);
                    this.stream.channel.ack(msg)
                }
            } catch (error) {
                console.log(error);
            }
        });
        return consumerTag;
    }

    private registerErrorHandlers() {
        this.stream.channel.on('error', (error) => {
            console.log(error);
        });

        this.stream.channel.on('close', () => {
            console.log("Stream closed unexpectedly");
        })
    }
}