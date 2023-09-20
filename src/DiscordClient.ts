import { MessageService } from "./MessageService";
import { DiscordClientWrapper } from './DiscordClientWrapper';
import { DiscordAuthInterface } from "./DiscordClientAuth";
import { RabbitmqServiceConfig } from './RabbitmqService';
import { WebhookAgent } from "./WebhookAgent";
import { Events } from "discord.js";

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
        this.registerErrorHandlers();
        this.registerMessageHandler();
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

                const client = new DiscordClientWrapper(config.botConfig);
                client.client.login(config.botConfig.loginToken);
                // Discord.js Connection
                // const client = new LoggedInClient(
                //     {bot_credentials: config.botConfig, webhookAgent});
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

    // @ts-ignore
    private registerDataConsumer() {
        this.webhookAgent.setupConsumer((msg) => {
            if (msg) {
                console.log(msg.content.toString());
                this.registerLoginHandler(msg.content.toString());
            }
        });
        console.log('webhook_data consumer set up.');
    }

    // @ts-ignore
    private async registerLoginHandler(loginCode: string) {
        let accessToken = await this.client.auth.getAccessToken(loginCode);
        console.log(`Login Code: ${loginCode}\nAccess Token: ${accessToken}`);
        let response = await this.client.auth.postAccessToken(accessToken);
        console.log(`response from postAccessToken (maybe a token) ${response}`);
    }

    private registerErrorHandlers() {
        const client = this.client.getClient();
        client.on('ready', () => {
            const username = client.user?.tag;
            console.log(`Client is Ready, signed in as ${username}`);
        });
        client.on('error', () => {
            console.error('Client has errored');
        });
    }

    // @ts-ignore
    private registerMessageHandler() {
        const client = this.client.getClient();
        client.on(Events.MessageCreate, (message) => {
          // Emit the received message through the messageSubject
          console.log(message);
        });
      }

    // getObservable(name);
    // getObservable(id);
}