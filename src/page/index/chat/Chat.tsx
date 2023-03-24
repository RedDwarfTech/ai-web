import { Button, Input, message } from "antd";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import "./Chat.css"
import { v4 as uuid } from 'uuid';
import { getCurrentTime } from "./WebSocketClient";
import { IWebsocketMsg } from "../../../models/chat/WebSocketMsg";
import { WebSocketMsgType } from "../../../models/chat/WebSocketMsgType";
import ChatContext from "./component/ChatContext";
import { isLoggedIn } from "../../../service/user/UserService";
import WebsocketHeartbeatJs from "websocket-heartbeat-js";
import { IChatAsk } from "../../../models/chat/ChatAsk";
import { doChatAsk } from "../../../service/chat/ChatService";
import { chatAskAction } from "../../../action/chat/ChatAction";
import { IChatAskResp } from "../../../models/chat/ChatAskResp";
import SseClient from "./component/sse/SseClient";

const Chat: React.FC<IChatAskResp> = (props) => {

    const [inputValue, setInputValue] = useState('');
    const [webSocketStore, setWebSocketStore] = useState<WebsocketHeartbeatJs | null>(null);
    const [myMap, setMyMap] = useState(new Map());
    const [loadings, setLoadings] = useState<boolean>(false);

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
        if(isLoggedIn()){
            // doConnectWebsocketJs(onMessage, onOpen);
        }
    }, []);

    const onOpen = (chatWebsocket: WebsocketHeartbeatJs) => {
        setWebSocketStore(chatWebsocket);
    }

    const onMessage = (msg: string) => {
        const msgModel: IWebsocketMsg = JSON.parse(msg);
        if (msgModel.msgType === WebSocketMsgType[WebSocketMsgType.USER_CHAT]) {
            appenMsg(msgModel.msg);
        }
        setLoadings(false);
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

    if(props.chatProps.chatResp){
        if(!(new Set(myMap.values()).has(props.chatProps.chatResp))){
            setLoadings(false);
            appenMsg(props.chatProps.chatResp)
        }
    }

    const handleSend = () => {
        if (!isLoggedIn()) {
            message.warning("请登录后再开启聊天");
            setLoadings(false);
            return;
        }
        if (!inputValue) {
            return;
        }
        appenMsg(inputValue);
        setInputValue('');
        setLoadings(true);
        // webSocketStore.send(JSON.stringify(parms));
        let ask: IChatAsk = {
            prompt: inputValue
        };
        doChatAsk(ask);
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
                <SseClient></SseClient>
            </div>
        </div>
    );
}

const mapStateToProps = (state: any) => ({
    chatProps: state.chat
});

const mapDispatchToProps = (dispatch: any) => {
    return {
        respContentFuc: (prompt: any) => {
          debugger
          dispatch(chatAskAction(prompt))
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);

