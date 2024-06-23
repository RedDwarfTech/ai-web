import React, { useState } from "react";
import Chat from "./chat/Chat";
import { UserModel } from "rdjs-wheel";
import "./Home.css";
import withConnect from "@/page/component/hoc/withConnect";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const Home: React.FC = () => {

  const [currentPage, setCurrentPage] = useState("chat");
  const [userInfo, setUserInfo] = useState<UserModel>();
  const { errors } = useSelector((state: any) => state.rdRootReducer.sys);

  React.useEffect(() => {
    if (currentPage === 'profile') {
      if (!userInfo) {
        const storeUser = localStorage.getItem("userInfo");
        if (storeUser) {
          setUserInfo(JSON.parse(storeUser));
        }
      }
    }
  });

  React.useEffect(()=>{
    if(errors && errors.msg){
      toast.error("注意：" + errors.msg);
    }
  },[errors]);

  return (
    <div id="home-root">
      <Chat menu={currentPage} onMenuClick={(value) => { setCurrentPage(value.toString()); }}></Chat>
    </div>
  );
}

export default withConnect(Home);

