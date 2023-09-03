import { DiscordClientWrapper } from './DiscordClientWrapper';
import { WebhookAgent } from './WebhookAgent';
import { DiscordAuthInterface } from 'DiscordClientAuth';

export interface LoggedInClientCreate {
    bot_credentials: DiscordAuthInterface;
    webhookAgent: WebhookAgent;
}

export class LoggedInClient extends DiscordClientWrapper {
    // variables
    // @ts-ignore
    private webhookAgent;

    constructor(tools: LoggedInClientCreate) {
        super(tools.bot_credentials);
        this.webhookAgent = tools.webhookAgent;
        this.login();
        this.registerHandlers();
    }

    
    private registerHandlers() {
        this.client.on('ready', () => {
            console.log('Client is Ready');
        })
    }

    private login() {
        // const loginToken = this.auth.getAccessToken();
    }


    // static async create(bot_credentials: DiscordAuthInterface): Promise<DiscordClientWrapper> {
    //     // Create Client

    //     // @ts-ignore
    //     const auth = new Authorization(bot_credentials);

    //     // const loginToken = auth.getAccessToken();
    //     // Log it in
    //     // client.login(loginToken);

    //     const instance = new LoggedInClient();
    //     return instance;
    // }
}