import { MessageType } from "./message-type.enum";

export interface IMessage {
    type: MessageType,
    msg: any
}