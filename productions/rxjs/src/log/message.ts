export type MessageType = 'info' | 'warn' | 'error';

export interface MessageModel {
  type: MessageType;
  text: string;
}

class Message {
  private messages: MessageModel[] = [];

  private create = (type: MessageType, text: string): MessageModel => {
    const msg = Object.create(null);

    msg.type = type;
    msg.text = text;

    return msg;
  };

  public add = (type: MessageType, text: string): void => {
    const msg = this.create(type, text);
    this.messages.push(msg);
  };

  public all = (): MessageModel[] => this.messages;

  public clean = (): void => {
    this.messages = [];
  };
}

export default Message;
