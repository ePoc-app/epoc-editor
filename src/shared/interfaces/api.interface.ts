export interface ApiInterface {
    send: (channel: string, data?) => void;
    receive: (channel: string, callback: (...args) => void) => void;
    receiveOnce: (channel: string, callback: (...args) => void) => void;
}
