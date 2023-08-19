import dotenv from "dotenv";
dotenv.config();
import { DiscordClient } from "./client";


export function TimelineAppLauncher() {
    try {
        const client = new DiscordClient();
        // client.getMessagesObservable().subscribe(handleMessage);
        // client.getGuildsObservable().subscribe(handleMessage);
    } catch (error) {
        console.log(error);
    }
}

TimelineAppLauncher();