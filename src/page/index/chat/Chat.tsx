import { Avatar, Button, Input, Modal, message } from "antd";
import React, { ChangeEvent, useState } from "react";
import { useSelector } from "react-redux";
import "./Chat.css"
import { v4 as uuid } from 'uuid';
import { doLoginOut, getCurrentUser, userLoginByPhoneImpl, userLoginImpl } from "@/service/user/UserService";
import { ChatAsk } from "@/models/request/chat/ChatAsk";
import { IChatAskResp } from "@/models/chat/ChatAskResp";
import { doAskPreCheck } from "@/service/chat/SseClientService";
import { ISseMsg } from "@/models/chat/SseMsg";
import { ISse35ServerMsg } from "@/models/chat/3.5/Sse35ServerMsg";
import dayjs from "dayjs";
import { AuthHandler, IUserModel, ResponseHandler, TimeUtils, WheelGlobal } from "rdjs-wheel";
import { IConversation } from "@/models/chat/3.5/Conversation";
import { delConversation, editConversation, getConversations } from "@/service/chat/ConversationService";
import { IConversationReq } from "@/models/request/conversation/ConversationReq";
import BaseMethods from 'rdjs-wheel/dist/src/utils/data/BaseMethods';
import { getConversationItems } from "@/service/chat/ConversationItemService";
import { IConversationItemReq } from "@/models/request/conversation/ConversationItemReq";
import { readConfig } from "@/config/app/config-reader";
import { ControlOutlined, DeleteOutlined, EditOutlined, FileImageOutlined, InfoCircleOutlined, LogoutOutlined, MessageOutlined, PayCircleOutlined, SendOutlined } from "@ant-design/icons";
import About from "@/page/about/About";
import { Goods } from "rd-component";
import Profile from "@/page/user/profile/Profile";
import ChatList from "./component/ChatList";
import chatPic from "@/asset/icon/chat/chat.svg";
import { Prompt, getNewestRecord, getToIdb, insertToIdb } from "@/storage/indexdb/idb";
import { EventSourcePolyfill } from "event-source-polyfill";
import withConnect from "@/page/component/hoc/withConnect";
import store from "@/store/store";
import "rd-component/dist/style.css";
import GenImages from "../images/GenImages";

const Chat: React.FC<IChatAskResp> = (props: IChatAskResp) => {
    const [inputValue, setInputValue] = useState('');
    const [sseChatMsg, setSseChatMsg] = useState(new Map<string, ISseMsg>());
    const [loadings, setLoadings] = useState<boolean>(false);
    const [cid, setCid] = useState<number>(0);
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') || false);
    const [isGetUserLoading, setIsGetUserLoading] = useState(false);
    const [_, setUserInfo] = useState<IUserModel>();
    const { citem } = useSelector((state: any) => state.citem);
    const { loginUser } = useSelector((state: any) => state.user);
    const { conversations } = useSelector((state: any) => state.conversation);
    const [currInputIndex, setCurrInputIndex] = useState(0);
    const [currConversationReq, setCurrConversationReq] = useState<IConversationReq>();
    const [loadedConversations, setLoadedConversations] = useState<Map<number, IConversation>>(new Map<number, IConversation>());
    const [showGoodsPopup, setShowGoodsPopup] = useState(false);
    const [showEditTitlePopup, setShowEditTitlePopup] = useState(false);
    const [hasMoreConversation, setHasMoreConversation] = useState<boolean>(false);
    const [currEditConversation, setCurrEditConversation] = useState<IConversation>();

    const handleChatInputChange = (e: any) => {
        setInputValue(e.target.value);
    };

    React.useEffect(() => {
        if (conversations && Object.keys(conversations).length > 0 && conversations.list && conversations.list.length > 0) {
            // https://stackoverflow.com/questions/76267002/how-to-locate-the-react-ocassionally-render-issue
            const newMapState = new Map<number, IConversation>(loadedConversations);
            conversations.list.forEach((item: IConversation) => {
                newMapState.set(item.id, item);
            });
            setHasMoreConversation(conversations.pagination.hasNextPage);
            setLoadedConversations(newMapState);
        }
    }, [conversations]);

    React.useEffect(() => {
        if (isLoggedIn) {
            fetchConversations();
        }
        initialCurrentSelect();
        document.addEventListener("click", handleMenuClose);
        return () => {
            document.removeEventListener("click", handleMenuClose);
        };
    }, []);

    const menuClose = () => {
        const dropdown = document.getElementById('dropdown');
        if (dropdown) {
            dropdown.style.display = 'none';
        }
    }

    const handleMenuClose = (event: any) => {
        const menu = document.getElementById('user-menu');
        const dropdown = document.getElementById('dropdown');
        if (menu && dropdown) {
            const target = event.target;
            if (!menu.contains(target)) {
                dropdown.style.display = 'none';
            }
        }
    }

    React.useEffect(() => {
        if (loginUser && Object.keys(loginUser).length > 0) {
            saveLoginUserInfo(loginUser);
        }
    }, [loginUser]);

    React.useEffect(() => {
        putCitems(citem);
    }, [citem]);

    React.useEffect(() => {
        var element = document.querySelector('.chat-body');
        if (element) {
            element.scrollTop = element.scrollHeight - element.clientHeight;
        }
    }, [sseChatMsg]);

    const initialCurrentSelect = async () => {
        const result = await getNewestRecord<Prompt>();
        if (result) {
            setCurrInputIndex(result.id);
        }
    }

    const handleKeyUp = async () => {
        const selected = inputValue && inputValue.length > 0 ? currInputIndex - 1 : currInputIndex;
        const stored = await getToIdb<Prompt>(selected);
        if (stored) {
            setInputValue(stored.name);
            setCurrInputIndex(selected);
        }
    };

    const handleKeyDown = async () => {
        // https://stackoverflow.com/questions/35394937/keyboardevent-keycode-deprecated-what-does-this-mean-in-practice
        const selected = currInputIndex + 1;
        const stored = await getToIdb<Prompt>(selected);
        if (stored) {
            setInputValue(stored.name);
            setCurrInputIndex(selected);
        }
    };

    const saveLoginUserInfo = (userInfo: any) => {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem(WheelGlobal.ACCESS_TOKEN_NAME, userInfo.accessToken);
        localStorage.setItem(WheelGlobal.REFRESH_TOKEN_NAME, userInfo.refreshToken);
        localStorage.setItem('avatarUrl', userInfo.avatarUrl);
        localStorage.setItem(WheelGlobal.BASE_AUTH_URL, readConfig("baseAuthUrl"));
        localStorage.setItem(WheelGlobal.ACCESS_TOKEN_URL_PATH, readConfig("accessTokenUrlPath"));
        loadCurrentUser();
        setIsLoggedIn(true);
    }

    const fetchConversations = () => {
        const convReq: IConversationReq = {
            title: '',
            pageNum: 1,
            pageSize: 10
        };
        setCurrConversationReq(convReq);
        return getConversations(convReq);
    }

    const onSseMessage = (msg: string, eventSource: EventSourcePolyfill) => {
        const serverMsg: ISse35ServerMsg = JSON.parse(msg);
        if (serverMsg.choices[0] && serverMsg.choices[0].finish_reason === "vip-expired") {
            setLoadings(false);
            message.info("充值会员继续使用");
            eventSource.close();
            setShowGoodsPopup(true);
            return;
        }
        if (serverMsg.choices[0] && serverMsg.choices[0].finish_reason === "rate-limit") {
            setLoadings(false);
            message.info("超出频率限制，请稍后再试一试");
            eventSource.close();
            return;
        }
        if (serverMsg.choices[0].delta.content && serverMsg.choices[0].delta.content.length > 0) {
            appenSseMsg(serverMsg, "chatgpt");
        }
        if (serverMsg.choices[0].finish_reason && serverMsg.choices[0].finish_reason === "stop") {
            setLoadings(false);
            eventSource.close();
            if (cid === 0) {
                fetchNewestCid();
            }
        }
    }

    const fetchNewestCid = () => {
        fetchConversations().then((data: any) => {
            if (data && data.result && data.result.list) {
                const newestConversations = data.result.list.reduce((previous: any, current: any) => {
                    return (previous.createdTime > current.createdTime) ? previous : current;
                });
                const newestCid = newestConversations.id;
                if (cid === 0) {
                    setCid(newestCid);
                }
            }
        })
    }

    const appenSseMsg = (data: ISse35ServerMsg, msgType: string) => {
        setSseChatMsg((prevMapState) => {
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
        menuClose();
    };

    const handleSend = async () => {
        if (loadings) {
            return;
        }
        if (!inputValue && inputValue.trim().length === 0) {
            return;
        }
        await insertToIdb(inputValue.trim()).then((response) => {
            setCurrInputIndex(Number(response));
        });
        if (!isLoggedIn) {
            message.warning("请登录后再开启聊天");
            setLoadings(false);
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
        let ask: ChatAsk = {
            prompt: encodeURIComponent(inputValue),
            cid: cid
        };
        setTimeout(() => setLoadings(false), 15000);
        doAskPreCheck(ask, onSseMessage);
    };

    const handleEnterKey = (e: any) => {
        if (e.nativeEvent.keyCode === 13) {
            e.preventDefault();
            e.stopPropagation();
            handleSend();
        }
        // https://stackoverflow.com/questions/76139781/how-to-prevent-the-chinese-input-keyboard-keyup-and-keydown-event-pass-into-reac
        if (e.nativeEvent.keyCode === 38) {
            handleKeyUp();
        }
        if (e.nativeEvent.keyCode === 40) {
            handleKeyDown();
        }
    }

    const handleConversation = (id: number) => {
        handleMenuClick('chat');
        getConverItems(id)
    }

    const putCitems = (resp: any) => {
        if (resp && resp.list && resp.list.length > 0) {
            const newMap = new Map<string, ISseMsg>();
            const itemList = resp.list;
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
            setSseChatMsg(newMap);
        }
    }

    const getConverItems = (choosedCid: number) => {
        let items: IConversationItemReq = {
            cid: choosedCid
        };
        setCid(choosedCid);
        getConversationItems(items);
    }

    const loadMoreConversations = () => {
        const cnum = currConversationReq ? currConversationReq.pageNum + 1 : 1;
        const convReq: IConversationReq = {
            title: '',
            pageSize: 10,
            pageNum: cnum
        };
        setCurrConversationReq(convReq);
        return getConversations(convReq);
    }

    const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (currEditConversation) {
            let curr: IConversation = { ...currEditConversation };
            curr.title = e.target.value;
            if (curr) {
                setCurrEditConversation(curr);
            }
        }
    }

    const editConversations = (conversation: IConversation) => {
        setCurrEditConversation(conversation);
        setShowEditTitlePopup(true);
    }

    const delConversations = (id: number) => {
        Modal.confirm({
            title: '删除确认',
            content: '确定要永久删除会话吗？删除后无法恢复',
            onOk() {
                delConversation(id).then((response) => {
                    if (ResponseHandler.responseSuccess(response)) {
                        const newMap = new Map([...loadedConversations].filter(([key, value]) => key !== id));
                        setLoadedConversations(newMap);
                    }
                });
            },
            onCancel() {

            },
        });
    }

    function compareFn(a: [number, IConversation], b: [number, IConversation]): number {
        return Number(b[1].createdTime) - Number(a[1].createdTime);
    }

    const conversationRender = () => {
        if (loadedConversations === undefined) {
            return;
        }
        if (BaseMethods.isNull(loadedConversations)) {
            return;
        }
        const conversationList: JSX.Element[] = [];
        let sortedConversations: [number, IConversation][] = Array.from(loadedConversations.entries()).sort(compareFn);
        sortedConversations.forEach((item) => {
            conversationList.push(
                <div key={uuid()} onClick={() => handleConversation(item[0])} className="conversation-item">
                    <img src={chatPic}></img>
                    <span title={item[1].title.toString()}>{item[1].title}</span>
                    <div>
                        <EditOutlined onClick={() => editConversations(item[1])}></EditOutlined>
                    </div>
                    <div className="conversation-item-icon">
                        <DeleteOutlined onClick={() => delConversations(item[0])}></DeleteOutlined>
                    </div>
                </div>);
        });
        if (hasMoreConversation) {
            conversationList.push(
                <div key={uuid()} className="conversation-item-more">
                    <button onClick={loadMoreConversations}>加载更多</button>
                </div>
            );
        }
        return conversationList;
    }

    const loadCurrentUser = () => {
        if (!localStorage.getItem("userInfo") && isGetUserLoading === false) {
            setIsGetUserLoading(true);
            getCurrentUser().then((data: any) => {
                if (ResponseHandler.responseSuccess(data)) {
                    setUserInfo(data.result);
                    localStorage.setItem("userInfo", JSON.stringify(data.result));
                    setIsGetUserLoading(false);
                }
            });
        }
    }

    const showUserProfile = () => {
        handleMenuClick('profile');
        menuClose();
    }

    const userLogin = () => {
        if (process.env.NODE_ENV === 'production') {
            let param = {
                appId: readConfig("appId")
            };
            userLoginImpl(param).then((data: any) => {
                window.location.href = data.result;
            });
        } else {
            let param = {
                appId: readConfig("appId"),
                phone: readConfig("phone"),
                password: readConfig("password"),
                loginType: 1,
                deviceId: 1,
                deviceName: readConfig("deviceName"),
                deviceType: 4
            };
            userLoginByPhoneImpl(param);
        }
    }

    const avatarClick = () => {
        const dropdown = document.getElementById("dropdown");
        if (dropdown) {
            if (dropdown.style.display == "none" || dropdown.style.display == "") {
                dropdown.style.display = "block";
            } else {
                dropdown.style.display = "none";
            }
        }
    }

    const renderLogin = () => {
        if (isLoggedIn) {
            var avatarUrl = localStorage.getItem('avatarUrl');
            return (<a id="user-menu">
                {avatarUrl ? <Avatar size={40} src={avatarUrl} onClick={avatarClick} /> : <Avatar onClick={avatarClick} size={40} >Me</Avatar>}
                <div id="dropdown" className="dropdown-content">
                    <div onClick={() => handleMenuClick('account')}><PayCircleOutlined /><span>订阅</span></div>
                    <div onClick={showUserProfile}><ControlOutlined /><span>控制台</span></div>
                    <div onClick={doLoginOut}><LogoutOutlined /><span>登出</span></div>
                </div>
            </a>);
        }
        const accessTokenOrigin = document.cookie.split('; ').find(row => row.startsWith('accessToken='));
        if (accessTokenOrigin) {
            AuthHandler.storeCookieAuthInfo(accessTokenOrigin, readConfig("baseAuthUrl"), readConfig("accessTokenUrlPath"));
            loadCurrentUser();
            setIsLoggedIn(true);
        }
        return (<Button name='aiLoginBtn' onClick={userLogin}>登录</Button>);
    }

    const renderRightContainer = (tab: String) => {
        if (tab === "chat") {
            return (
                <div className="chat-container">
                    <ChatList myMap={sseChatMsg}></ChatList>
                    <div className="input-box-container">
                        <div className="input-box">
                            <textarea
                                id="talkInput"
                                rows={1}
                                value={inputValue}
                                onChange={handleChatInputChange}
                                onKeyDown={handleEnterKey}
                                placeholder="输入会话内容，按Enter快捷发送" />
                            <Button icon={<SendOutlined style={{
                                display: 'flex',
                                alignItems: 'center',
                                transform: 'rotate(-45deg)',
                                justifyContent: 'center'
                            }} />}
                                loading={loadings}
                                onClick={handleSend}
                            ></Button>
                        </div>
                        <div className="disclaimer">
                            <span>模型：GPT3.5-turbo</span>
                            <span>免责声明：本产品Genie提供的AI聊天服务仅供娱乐和参考之用，不能替代医生、律师和其他专业人士的意见和建议。使用本产品所产生的一切后果由用户自负，Genie不承担任何法律责任。</span>
                        </div>
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
                    <Goods refreshUser={true} appId={readConfig("appId")} store={store}></Goods>
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
            return (
                <div className="chat-container">
                    <Profile></Profile>
                </div>
            );
        }
        return (<div>开发中，敬请期待...</div>);
    }

    return (
        <div className="chat-main-body">
            <div className="conversation">
                <div className="conversation-list">
                    {conversationRender()}
                </div>
                <div className="chat-menu" >
                    <div className="conversation-action">
                        <nav>
                            <div className="conversation-menu-item" onClick={() => handleMenuClick('chat')}>
                                <MessageOutlined /><span className="action-item">聊天</span>
                            </div>
                            <div className="conversation-menu-item" onClick={() => handleMenuClick('image')}>
                                <FileImageOutlined /><span className="action-item">AI 绘画</span>
                            </div>
                            <div className="conversation-menu-item" onClick={() => handleMenuClick('about')}>
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
            <Modal title="订阅"
                open={showGoodsPopup}
                width={1000}
                onCancel={() => setShowGoodsPopup(false)}
                footer={null}>
                <Goods refreshUser={true} appId={readConfig("appId")} store={store}></Goods>
            </Modal>
            <Modal title="编辑会话标题"
                open={showEditTitlePopup}
                width={600}
                onOk={() => {
                    let params = {
                        id: currEditConversation?.id,
                        title: currEditConversation?.title
                    };
                    editConversation(params).then((resp) => {
                        if (ResponseHandler.responseSuccess(resp)) {
                            setShowEditTitlePopup(false);
                            fetchConversations();
                        }
                    });
                }}
                onCancel={() => setShowEditTitlePopup(false)}>
                <Input value={currEditConversation?.title.toString()}
                    onChange={(e) => { handleTitleChange(e) }}></Input>
            </Modal>
        </div>
    );
}

export default withConnect(Chat);

