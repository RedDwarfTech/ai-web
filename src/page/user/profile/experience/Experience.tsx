import { useNavigate } from "react-router-dom";

const Experience: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div><button onClick={()=>{
            navigate("/user/login")
        }}>新版登录</button></div>
    );
}


export default Experience;