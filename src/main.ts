import dotenv from "dotenv";
dotenv.config();
import { DiscordClient } from "./client";


export function TimelineAppLauncher() {
    try {
        const client = new DiscordClient();
        // const express = new WebhookServer(3000);
        // Fuck me like express app here??
        // client.getMessagesObservable().subscribe(handleMessage);
        // client.getGuildsObservable().subscribe(handleMessage);
    } catch (error) {
        console.log(error);
    }
}

TimelineAppLauncher();