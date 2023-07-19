import { ISseMsg } from "@/models/chat/SseMsg";
import withConnect from "@/page/component/hoc/withConnect";
import { v4 as uuid } from 'uuid';
import React, { useEffect, useState } from "react";
import ChatContext from "./ChatContext";
import chatMeImage from "@/asset/icon/chat-me.png";
import chatgpt from "@/asset/icon/chatgpt.svg";
import './ChatList.css';
import { isSubscribed } from "@/service/user/UserService";
import { useSelector } from "react-redux";
import { BaseMethods } from "rdjs-wheel";

export interface IChatAskList {
    myMap: Map<string, ISseMsg>,
}

/**
 * when the chat list increase, the chat list will rerender every time when user input words
 * so add the React.memo to avoid the dulplicate rerender 
 */
const ChatList: React.FC<IChatAskList> = React.memo((props) => {
    const [subscribed, setSubscribed] = useState(isSubscribed() || false);
    const { user } = useSelector((state: any) => state.user)

    useEffect(() => {
        if (!BaseMethods.isNull(user)) {
            if (Number(user.autoRenewProductExpireTimeMs) > new Date().getTime()) {
                setSubscribed(true);
            }
        }
    }, [user]);

    const renderChat = () => {
        const tagList: JSX.Element[] = [];
        if (props.myMap.size === 0 && !subscribed) {
            return newGuide();
        } else if (props.myMap.size === 0 && subscribed) {
            return genieHomeGuide();
        } else {
            props.myMap.forEach((value, key) => {
                let chatValue: ISseMsg = value;
                if (value.type === "prompt") {
                    tagList.push(
                        <div key={uuid()} className="chat-message">
                            <img className="chat-me" src={chatMeImage}></img>
                            <ChatContext msg={chatValue.msg}></ChatContext>
                        </div>);
                } else {
                    tagList.push(
                        <div key={uuid()} className="chat-message">
                            <img className="chat-me" src={chatgpt}></img>
                            <ChatContext msg={chatValue.msg}></ChatContext>
                        </div>);
                }
            });
            return tagList;
        }
    };

    const genieHomeGuide = () => {
        return (
            <div className="use-guide">
                <div className="use-guide-container">
                    <div className="demo-faq">
                        <a href="https://reddwarftech.github.io/2023/04/16/genie/" target="_blank">了解Genie</a>
                    </div>
                    <div className="demo-faq">
                        <a href="https://reddwarftech.github.io/2023/07/13/genie-ppt/" target="_blank">用Genie快速自动生成PPT</a>
                    </div>
                </div>
            </div>
        );
    }

    const newGuide = () => {
        return (
            <div className="steps-guide">
                <div className="guide-container">
                    <div className="tips chat-tips">第一步：登录,点击左下侧按钮登录</div>
                    <div className="tips chat-tips">第二步：订阅,点击登录头像-订阅菜单，选择订阅套餐，最低1元试用</div>
                    <div className="tips chat-tips">第三步：使用Genie,页面底部输入会话内容，开启聊天</div>
                </div>
                <div>
                    {genieHomeGuide()}
                    <div className="tips chat-tips"><strong>提示：</strong>每天有2次免费试用额度。</div>
                </div>
            </div>
        );
    }

    return (
        <div className="chat-body">
            {renderChat()}
        </div>
    )
})
export default withConnect(ChatList);
