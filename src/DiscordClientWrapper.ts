import { Client, GatewayIntentBits } from "discord.js";
import { Authorization, DiscordAuthInterface } from "./DiscordClientAuth";

// TODO: Needs new method to call that logs the bot in

export abstract class DiscordClientWrapper {
    // variables
    // @ts-ignore
    public client: Client;
    public auth: Authorization;

    constructor(bot_credentials: DiscordAuthInterface) {
        this.client = new Client({
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
        this.client.login(bot_credentials.loginToken);
        this.auth = new Authorization(bot_credentials);
    }
}
