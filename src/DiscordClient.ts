import { MessageService } from "./MessageService";
import { DiscordClientWrapper } from './DiscordClientWrapper';
import { DiscordAuthInterface } from "./DiscordClientAuth";
import { RabbitmqServiceConfig } from './RabbitmqService';
import { WebhookAgent } from "./WebhookAgent";
import { LoggedInClient } from "./LoggedInClient";

export interface DiscordClientInterface {
    client: DiscordClientWrapper,
    rabbitmq: MessageService,
    webhookAgent: WebhookAgent,
}

export interface DiscordClientConfig {
    botConfig: DiscordAuthInterface;
    rabbitmqServiceConfig: RabbitmqServiceConfig;
}

export class DiscordClient {
    // variables here
    // @ts-ignore
    private client;
    // @ts-ignore
    private rabbitmq;
    // @ts-ignore
    private webhookAgent;

    // Constructor
    constructor(tools: DiscordClientInterface) {
        this.client = tools.client;
        this.rabbitmq = tools.rabbitmq;
        this.webhookAgent = tools.webhookAgent;
        this.registerDataConsumer();
    }

    // create method
    // Creates an instance of this Client
    static async create(config: DiscordClientConfig): Promise<DiscordClient> {
        const tools = await this.init(config);
        const instance = new DiscordClient(tools);
        return instance;
    }

    // init method
    static async init(config: DiscordClientConfig): Promise<DiscordClientInterface> {
        return new Promise(async (resolve, reject) => {
            try {
                // MessageService
                const rabbitmq = await MessageService.create(config.rabbitmqServiceConfig);

                const webhookAgent = await WebhookAgent.create(rabbitmq, "webhook_data");

                // Discord.js Connection
                const client = new LoggedInClient(
                    {bot_credentials: config.botConfig, webhookAgent});

                const completedSetup = {
                    client,
                    rabbitmq,
                    webhookAgent
                }
                resolve(completedSetup);
            } catch (error) {
                reject(error);
            }
        })
    }

    private registerDataConsumer() {
        this.webhookAgent.setupConsumer((msg) => {
            console.log(msg?.content.toString());
        });
    }

    // @ts-ignore
    private registerLoginHandler() {

    }

    // getObservable(name);
    // getObservable(id);
}