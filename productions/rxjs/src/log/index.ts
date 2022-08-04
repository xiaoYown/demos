import Message, { MessageModel, MessageType } from './message';

class Log {
  constructor() {
    this.message = new Message();
  }

  private message: Message;

  private append = (type: MessageType, text: string) => {
    this.message.add(type, text);
  };

  public info = (text: string): void => {
    console.info(text);
    this.append('info', text);
  };

  public warn = (text: string): void => {
    console.warn(text);
    this.append('warn', text);
  };

  public error = (text: string): void => {
    console.error(text);
    this.append('error', text);
  };

  public all = (): MessageModel[] => this.message.all();

  public destroy = (): void => {
    this.message.clean();
  };
}

export default Log;
