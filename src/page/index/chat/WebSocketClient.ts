export function doCloseWebsocket(chatWebsocket: WebSocket) {
    if(chatWebsocket){
        chatWebsocket.close();
    }
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
