import { MessageService } from "MessageService";
import { DiscordClientWrapper } from './DiscordClientWrapper';
import { DiscordAuthInterface } from "DiscordClientAuth";
import { RabbitmqServiceConfig } from './RabbitmqService';

export interface DiscordClientInterface {
    client: DiscordClientWrapper,
    rabbitmq: MessageService
}

export interface DiscordClientConfig {
    botConfig: DiscordAuthInterface;
    rabbitmqServiceConfig: RabbitmqServiceConfig;
}

export class DiscordClient {
    // variables here
    private client;
    private rabbitmq;

    // Constructor
    constructor(tools: DiscordClientInterface) {
        this.client = tools.client;
        this.rabbitmq = tools.rabbitmq;
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
                // Discord.js Connection
                const client = await DiscordClientWrapper.create(config.botConfig);
                // MessageService
                const rabbitmq = await MessageService.create(config.rabbitmqServiceConfig);

                const completedSetup = {
                    client,
                    rabbitmq
                }
                resolve(completedSetup);
            } catch (error) {
                reject(error);
            }
        })
    }

    // getObservable(name);
    // getObservable(id);
}