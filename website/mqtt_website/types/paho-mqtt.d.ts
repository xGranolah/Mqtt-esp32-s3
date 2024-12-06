declare module "paho-mqtt" {
  export namespace Paho {
    class Client {
      constructor(host: string, port: number, clientId: string);
      onConnectionLost: (responseObject: { errorCode: number }) => void;
      onMessageArrived: (message: Message) => void;
      connect(options: { onSuccess: () => void; userName?: string; password?: string }): void;
      send(destinationName: string, message: string): void;
      subscribe(topic: string): void;
      isConnected(): boolean;
    }

    class Message {
      payloadString: string;
      destinationName: string;
    }
  }
}
