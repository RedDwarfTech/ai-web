import React, { useState } from "react";
import Chat from "./chat/Chat";
import { IUserModel } from "rdjs-wheel";
import "./Home.css";
import withConnect from "@/page/component/hoc/withConnect";

const Home: React.FC = () => {

  const [currentPage, setCurrentPage] = useState("chat");
  const [userInfo, setUserInfo] = useState<IUserModel>();

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

  return (
    <div id="home-root">
      <Chat menu={currentPage} onMenuClick={(value) => { setCurrentPage(value.toString()); }}></Chat>
    </div>
  );
}

export default withConnect(Home);

