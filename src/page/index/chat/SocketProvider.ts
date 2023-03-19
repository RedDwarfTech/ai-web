import { readConfig } from "../../../config/app/config-reader";

const chatWebsocket = new WebSocket(readConfig('wssUrl'));

export default chatWebsocket;
