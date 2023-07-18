import { UserModel } from "rdjs-wheel";
import React, { useState } from "react";
import "./Profile.css";
import alipayPic from "@/asset/icon/alipay-circle.png";
import Feedback from "./feedback/Feedback";
import withConnect from "@/page/component/hoc/withConnect";
import { getCurrentUser } from "@/service/user/UserService";
import { useSelector } from "react-redux";
import PromptHistory from "./prompt/PromptHistory";
import { UserProfile, UserService } from "rd-component";
import Experience from "./experience/Experience";
import "@/scss/style.scss";
import { readConfig } from "@/config/app/config-reader";
import store from "@/store/store";

export type ProfileProps = {
  panelUserInfo: UserModel | undefined;
};

const Profile: React.FC = () => {

  const [currentPanel, setCurrentPanel] = useState('userinfo');
  const [userInfo, setUserInfo] = useState<UserModel>();
  const { user } = useSelector((state: any) => state.user);

  React.useEffect(() => {
    getUserInfo();
  }, []);

  React.useEffect(() => {
    if (user && Object.keys(user).length > 0) {
      setUserInfo(user);
    }
  }, [user]);

  const getUserInfo = () => {
    const userInfoJson = localStorage.getItem("userInfo");
    if (userInfoJson) {
      const uInfo: UserModel = JSON.parse(userInfoJson);
      setUserInfo(uInfo);
    } else {
      getCurrentUser();
    }
  }

  const userLogin = (url: string) => {
    let param = {
      appId: readConfig("appId"),
      userAction: "bind",
      scope: "auth_user"
    };
    UserService.userLoginImpl(param, store, url).then((data: any) => {
      window.location.href = data.result;
    });
  }
  
  const handleBind = (channelType: number) => {
    if (channelType === 5) {
      userLogin("/post/alipay/login/getQRCodeUrl");
    }
    if (channelType === 1) {
      userLogin("/post/wechat/login/getQRCodeUrl");
    }
  }

  const getLoginType = () =>  {
    const accessToken = localStorage.getItem("x-access-token");
    if(!accessToken){
      return false;
    }
    const claim = JSON.parse(atob(accessToken.split('.')[1]));
    return claim.lt !== 1;
  }

  const renderBindStatus = (channelType: number) => {
    if (!userInfo || !userInfo.thirdBind || userInfo.thirdBind.length === 0) {
      return (<button disabled ={getLoginType()} className="btn btn-primary" onClick={() => handleBind(channelType)}>绑定</button>);
    }
    const bind = userInfo.thirdBind.find(item => item.channelType === channelType);
    if (bind && bind.bindStatus == 1) {
      return (<button className="btn btn-primary">解绑</button>);
    }
    return (<button disabled={getLoginType()} className="btn btn-primary" onClick={() => handleBind(channelType)}>绑定</button>);
  }

  const renderPanelContent = () => {
    if (currentPanel && currentPanel === 'experience') {
      return <Experience></Experience>
    }
    if (currentPanel && currentPanel === 'feedback') {
      return <Feedback></Feedback>
    }
    if (currentPanel && currentPanel === 'prompt') {
      return (<PromptHistory></PromptHistory>);
    }
    if (currentPanel && currentPanel === 'userinfo') {
      return (<div id="userinfo">
        <div className="card" style={{ marginBottom: '20px' }}>
          <div className="card-header">
            <h6 className="card-title">基本信息</h6>
          </div>
          <div className="card-body row">
            <div className="col">
              <div ><span className="user-info">用户昵称:</span></div>
              <div ><span className="user-info">{userInfo ? userInfo!.nickname : ""}</span></div>
              <div ></div>
            </div>
            <div className="col">
              <div ><span className="user-info">会员到期日:</span></div>
              <div ><span className="user-info">{userInfo ? UserProfile.getVipExpiredTime(userInfo) : "--"}</span></div>
              <div ></div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <h6 className="card-title">登录凭据</h6>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col">
                <img style={{ height: '40px', width: '40px'}} src={alipayPic}></img>
              </div>
              <div className="col">{renderBindStatus(5)}</div>
            </div>
          </div>
        </div>
      </div>);
    }
    return (<div></div>);
  }

  const handlePanelSwitch = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    const targetData = e.target.getAttribute('data-target') || e.target.parentNode.getAttribute('data-target');;
    if (targetData) {
      setCurrentPanel(targetData);
    }
  }

  return (
    <div className="panel-container">
      <div className="panel-menu">
        <div className="menu-item" data-target="userinfo" id="userinfo-menu" onClick={handlePanelSwitch}><span>用户信息</span></div>
        <div className="menu-item" data-target="prompt" id="userinfo-menu" onClick={handlePanelSwitch}><span>提示词</span></div>
        <div className="menu-item" data-target="experience" id="feedback-menu" onClick={handlePanelSwitch}><span>实验特性</span></div>
        <div className="menu-item" data-target="feedback" id="feedback-menu" onClick={handlePanelSwitch}><span>意见与建议</span></div>
      </div>
      <div className="panel-content">
        {renderPanelContent()}
      </div>
    </div>
  );
}

export default withConnect(Profile);
