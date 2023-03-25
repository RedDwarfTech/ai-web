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
import { chatAskAction } from "../../../action/chat/ChatAction";
import { IChatAskResp } from "../../../models/chat/ChatAskResp";
import { doSseChatAsk } from "../../../service/chat/SseClientService";
import { ISseMsg } from "../../../models/chat/SseMsg";

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

    const onSseMessage = (msg: string) => {
        const msg1:ISseMsg = JSON.parse(msg);
        appenSseMsg(msg1);
    }

    const appenMsg = (data: string) => {
        const now = getCurrentTime();
        const newMap = new Map(myMap);
        newMap.set(now, data);
        setMyMap((prevMapState) => {
            const newMapState = new Map<string, string>(prevMapState);
            newMapState.set(now, data);
            return newMapState;
        });
    }

    const appenSseMsg = (data: ISseMsg) => {
        const now = getCurrentTime();
        const newMap = new Map(myMap);
        newMap.set(now, data);
        setMyMap((prevMapState) => {
            const newMapState = new Map<string, ISseMsg>(prevMapState);
            if(newMapState.has(data.id)){
                const legacyMsg = newMapState.get(data.id)!.msg;
                let message;
                if(data.choices!= undefined && data.choices.length>0){
                    message = legacyMsg + "data.choices[0]"
                }
                const sseMsg:ISseMsg = {
                    id: data.id,
                    msg: legacyMsg + "dgwgewgw",
                    created: data.created,
                    choices: []
                };
                newMapState.set(data.id, sseMsg);
            }else{
                const sseMsg: ISseMsg = {
                    id: data.id,
                    created: data.created,
                    choices: [],
                    msg: "chioce"
                };
                newMapState.set(data.id, data);
            }
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
        let msg:ISseMsg = {
            id: uuid(),
            created: getCurrentTime(),
            choices: [],
            msg: inputValue
        };
        appenSseMsg(msg);
        setInputValue('');
        setLoadings(true);
        // webSocketStore.send(JSON.stringify(parms));
        let ask: IChatAsk = {
            prompt: inputValue
        };
        doSseChatAsk(ask,onSseMessage);
    };

    const renderChat = () => {
        const tagList: JSX.Element[] = [];
        myMap.forEach((value, key) => {
            let chatValue:ISseMsg = value;     
            tagList.push(
                <div key={uuid()} className="chat-message">
                    <div key={uuid()} className="message-time">{value.created}</div>
                    <ChatContext msg={chatValue.msg}></ChatContext>
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

