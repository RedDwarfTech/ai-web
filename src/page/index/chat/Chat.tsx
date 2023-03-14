import { Button, Input } from "antd";
import React, { useState } from "react";
import { connect } from "react-redux";
import "./Chat.css"

const Chat: React.FC = (props) => {

    const [inputValue, setInputValue] = useState('');
    const [webSocketStore, setWebSocketStore] = useState<WebSocket | null>(null);
    const [myMap, setMyMap] = useState(new Map());

    const handleChange = (e:any) => {
      setInputValue(e.target.value);
    };
    
    function getCurrentTime() {
        const now = new Date();
        const year = now.getFullYear();
        const month = padLeftZero(now.getMonth() + 1);
        const date = padLeftZero(now.getDate());
        const hour = padLeftZero(now.getHours());
        const minute = padLeftZero(now.getMinutes());
        const second = padLeftZero(now.getSeconds());
        const millisecond = padLeftZero(now.getMilliseconds(), 3);
        return `${year}-${month}-${date} ${hour}:${minute}:${second} ${millisecond}`;
      }
      
      // 左边补零
      function padLeftZero(val: number, len: number = 2) {
        return (Array(len).join('0') + val).slice(-len);
      }

    React.useEffect(() => {
        var websocket:any = null;

        //判断当前浏览器是否支持WebSocket
        if('WebSocket' in window) {
            //改成你的地址
            websocket = new WebSocket("wss://ai.poemhub.top/post/websocket");
        } else {
            alert('当前浏览器 Not support websocket')
        }

           //连接发生错误的回调方法
        websocket.onerror = function(e:any) {
            console.log("WebSocket连接发生错误",e);
        };
        
        //连接成功建立的回调方法
        websocket.onopen = function() {
            console.log("WebSocket连接成功");
        }

        //接收到消息的回调方法
        websocket.onmessage = function(event:any) {
            console.log("接收到消息",event);
            const now = getCurrentTime();
            const newMap = new Map(myMap);
            newMap.set(now, event.data.toString());
            // setMyMap(newMap);
            setMyMap((prevMapState) => {
                const newMapState = new Map<string, any>(prevMapState);
                newMapState.set(now, event.data.toString());
                return newMapState;
              });
        }
        
        //连接关闭的回调方法
        websocket.onclose = function() {
            console.log("WebSocket closed");
        }
        
        //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
        window.onbeforeunload = function() {
            closeWebSocket();
        }
        
        //关闭WebSocket连接
        function closeWebSocket() {
            websocket.close();
        }

        setWebSocketStore(websocket);

      }, []);

    const handleSend = () => {
        if(inputValue){
            if(webSocketStore == null){
                return ;
            }
            //发送消息
            webSocketStore.send(inputValue);
        }
    };

    const renderChat = () => {
        const tagList: JSX.Element[] = [];
        myMap.forEach((value,key)=>{
            tagList.push(<div className="chat-message">
            <div className="message-time">{key}</div>
            <div className="message-text">{value}</div>
            </div>);
        });
        return tagList;
    };

    return(
        <div className="chat-container">
            <div className="chat-header">
                <span>会话</span>
            </div>
            <div className="chat-body">
                {renderChat()}
            </div>
            <div className="chat-form">
                <Input id="talkInput" value={inputValue} onChange={handleChange} type="text" placeholder="输入会话内容"/>
                <Button onClick={handleSend}><span>发送</span></Button>
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
  
