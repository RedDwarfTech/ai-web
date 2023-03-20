import WebsocketHeartbeatJs from 'websocket-heartbeat-js';
import { readConfig } from '../../../config/app/config-reader';
import { isLoggedIn } from '../../../service/user/UserService';

export function doCloseWebsocket(chatWebsocket: WebSocket) {
    if (chatWebsocket) {
        chatWebsocket.close();
    }
}

export function doWebsocketConnect(chatWebsocket: WebSocket) {
    if (!chatWebsocket || (chatWebsocket && chatWebsocket.readyState === WebSocket.CLOSED)) {
        if ('WebSocket' in window) {
            if (!isLoggedIn()) {
                return;
            }
            const accessToken = localStorage.getItem('aiAccessToken');
            chatWebsocket = new WebSocket(readConfig('wssUrl') + "?a=1");
            //chatWebsocket = new WebSocket(readConfig('wssUrl'));
        } else {
            alert('当前浏览器 Not support websocket')
        }
        chatWebsocket.onerror = function (e: any) {
            console.log("WebSocket连接发生错误", e);
        };

        chatWebsocket.onclose = function (event: any) {
            console.log(`WebSocket1 closed with code ${event.code} and reason "${event.reason}"`);
            console.log(`WebSocket was clean: ${event.wasClean}`);
        }

        chatWebsocket.onmessage = function (event: any) {
            //const msg: IWebsocketMsg = JSON.parse(event.data);
            //if (msg.msgType === WebSocketMsgType[WebSocketMsgType.USER_CHAT]) {
            //appenMsg(msg.msg);
            //setLoadings(false);
            //}
        }

        chatWebsocket.onopen = function () {
            console.log("WebSocket连接成功");
            //setWebSocketStore(chatWebsocket);
        }
    }
}

export function doConnectWebsocketJs(
    onMessage: (msg: string) => void,
    onOpen:(chatWebsocket: WebsocketHeartbeatJs)=> void
): void {
    const accessToken = localStorage.getItem('aiAccessToken');
    const options = {
        url: readConfig('wssUrl') + "?accessToken=" + accessToken,
        pingTimeout: 15000,
        pongTimeout: 10000,
        reconnectTimeout: 2000,
        pingMsg: "ping",
        repeatLimit: 20
    }
    let websocketHeartbeatJs = new WebsocketHeartbeatJs(options);
    websocketHeartbeatJs.onopen = function () {
        onOpen(websocketHeartbeatJs);
        console.log('connect success');
    }
    websocketHeartbeatJs.onmessage = function (e) {
        if(e.data === 'pong'){
            return;
        }
        onMessage(e.data);
        console.log(`onmessage: ${e.data}`);
    }
    websocketHeartbeatJs.onreconnect = function () {
        console.log('reconnecting...');
    }
    websocketHeartbeatJs.onerror = function () {
        console.log('error...');
    }
    websocketHeartbeatJs.onclose = function () {
        console.log('close......');
    }
}

export function randomIntFromInterval(min: number, max: number): number { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

export function getCurrentTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = padLeftZero(now.getMonth() + 1);
    const date = padLeftZero(now.getDate());
    const hour = padLeftZero(now.getHours());
    const minute = padLeftZero(now.getMinutes());
    const second = padLeftZero(now.getSeconds());
    const millisecond = padLeftZero(now.getMilliseconds(), 3);
    return `${year}-${month}-${date} ${hour}:${minute}:${second} ${millisecond}`;
}

export function padLeftZero(val: number, len: number = 2) {
    return (Array(len).join('0') + val).slice(-len);
}
