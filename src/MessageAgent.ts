import { MessageService } from "./MessageService"

export abstract class MessageAgent {
    // variables
    public messageService: MessageService;
    public queueName: string;

    constructor (messageService: MessageService, queueName: string) {
        this.messageService = messageService;
        this.queueName = queueName;
    }

}