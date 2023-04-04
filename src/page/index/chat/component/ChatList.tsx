import { ISseMsg } from "@/models/chat/SseMsg";
import withConnect from "@/page/component/hoc/withConnect";
import { v4 as uuid } from 'uuid';
import React from "react";
import ChatContext from "./ChatContext";
import chatMeImage from "@/asset/icon/chat-me.png";
import chatgpt from "@/asset/icon/chatgpt.svg";

export interface IChatAskList {
    myMap: Map<string, ISseMsg>,
}

const ChatList: React.FC<IChatAskList> = React.memo((props) => {
    
    const renderChat = () => {
        debugger
        const tagList: JSX.Element[] = [];
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
    };
    

    return(
        <div>
          {renderChat()}
        </div>
    )
})
export default withConnect(ChatList);
