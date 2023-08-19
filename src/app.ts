import dotenv from "dotenv";
import { DiscordClient } from "DiscordClient";

dotenv.config();

// // Demo Code: Instantiate the server and start it

const rabbitmqServiceConfig = {
  user: {
    username: process.env.RABBITMQ_DISCORD_USER || "",
    password: process.env.RABBITMQ_DISCORD_PASSWD || "",
  },
  // Might be 'rabbitmq' in the future, defined in our docker network as such
  hostname: 'localhost',
  port: process.env.RABBITMQ_PORT || "5672"
}

const redirect_uri = "http://localhost";
const AUTH_SCOPES = ["bot"];

const botConfig = {
    clientId: process.env.DISCORD_CLIENT_ID || "",
    clientSecret: process.env.DISCORD_CLIENT_SECRET || "",
    redirectUri: redirect_uri,
    scopes: AUTH_SCOPES
}

// @ts-ignore

const app = DiscordClient.create({
    botConfig,
    rabbitmqServiceConfig
});