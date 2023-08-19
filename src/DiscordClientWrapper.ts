import { Client, GatewayIntentBits } from "discord.js";
import { Authorization, DiscordAuthInterface } from "./DiscordClientAuth";

export class DiscordClientWrapper {
    // variables
    // @ts-ignore
    private client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    static async create(bot_credentials: DiscordAuthInterface): Promise<DiscordClientWrapper> {
        // Create Client
        const client = new Client({
            intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.DirectMessages,
            GatewayIntentBits.GuildMessageReactions,
            GatewayIntentBits.DirectMessageReactions,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildEmojisAndStickers,
            ]
        });
        // @ts-ignore
        const auth = new Authorization(bot_credentials);
        // Log it in
        // client.login(bot_credentials);

        const instance = new DiscordClientWrapper(client);
        return instance;
    }
}
