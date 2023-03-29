import React from "react";
import "./ChatContext.css"
import ReactMarkdown from 'react-markdown';
import SyntaxHighlighter from "react-syntax-highlighter";
import { dark, oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import OmsSyntaxHighlight from "./OmsSyntaxHighlight";

export interface IChatMsg {
    msg: string
}

const ChatContext: React.FC<IChatMsg> = (props) => {
    const message = props.msg;
    const msgRender = () => {
        if (message) {
            return (<ReactMarkdown children={message}
                components={{
                    code({ node, inline, className, children}) {
                        const match = /language-(\w+)/.exec(className || '')
                        debugger
                        return !inline && match ? (
                            <OmsSyntaxHighlight textContent={String(children).replace(/\n$/, '')} language={match[1]} darkMode />
                        ) : (
                            <code className={className} {...props}>
                                {children}
                            </code>
                        )
                    }
                }}
            />);
        }
        return (<div></div>);
    }

    return (
        // 采用2层嵌套，第一层采用flex布局，是为了使内部的组件垂直居中
        <div className="qa-content">
            <div className="qa-container">
                {msgRender()}
            </div>
        </div>
    );
}

export default ChatContext;