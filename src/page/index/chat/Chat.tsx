import Modal from 'react-modal';
import React, { ChangeEvent, useState } from "react";
import { useSelector } from "react-redux";
import "./Chat.css";
import { toast, ToastContainer } from 'react-toastify';
import { v4 as uuid } from 'uuid';
import { getCurrentUser } from "@/service/user/UserService";
import { ChatAsk } from "@/models/request/chat/ChatAsk";
import { IChatAskResp } from "@/models/chat/ChatAskResp";
import { doAskPreCheck } from "@/service/chat/SseClientService";
import { ISseMsg } from "@/models/chat/SseMsg";
import { ISse35ServerMsg } from "@/models/chat/3.5/Sse35ServerMsg";
import dayjs from "dayjs";
import { AuthHandler, UserModel, ResponseHandler, TimeUtils } from "rdjs-wheel";
import { IConversation } from "@/models/chat/3.5/Conversation";
import { delConversation, editConversation, getConversations } from "@/service/chat/ConversationService";
import { IConversationReq } from "@/models/request/conversation/ConversationReq";
import { BaseMethods } from 'rdjs-wheel';
import { getConversationItems } from "@/service/chat/ConversationItemService";
import { IConversationItemReq } from "@/models/request/conversation/ConversationItemReq";
import { readConfig } from "@/config/app/config-reader";
import { ControlOutlined, DeleteOutlined, EditOutlined, FileImageOutlined, InfoCircleOutlined, LogoutOutlined, MessageOutlined, PayCircleOutlined, SendOutlined } from "@ant-design/icons";
import About from "@/page/about/About";
import { Goods, UserService } from "rd-component";
import Profile from "@/page/user/profile/Profile";
import ChatList from "./component/ChatList";
import chatPic from "@/asset/icon/chat/chat.svg";
import { Prompt, getNewestRecord, getToIdb, insertToIdb } from "@/storage/indexdb/idb";
import { EventSourcePolyfill } from "event-source-polyfill";
import withConnect from "@/page/component/hoc/withConnect";
import store from "@/store/store";
import "rd-component/dist/style.css";
import GenImages from "../images/GenImages";
import avatarImg from "@/asset/icon/avatar.png";
import { useNavigate } from "react-router-dom";

const Chat: React.FC<IChatAskResp> = (props: IChatAskResp) => {
    const [inputValue, setInputValue] = useState('');
    const [sseChatMsg, setSseChatMsg] = useState(new Map<string, ISseMsg>());
    const [loadings, setLoadings] = useState<boolean>(false);
    const [cid, setCid] = useState<number>(0);
    const [promptLines, setPromptLines] = useState<number>(1);
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') || false);
    const [isGetUserLoading, setIsGetUserLoading] = useState(false);
    const [_, setUserInfo] = useState<UserModel>();
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
    const navigate = useNavigate();

    const handleChatInputChange = (e: any) => {
        const inputContent = e.target.value;
        setInputValue(inputContent);
        if (inputContent && inputContent.length > 0) {
            // https://stackoverflow.com/questions/76324678/how-can-i-make-a-textarea-expand-automatically-to-a-maximum-height
            const talkInput = document.getElementById("talkInput");
            if (!talkInput) return;
            const lines = calcRows();
            if (lines) {
                if (lines > 0 && lines < 4) {
                    setPromptLines(lines);
                }
            }
        }
    };

    const calcRows = () => {
        // https://stackoverflow.com/questions/1760629/how-to-get-number-of-rows-in-textarea-using-javascript
        const ta = document.getElementById("talkInput");
        if (!ta) return;
        // This will get the line-height only if it is set in the css,
        // otherwise it's "normal"
        ta.style.cssText = 'line-height: 23px;';
        const taLineHeight = parseInt(window.getComputedStyle(ta).getPropertyValue('line-height'));
        // Get the scroll height of the textarea
        const taHeight = calcHeight(ta, taLineHeight);
        // calculate the number of lines
        if (taHeight == undefined) {
            return;
        }
        const numberOfLines = Math.ceil(taHeight / taLineHeight);
        return numberOfLines;
    };

    const calcHeight = (ta: HTMLElement, scanAmount: number) => {
        var origHeight = ta.style.height;
        var height = ta.offsetHeight;
        var scrollHeight = ta.scrollHeight;
        var overflow = ta.style.overflow;
        /// only bother if the ta is bigger than content
        if (height >= scrollHeight) {
            /// check that our browser supports changing dimension
            /// calculations mid-way through a function call...
            ta.style.height = (height + scanAmount) + 'px';
            /// because the scrollbar can cause calculation problems
            ta.style.overflow = 'hidden';
            /// by checking that scrollHeight has updated
            if (scrollHeight < ta.scrollHeight) {
                /// now try and scan the ta's height downwards
                /// until scrollHeight becomes larger than height
                while (ta.offsetHeight >= ta.scrollHeight && height > 23) {
                    ta.style.height = (height -= scanAmount) + 'px';
                }
                /// be more specific to get the exact height
                while (ta.offsetHeight < ta.scrollHeight && height > 23) {
                    ta.style.height = (height++) + 'px';
                }
                /// reset the ta back to it's original height
                ta.style.height = origHeight;
                /// put the overflow back
                ta.style.overflow = overflow;
                return height;
            }
        } else {
            return scrollHeight;
        }
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
            AuthHandler.storeLoginAuthInfo(loginUser, readConfig("baseAuthUrl"), readConfig("accessTokenUrlPath"));
            loadCurrentUser();
            setIsLoggedIn(true);
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
            toast.info("充值会员继续使用");
            eventSource.close();
            setShowGoodsPopup(true);
            return;
        }
        if (serverMsg.choices[0] && serverMsg.choices[0].finish_reason === "rate-limit") {
            setLoadings(false);
            toast.info("超出频率限制，请稍后再试一试");
            eventSource.close();
            return;
        }
        if (serverMsg.choices[0].delta && serverMsg.choices[0].delta.content && serverMsg.choices[0].delta.content.length > 0) {
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
            toast.warning("请登录后再开启聊天");
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

    const delConversations = (showDelTitlePopup: boolean, id: number) => {
        return (<Modal contentLabel="删除确认"
            isOpen={showDelTitlePopup}
            style={customStyles}>
            <button onClick={() => {
                delConversation(id).then((response: any) => {
                    if (ResponseHandler.responseSuccess(response)) {
                        const newMap = new Map([...loadedConversations].filter(([key, value]) => key !== id));
                        setLoadedConversations(newMap);
                    }
                });
            }}>确认删除</button>
            <button onClick={() => delConversations(false, id)}>取消</button>
        </Modal>);
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
                        <DeleteOutlined onClick={() => delConversations(true, item[0])}></DeleteOutlined>
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
            return (
                <a id="user-menu">
                    {avatarUrl ? <img className="avatarImg" src={avatarUrl} onClick={avatarClick} /> : <img className="avatarImg" src={avatarImg} onClick={avatarClick} ></img>}
                    <div id="dropdown" className="dropdown-content">
                        <div onClick={() => handleMenuClick('account')}><PayCircleOutlined /><span>订阅</span></div>
                        <div onClick={showUserProfile}><ControlOutlined /><span>控制台</span></div>
                        <div onClick={() => UserService.doLoginOut(readConfig("logoutUrl"))}><LogoutOutlined /><span>登出</span></div>
                    </div>
                </a>
            );
        }
        const accessTokenOrigin = document.cookie.split('; ').find(row => row.startsWith('accessToken='));
        if (accessTokenOrigin) {
            AuthHandler.storeCookieAuthInfo(accessTokenOrigin, readConfig("baseAuthUrl"), readConfig("accessTokenUrlPath"));
            loadCurrentUser();
            setIsLoggedIn(true);
        }
        return (<button className="loginButton" name='aiLoginBtn' onClick={() => { navigate("/user/login") }}>登录</button>);
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
                                rows={promptLines ? promptLines : 1}
                                value={inputValue}
                                onChange={handleChatInputChange}
                                onKeyDown={handleEnterKey}
                                placeholder="输入会话内容，按Enter快捷发送" />
                            <button
                                onClick={handleSend}
                            >
                                <span>
                                    <SendOutlined style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        transform: 'rotate(-45deg)',
                                        justifyContent: 'center'
                                    }} />
                                </span>
                            </button>
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
                    <Goods refreshUrl={readConfig("refreshUserUrl")} appId={readConfig("appId")} store={store}></Goods>
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

    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
        },
    };

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
            <Modal contentLabel="订阅"
                isOpen={showGoodsPopup}
                style={customStyles}
                onRequestClose={() => setShowGoodsPopup(false)}
            >
                <Goods refreshUrl={readConfig("refreshUserUrl")} appId={readConfig("appId")} store={store}></Goods>
            </Modal>
            <Modal contentLabel="编辑会话标题"
                isOpen={showEditTitlePopup}
                style={customStyles}>
                <input value={currEditConversation?.title.toString()}
                    onChange={(e) => { handleTitleChange(e) }}></input>
                <button onClick={() => {
                    let params = {
                        id: currEditConversation?.id,
                        title: currEditConversation?.title
                    };
                    editConversation(params).then((resp: any) => {
                        if (ResponseHandler.responseSuccess(resp)) {
                            setShowEditTitlePopup(false);
                            fetchConversations();
                        }
                    });
                }}>确认</button>
                <button onClick={() => setShowEditTitlePopup(false)}>取消</button>
            </Modal>
            <ToastContainer />
        </div>
    );
}

export default withConnect(Chat);

