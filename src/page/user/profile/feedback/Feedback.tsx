import withConnect from "@/page/component/hoc/withConnect";
import { Button, Input, message } from "antd";
import { useState } from "react";
import './Feedback.css';
import { submitFeedback } from "@/service/user/FeedbackService";
import { isLoggedIn } from "@/service/user/UserService";
import { ResponseHandler } from "js-wheel";

const Feedback: React.FC = (props: any) => {

    const [feedbackValue, setFeedbackValue] = useState('');

    function handleInputChange(event: any) {
        setFeedbackValue(event.target.value);
    }

    const handleFeedback = () => {
        if(!isLoggedIn){
            message.warning("请登录后提交反馈");
        }
        if (feedbackValue == null || feedbackValue.length == 0) {
            return;
        }
        const params = {
            feedback: feedbackValue
        };
        submitFeedback(params).then((data) => {
            if(ResponseHandler.responseSuccess(data)){
                debugger
                message.info("提交成功");
            }
        });
    }

    return (<div id="feedback">
        <p>您可以反馈使用问题、建议。</p>
        <div className="feedback-area">
            <Input onChange={handleInputChange} placeholder="请输入反馈内容"></Input>
            <Button type="primary" onClick={handleFeedback} className="feedback-submit">提交反馈</Button>
        </div>
    </div>);
}

export default withConnect(Feedback);

