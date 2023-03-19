import React from "react";
import "./ChatContext.css"
import ReactMarkdown from 'react-markdown';
import SyntaxHighlighter from "react-syntax-highlighter";
import { dark, oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { CodeProps } from "react-markdown/lib/ast-to-react";

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
                        return !inline && match ? (
                            <SyntaxHighlighter
                                style={oneDark}
                                language={match[1]}
                                PreTag="div"
                                {...props}
                            >
                                {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
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
        <div className="qa-content">
            {msgRender()}
        </div>
    );
}

export default ChatContext;