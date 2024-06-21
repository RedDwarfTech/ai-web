import { ISseMsg } from "@/models/chat/SseMsg";
import withConnect from "@/page/component/hoc/withConnect";
import { v4 as uuid } from "uuid";
import React, { useRef, useState } from "react";
import ChatContext from "./ChatContext";
import chatMeImage from "@/asset/icon/chat-me.png";
import chatgpt from "@/asset/icon/chatgpt.svg";
import "./ChatList.css";
import { isSubscribed } from "@/service/user/UserService";
import { useSelector } from "react-redux";
import { BaseMethods } from "rdjs-wheel";

export interface IChatAskList {
  myMap: Map<string, ISseMsg>;
}

/**
 * when the chat list increase, the chat list will rerender every time when user input words
 * so add the React.memo to avoid the dulplicate rerender
 */
const ChatList: React.FC<IChatAskList> = React.memo((props) => {
  const [subscribed, setSubscribed] = useState(isSubscribed() || false);
  const { user } = useSelector((state: any) => state.user);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    
  }, [props.myMap]);

  React.useEffect(() => {
    setTimeout(
        function() {
            scrollToBottom();
        }
        .bind(this),
        100
    );
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  React.useEffect(() => {
    if (!BaseMethods.isNull(user)) {
      if (Number(user.autoRenewProductExpireTimeMs) > new Date().getTime()) {
        setSubscribed(true);
      }
    }
  }, [user]);

  

  const renderChat = () => {
    const tagList: JSX.Element[] = [];
    if (props.myMap.size === 0 && !subscribed) {
      // return newGuide();
    } else if (props.myMap.size === 0 && subscribed) {
      // return genieHomeGuide();
    } else {
      props.myMap.forEach((value, key) => {
        let chatValue: ISseMsg = value;
        if (value.type === "prompt") {
          tagList.push(
            <div key={uuid()} className="chat-message">
              <img alt="" className="chat-me" src={chatMeImage}></img>
              <ChatContext msg={chatValue.msg}></ChatContext>
            </div>
          );
        } else {
          tagList.push(
            <div key={uuid()} className="chat-message">
              <img alt="" className="chat-me" src={chatgpt}></img>
              <ChatContext msg={chatValue.msg}></ChatContext>
            </div>
          );
        }
      });
      return tagList;
    }
  };

  return (
    <div className="chat-list-body">
      {renderChat()}
      <div ref={messagesEndRef} />
    </div>
  );
});
export default withConnect(ChatList);
