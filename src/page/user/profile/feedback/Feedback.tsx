import withConnect from "@/page/component/hoc/withConnect";
import { useState } from "react";
import './Feedback.css';
import { submitFeedback } from "@/service/user/FeedbackService";
import { isLoggedIn } from "@/service/user/UserService";
import { ResponseHandler } from "rdjs-wheel";
import { toast, ToastContainer } from 'react-toastify';

const Feedback: React.FC = () => {

    const [feedbackValue, setFeedbackValue] = useState('');

    function handleInputChange(event: any) {
        setFeedbackValue(event.target.value);
    }

    const handleFeedback = () => {
        if(!isLoggedIn){
            toast.warning("请登录后提交反馈");
        }
        if (feedbackValue == null || feedbackValue.length == 0) {
            return;
        }
        const params = {
            feedback: feedbackValue
        };
        submitFeedback(params).then((data) => {
            if(ResponseHandler.responseSuccess(data)){
                toast.info("提交成功");
            }
        });
    }

    return (<div id="feedback">
        <p>您可以反馈使用问题、建议。</p>
        <div className="feedback-area">
            <textarea rows = {3} onChange={handleInputChange} placeholder="请输入反馈内容"></textarea>
            <button onClick={handleFeedback} className="feedback-submit">提交反馈</button>
        </div>
        <ToastContainer />
    </div>);
}

export default withConnect(Feedback);

