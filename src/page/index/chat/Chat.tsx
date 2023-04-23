import { Avatar, Button, Dropdown, Input, MenuProps, message } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { connect, useSelector } from "react-redux";
import "./Chat.css"
import { v4 as uuid } from 'uuid';
import { doLoginOut, getCurrentUser, isLoggedIn, userLoginImpl } from "@/service/user/UserService";
import { ChatAsk } from "@/models/request/chat/ChatAsk";
import { chatAskAction } from "@/action/chat/ChatAction";
import { IChatAskResp } from "@/models/chat/ChatAskResp";
import { doSseChatAsk } from "@/service/chat/SseClientService";
import { ISseMsg } from "@/models/chat/SseMsg";
import { ISse35ServerMsg } from "@/models/chat/3.5/Sse35ServerMsg";
import dayjs from "dayjs";
import { IUserModel, TimeUtils, WheelGlobal } from "js-wheel";
import { IConversation } from "@/models/chat/3.5/Conversation";
import { getConversations } from "@/service/chat/ConversationService";
import { IConversationReq } from "@/models/request/conversation/ConversationReq";
import BaseMethods from 'js-wheel/dist/src/utils/data/BaseMethods';
import { getConversationItems } from "@/service/chat/ConversationItemService";
import { IConversationItemReq } from "@/models/request/conversation/ConversationItemReq";
import { readConfig } from "@/config/app/config-reader";
import { DollarOutlined, FileImageOutlined, InfoCircleOutlined, MessageOutlined, SendOutlined } from "@ant-design/icons";
import About from "@/page/about/About";
import Goods from "../goods/Goods";
import Profile from "@/page/user/profile/Profile";
import GenImages from "../images/GenImages";
import ChatList from "./component/ChatList";
import chatPic from "@/asset/icon/chat/chat.svg";

const Chat: React.FC<IChatAskResp> = (props) => {
    const [inputValue, setInputValue] = useState('');
    const [myMap, setMyMap] = useState(new Map<string, ISseMsg>());
    const [loadings, setLoadings] = useState<boolean>(false);
    const [cid, setCid] = useState<number>(0);
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') || false);
    const [isGetUserLoading, setIsGetUserLoading] = useState(false);
    const [userInfo, setUserInfo] = useState<IUserModel>();
    const { citem } = useSelector((state:any) => state.citem)

    const inputRef = useRef<HTMLInputElement>(null);

    const handleChatInputChange = (e: any) => {
        setInputValue(e.target.value);
    };

    useEffect(()=>{
        console.log("item updated",items);
        putCitems(citem);
    },[citem]);

    useEffect(() => {
        var element = document.querySelector('.chat-body');
        if (element) {
            element.scrollTop = element.scrollHeight - element.clientHeight;
        }
    }, [myMap]);

    React.useEffect(() => {
        if(isLoggedIn){
            fetchConversations();
        }
    }, []);

    const fetchConversations = () => {
        const convReq: IConversationReq = {
            title: 'React'
        };
        return getConversations(convReq);
    }

    const onSseMessage = (msg: string) => {
        const serverMsg: ISse35ServerMsg = JSON.parse(msg);
        if (serverMsg.choices[0] && serverMsg.choices[0].finish_reason === "vip-expired") {
            setLoadings(false);
            message.info("充值会员继续使用");
            return;
        }
        if (serverMsg.choices[0].delta.content && serverMsg.choices[0].delta.content.length > 0) {
            appenSseMsg(serverMsg, "chatgpt");
        }
        if (serverMsg.choices[0].finish_reason && serverMsg.choices[0].finish_reason === "stop") {
            setLoadings(false);
            if(cid === 0){
                fetchNewestCid();
            }
        }
    }

    const fetchNewestCid = () => {
        fetchConversations().then((data:any) =>{
            if(data && data.result && data.result.list){
                const newestConversations = data.result.list.reduce((previous:any, current:any) => {
                    return (previous.createdTime > current.createdTime) ? previous : current;
                });
                const newestCid = newestConversations.id;
                if(cid === 0){
                    setCid(newestCid);
                }
            }
        })
    }

    const appenSseMsg = (data: ISse35ServerMsg, msgType: string) => {
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
                    type: msgType
                };
                newMapState.set(data.id, sseMsg);
            } else {
                const sseMsg: ISseMsg = {
                    id: data.id,
                    created: TimeUtils.getFormattedTime(data.created * 1000),
                    msg: data.choices[0].delta.content,
                    type: msgType
                };
                newMapState.set(data.id, sseMsg);
            }
            return newMapState;
        });
    }

    const handleMenuClick = (menu: string) => {
        props.onMenuClick(menu);
    };

    const handleSend = () => {
        if(loadings){
            return;
        }
        if (!isLoggedIn) {
            message.warning("请登录后再开启聊天");
            setLoadings(false);
            return;
        }
        if (!inputValue && inputValue.trim().length === 0) {
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
        appenSseMsg(msg, "prompt");
        setInputValue('');
        setLoadings(true);
        let ask: ChatAsk = {
            prompt: encodeURIComponent(inputValue),
            cid: cid
        };
        doSseChatAsk(ask, onSseMessage);
    };

    const handleEnterKey = (e: any) => {
        if (e.nativeEvent.keyCode === 13) {
            e.preventDefault();
            e.stopPropagation(); 
            handleSend();
        }
    }

    const handleConversation = (id: number) => {
        handleMenuClick('chat');
        getConverItems(id)
    }

    const putCitems =(resp: any) => {
        if (resp.result && resp.result.list && resp.result.list.length > 0) {
            const newMap = new Map<string, ISseMsg>();
            const itemList = resp.result.list;
            itemList.sort((a: any, b: any) => Number(a.createdTime) - Number(b.createdTime));
            itemList.forEach((item: any) => {
                if (item.questionTime) {
                    const sseMsg: ISseMsg = {
                        id: "x",
                        created: TimeUtils.getFormattedTime(Number(item.questionTime)),
                        msg: item.question,
                        type: "prompt"
                    };
                    newMap.set(item.questionTime, sseMsg);
                }
                if (item.answerTime) {
                    const sseMsg: ISseMsg = {
                        id: "x1",
                        created: TimeUtils.getFormattedTime(Number(item.answerTime)),
                        msg: item.answer,
                        type: "chatgpt"
                    };
                    newMap.set(item.answerTime, sseMsg);
                }
            })
            setMyMap(newMap);
        }
    }

    const getConverItems = (choosedCid: number) => {
        let items: IConversationItemReq = {
            cid: choosedCid
        };
        setCid(choosedCid);
        getConversationItems(items).then((resp: any) => {
            putCitems(resp);
        });
    }

    const conversationRender = (con: any) => {
        if (BaseMethods.isNull(con) || BaseMethods.isNull(con.list)) {
            return;
        }
        const conversations: IConversation[] = con.list;
        const conversationList: JSX.Element[] = [];
        conversations.forEach(item => {
            conversationList.push(
            <div key={uuid()} onClick={() => handleConversation(item.id)} className="conversation-item">
                <img src={chatPic}></img>
                <span>{item.title}</span>
            </div>);
        });
        return conversationList;
    }

    const loadCurrentUser = () => {
        if (!localStorage.getItem("userInfo") && isGetUserLoading === false) {
            setIsGetUserLoading(true);
            getCurrentUser().then((data: any) => {
                setUserInfo(data.result);
                localStorage.setItem("userInfo", JSON.stringify(data.result));
                setIsGetUserLoading(false);
            });
        }
    }

    const showUserProfile = () => {
        handleMenuClick('profile');
    }

    const items: MenuProps['items'] = [
        {
            key: '2',
            onClick: doLoginOut,
            label: (
                <a className="user-action-item">
                    登出
                </a>
            )
        }, {
            key: '3',
            onClick: showUserProfile,
            label: (
                <a className="user-action-item">
                    控制台
                </a>
            )
        }]

    const userLogin = () => {
        let param = {
            appId: readConfig("appId")
        };
        userLoginImpl(param).then((data: any) => {
            window.location.href = data.result;
        });
    }

    const renderLogin = () => {
        if (isLoggedIn) {
            var avatarUrl = localStorage.getItem('avatarUrl');
            if (avatarUrl) {
                // https://stackoverflow.com/questions/76052644/warning-finddomnode-is-deprecated-in-strictmode-when-using-antd-dropdown
                return (
                    <Dropdown className="user-menu" menu={{ items }} trigger={['click']} placement="topRight">
                        <Avatar size={40} src={avatarUrl} />
                    </Dropdown>
                );
            } else {
                return (
                    <Dropdown className="user-menu" menu={{ items }} trigger={['click']} placement="topRight">
                        <Avatar size={40} >Me</Avatar>
                    </Dropdown>
                );
            }
        }
        const accessTokenOrigin = document.cookie.split('; ').find(row => row.startsWith('accessToken='));
        if (accessTokenOrigin) {
            const accessTokenCookie = accessTokenOrigin.split("=")[1];
            const refreshTokenCookie = document.cookie.split('; ').find(row => row.startsWith('refreshToken='))?.split("=")[1];
            const avatarUrlCookie = document.cookie.split('; ').find(row => row.startsWith('avatarUrl='))?.split("=")[1];
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem(WheelGlobal.ACCESS_TOKEN_NAME, accessTokenCookie);
            localStorage.setItem(WheelGlobal.REFRESH_TOKEN_NAME, refreshTokenCookie ? refreshTokenCookie : "");
            localStorage.setItem('avatarUrl', avatarUrlCookie ? avatarUrlCookie : "");
            localStorage.setItem(WheelGlobal.BASE_AUTH_URL, readConfig("baseAuthUrl"));
            localStorage.setItem(WheelGlobal.ACCESS_TOKEN_URL_PATH, readConfig("accessTokenUrlPath"));
            loadCurrentUser();
            setIsLoggedIn(true);
        }
        return (<Button name='aiLoginBtn' onClick={userLogin}>登录</Button>);
    }

    const renderRightContainer = (tab: String) => {
        if (tab === "chat") {
            return (
                <div className="chat-container">
                    <ChatList myMap={myMap}></ChatList>
                    <div className="chat-form">
                        <Input.TextArea
                            rows={2}
                            id="talkInput"
                            value={inputValue}
                            ref={inputRef}
                            onChange={handleChatInputChange}
                            onKeyPress={handleEnterKey}
                            placeholder="输入会话内容，按Enter快捷发送" />
                        {/**<Button icon={<SendOutlined className="chat-send-icon" />} loading={loadings} onClick={handleSend}>
                            <span>发送</span>
            </Button>**/}
                    </div>
                </div>
            );
        }
        if (tab === "about") {
            return (
                <div className="chat-container">
                    <About></About>
                </div>
            );
        }
        if (tab === "account") {
            return (
                <div className="chat-container">
                    <Goods></Goods>
                </div>
            );
        }
        if (tab === "image") {
            return (
                <div className="chat-container">
                    <GenImages></GenImages>
                </div>
            );
        }
        if (tab === "profile") {
            const userInfoJson = localStorage.getItem("userInfo");
            if (!userInfoJson) {
                return;
            }
            const uInfo: IUserModel = JSON.parse(userInfoJson);
            return (
                <div className="chat-container">
                    <Profile panelUserInfo={uInfo}></Profile>
                </div>
            );
        }
        return (<div></div>);
    }

    return (
        <div className="chat-main-body">
            <div className="conversation">
                <div className="conversation-list">
                    {conversationRender(props.conversations.conversations)}
                </div>
                <div className="chat-menu" > 
                    <div className="conversation-action">
                        <nav>
                            <div className="conversation-item" onClick={() => handleMenuClick('chat')}>
                                <MessageOutlined /><span className="action-item">聊天</span>
                            </div>
                            {/**<div className="conversation-item" onClick={() => handleMenuClick('image')}>
                                <FileImageOutlined /><span className="action-item">图片生成</span>
    </div>**/}
                            <div className="conversation-item" onClick={() => handleMenuClick('account')}>
                                <DollarOutlined /><span className="action-item">订阅</span>
                            </div>
                            <div className="conversation-item" onClick={() => handleMenuClick('about')}>
                                <InfoCircleOutlined /><span className="action-item">关于</span>
                            </div>
                            <div className="conversation-item-login">
                                {renderLogin()}
                            </div>
                        </nav>
                    </div>
                </div>
            </div>
            {renderRightContainer(props.menu)}
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

