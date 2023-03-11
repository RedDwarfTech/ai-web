import { Input } from "antd";
import React from "react";
import { connect } from "react-redux";
import "./Chat.css"

const Chat: React.FC = (props) => {

    return(
        <div className="chat-container">
            <div className="chat-header">
                <h2>对话</h2>
            </div>
            <div className="chat-body">
                <div className="chat-message">
                <div className="message-time">10:00 AM</div>
                <div className="message-text">Hello, how can I help you today?</div>
                </div>
                <div className="chat-message">
                <div className="message-time">10:05 AM</div>
                <div className="message-text">I have a question about React.</div>
                </div>
                <div className="chat-message">
                <div className="message-time">10:07 AM</div>
                <div className="message-text">Sure, what's your question?</div>
                </div>
                <div className="chat-message">
                <div className="message-time">10:10 AM</div>
                <div className="message-text">How do I pass data from a child component to a parent component in React?</div>
                </div>
            </div>
            <div className="chat-form">
                <Input type="text" placeholder="Type your message here..."/>
                <button>发送</button>
            </div>
        </div>
    );
}

const mapStateToProps = (state: any) => ({
    robot: state.robot
  });
  
  const mapDispatchToProps = (dispatch: any) => {
    return {
      
    };
  };
  
  export default connect(mapStateToProps, mapDispatchToProps)(Chat);
  
