
import { Client, Events, GatewayIntentBits } from "discord.js";
import { Subject } from "rxjs";
import { Authorization } from "./DiscordClientAuth";

import dotenv from "dotenv";
dotenv.config();

// Make it so that if these things don't work creation doesn't work mmhmm
const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
// const CLIENT_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const redirect_uri = "http://localhost";
const AUTH_SCOPES = ["bot"];

// TODO: Create authorization for DiscordClient. allow bot to join servers and hook up cables to it's data
export class DiscordClient {
    private client: Client;
    private messageSubject: Subject<string>;
    private guildSubject: Subject<string>;
    private authorization: Authorization;

  constructor() {
    // Creates new Discord.js client
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
    // Creates a new authorization object
    this.authorization = new Authorization(CLIENT_ID, CLIENT_SECRET, redirect_uri, AUTH_SCOPES);
    // Creates a new Message Subject to observe
    this.messageSubject = new Subject();
    this.guildSubject = new Subject();
    // Registers the new handlers
    this.registerMessageHandler();
    this.registerGuildHandler();
  }

  // Handles login of the bot user into the client
  async login(botToken: string, code: string, guildId: string) {
    // Creates an access token from the Authorization method
    const accessToken = await this.authorization.getAccessToken(code);

    // Logs in the client using the access token
    await this.client.login(botToken);
    // Refreshes the guild members
    await this.client.guilds.cache.get(guildId)?.members.fetch();
    // Adds the bot as a member if it's somehow not already so
    await this.client.guilds.cache.get(guildId)?.members.add(this.client.user?.id as string, {
      accessToken,
      roles: [],
    });

    console.log(`Added bot to server ${guildId}`);
  }

  // Returns an observable containing all message Data
  getMessagesObservable() {
    return this.messageSubject.asObservable();
  }

  getGuildsObservable() {
    return this.guildSubject.asObservable();
  }

  async registerGuildHandler() {
    this.client.on(Events.GuildCreate, guild => {
        console.log("Guild Added to Bot");
        this.guildSubject.next(guild);
    });
  }

  // Creates a listener for the MessageCreate event and pushes it onto the messageSubject observable.
  async registerMessageHandler() {
    this.client.on(Events.MessageCreate, (message) => {
      // Emit the received message through the messageSubject
      this.messageSubject.next(message);
    });
  }
}