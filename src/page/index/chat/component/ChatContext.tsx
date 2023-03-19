import React from "react";
import "./ChatContext.css"
import ReactMarkdown from 'react-markdown';

export interface IChatMsg {
    msg: string
}

const ChatContext: React.FC<IChatMsg> = (props) => {
    const message = props.msg;
    const msgRender = () => {
        if (message) {
            return(<ReactMarkdown>
                {message}
            </ReactMarkdown>);
        }
        return (<div></div>);
    }

    return (
        <div className="qa-content">
            {msgRender()}
        </div>
    );
}

export default ChatContext;