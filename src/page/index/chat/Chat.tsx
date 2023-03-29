import { Button, Input, message } from "antd";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import "./Chat.css"
import { v4 as uuid } from 'uuid';
import ChatContext from "./component/ChatContext";
import { isLoggedIn } from "../../../service/user/UserService";
import WebsocketHeartbeatJs from "websocket-heartbeat-js";
import { ChatAsk } from "../../../models/request/chat/ChatAsk";
import { chatAskAction } from "../../../action/chat/ChatAction";
import { IChatAskResp } from "../../../models/chat/ChatAskResp";
import { doSseChatAsk } from "../../../service/chat/SseClientService";
import { ISseMsg } from "../../../models/chat/SseMsg";
import { ISse35ServerMsg } from "../../../models/chat/3.5/Sse35ServerMsg";
import dayjs from "dayjs";
import { REST, TimeUtils } from "js-wheel";
import { IConversation } from "@/models/chat/3.5/Conversation";
import { getConversations } from "../../../service/chat/ConversationService";
import { IConversationReq } from "@/models/request/conversation/ConversationReq";
import BaseMethods from 'js-wheel/dist/src/utils/data/BaseMethods';
import { getConversationItems } from "../../../service/chat/ConversationItemService";
import { IConversationItemReq } from "@/models/request/conversation/ConversationItemReq";

const Chat: React.FC<IChatAskResp> = (props) => {

    const [inputValue, setInputValue] = useState('');
    const [webSocketStore, setWebSocketStore] = useState<WebsocketHeartbeatJs | null>(null);
    const [myMap, setMyMap] = useState(new Map<string,ISseMsg>());
    const [loadings, setLoadings] = useState<boolean>(false);
    const [cid, setCid] = useState<number>(0);

    const handleChange = (e: any) => {
        setInputValue(e.target.value);
    };

    useEffect(() => {
        fetchConversations();
        var element = document.querySelector('.chat-body');
        if (element) {
            element.scrollTop = element.scrollHeight - element.clientHeight;
        }
    }, [myMap]);

    React.useEffect(() => {
        if (isLoggedIn()) {
            // doConnectWebsocketJs(onMessage, onOpen);
        }
    }, []);

    const fetchConversations = () => {
        const convReq: IConversationReq = {
            title: 'React'
        };
        getConversations(convReq);
    }

    const onSseMessage = (msg: string) => {
        const msg1: ISse35ServerMsg = JSON.parse(msg);
        if (msg1.choices[0] && msg1.choices[0].finish_reason === "vip-expired") {
            setLoadings(false);
            message.info("会员已到期");
            return;
        }
        if (msg1.choices[0].delta.content && msg1.choices[0].delta.content.length > 0) {
            appenSseMsg(msg1);
        }
        if (msg1.choices[0].finish_reason && msg1.choices[0].finish_reason === "stop") {
            setLoadings(false);
        }
    }

    const appenSseMsg = (data: ISse35ServerMsg) => {
        setMyMap((prevMapState) => {
            const newMapState = new Map<string, ISseMsg>(prevMapState);
            if (newMapState.has(data.id)) {
                const legacyMsg = newMapState.get(data.id)!.msg;
                let message;
                if (data.choices != undefined && data.choices.length > 0) {
                    message = legacyMsg + data.choices[0].delta.content
                }
                const sseMsg: ISseMsg = {
                    id: data.id,
                    msg: message ?? "",
                    created: TimeUtils.getFormattedTime(data.created * 1000),
                };
                newMapState.set(data.id, sseMsg);
            } else {
                const sseMsg: ISseMsg = {
                    id: data.id,
                    created: TimeUtils.getFormattedTime(data.created * 1000),
                    msg: data.choices[0].delta.content
                };
                newMapState.set(data.id, sseMsg);
            }
            return newMapState;
        });
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
        let msg: ISse35ServerMsg = {
            id: uuid(),
            created: dayjs().valueOf() / 1000,
            choices: [
                {
                    delta: {
                        content: inputValue
                    },
                    index: 0,
                    finish_reason: ""
                }
            ]
        };
        appenSseMsg(msg);
        setInputValue('');
        setLoadings(true);
        let ask: ChatAsk = {
            prompt: encodeURIComponent(inputValue),
            cid: cid
        };
        doSseChatAsk(ask, onSseMessage);
    };

    const renderChat = () => {
        const tagList: JSX.Element[] = [];
        myMap.forEach((value, key) => {
            let chatValue: ISseMsg = value;
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

    const getConverItems = (choosedCid: number) => {
        let items: IConversationItemReq = {
            cid: choosedCid
        };
        setCid(choosedCid);
        getConversationItems(items).then((resp: any) => {
            if (resp.result && resp.result.list && resp.result.list.length > 0) {
                const newMap = new Map<string,ISseMsg>();
                const itemList = resp.result.list;
                itemList.forEach((item: any) => {
                    if(item.questionTime){
                        const sseMsg: ISseMsg = {
                            id: "x",
                            created: item.questionTime,
                            msg: item.question
                        };
                        newMap.set(item.questionTime, sseMsg);
                    }
                    if(item.answerTime){
                        const sseMsg: ISseMsg = {
                            id: "x1",
                            created: item.answerTime,
                            msg: item.answer
                        };
                        newMap.set(item.answerTime, sseMsg);
                    }
                })
                setMyMap(newMap);
            }
        });
    }

    const conversationRender = (con: any) => {
        if (BaseMethods.isNull(con) || BaseMethods.isNull(con.list)) {
            return;
        }
        const conversations: IConversation[] = con.list;
        const conversationList: JSX.Element[] = [];
        conversations.forEach(item => {
            conversationList.push(<div onClick={() => getConverItems(item.id)} className="conversation-item">{item.title}</div>);
        });
        return conversationList;
    }

    return (
        <div className="chat-main-body">
            <div className="conversation">
                <div className="conversation-list">
                    {conversationRender(props.conversations.conversations)}
                </div>
            </div>
            <div className="chat-container">
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
        </div>
    );
}

const mapStateToProps = (state: any) => ({
    chatProps: state.chat,
    conversations: state.conversation
});

const mapDispatchToProps = (dispatch: any) => {
    return {
        respContentFuc: (prompt: any) => {
            dispatch(chatAskAction(prompt))
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);

