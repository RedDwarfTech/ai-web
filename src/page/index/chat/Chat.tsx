import { Button, Input, message } from "antd";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { readConfig } from "../../../config/app/config-reader";
import "./Chat.css"
import { v4 as uuid } from 'uuid';
import { doCloseWebsocket, getCurrentTime } from "./WebSocketClient";
import { IWebsocketMsg } from "../../../models/chat/WebSocketMsg";
import { WebSocketMsgType } from "../../../models/chat/WebSocketMsgType";
import ChatContext from "./component/ChatContext";

const Chat: React.FC = (props) => {

    const [inputValue, setInputValue] = useState('');
    const [webSocketStore, setWebSocketStore] = useState<WebSocket | null>(null);
    const [myMap, setMyMap] = useState(new Map());
    const HEARTBEAT_INTERVAL_MS = 20000; // 心跳间隔，单位为毫秒
    var chatWebsocket: WebSocket;
    const [loadings, setLoadings] = useState<boolean>(false);
    //const [inputValue, setInputValue] = useState(0);

    const handleChange = (e: any) => {
        setInputValue(e.target.value);
    };

    useEffect(() => {
        var element = document.querySelector('.chat-body');
        if (element) {
            element.scrollTop = element.scrollHeight - element.clientHeight;
        }
    }, [myMap]);

    React.useEffect(() => {
        doWebsocketConnect();
        window.onbeforeunload = function () {
            doCloseWebsocket(chatWebsocket);
        }
        
    }, []);

    const doWebsocketConnect=() => {
        if (!chatWebsocket || (chatWebsocket && chatWebsocket.readyState === WebSocket.CLOSED)) {
            if ('WebSocket' in window) {
                chatWebsocket = new WebSocket(readConfig('wssUrl'));
            } else {
                alert('当前浏览器 Not support websocket')
            }
            chatWebsocket.onerror = function (e: any) {
                console.log("WebSocket连接发生错误", e);
            };
    
            chatWebsocket.onclose = function (event: any) {
                console.log(`WebSocket closed with code ${event.code} and reason "${event.reason}"`);
                console.log(`WebSocket was clean: ${event.wasClean}`);
            }
    
            
            chatWebsocket.onmessage = function (event: any) {
                const msg: IWebsocketMsg = JSON.parse(event.data);
                if (msg.msgType === WebSocketMsgType[WebSocketMsgType.USER_CHAT]) {
                    appenMsg(msg.msg);
                    setLoadings(false);
                }
            }
    
            if (chatWebsocket) {
                chatWebsocket.onopen = function () {
                    console.log("WebSocket连接成功");
                    setWebSocketStore(chatWebsocket);
                }
            }
            const heartbeatInterval = setInterval(() => {
                if (chatWebsocket.readyState === WebSocket.OPEN) {
                    chatWebsocket.send("ping");
                }
            }, HEARTBEAT_INTERVAL_MS);
        }
    }


    const appenMsg = (data: string) => {
        const now = getCurrentTime();
        const newMap = new Map(myMap);
        newMap.set(now, data);
        setMyMap((prevMapState) => {
            const newMapState = new Map<string, any>(prevMapState);
            newMapState.set(now, data);
            return newMapState;
        });
    }

    const handleSend = () => {
        if (inputValue) {
            if (webSocketStore == null||webSocketStore.readyState === WebSocket.CLOSED) {
                doWebsocketConnect();
            }
            if(webSocketStore != null) {
                appenMsg(inputValue);
                setInputValue('');
                if (webSocketStore.readyState === WebSocket.OPEN) {
                    setLoadings(true);
                    let parms = {
                        msgType: 'USER_CHAT',
                        msg: inputValue
                    };
                    webSocketStore.send(JSON.stringify(parms));
                } else if (webSocketStore.readyState === WebSocket.CLOSED) {
                    message.error("WebSocket连接已经关闭");
                }
            }
        }
    };

    const renderChat = () => {
        const tagList: JSX.Element[] = [];
        myMap.forEach((value, key) => {
            tagList.push(
                <div key={uuid()} className="chat-message">
                    <div key={uuid()} className="message-time">{key}</div>
                    <ChatContext msg={value}></ChatContext>
                </div>);
        });
        return tagList;
    };

    const handleEnterKey = (e: any) => {
        if (e.nativeEvent.keyCode === 13) {
            handleSend();
        }
    }

    return (
        <div className="chat-container">
            <div className="chat-header">
                <span>会话</span>
            </div>
            <div className="chat-body">
                {renderChat()}
            </div>
            <div className="chat-form">
                <Input id="talkInput"
                    value={inputValue}
                    onChange={handleChange}
                    onKeyPress={handleEnterKey}
                    type="text" placeholder="输入会话内容" />
                <Button loading={loadings} onClick={handleSend}><span>发送</span></Button>
            </div>
        </div>
    );
}

const mapStateToProps = (state: any) => ({
    robot: state.robot
});

const mapDispatchToProps = (dispatch: any) => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);

