import { Avatar, Card, Col, Row } from "antd";
import { IUserModel, TimeUtils } from "js-wheel";
import React, { useRef, useState } from "react";
import "./Profile.css";
import alipayPic from "@/asset/icon/alipay-circle.png";
import Feedback from "./feedback/Feedback";
import withConnect from "@/page/component/hoc/withConnect";

export type ProfileProps = {
  panelUserInfo: IUserModel | undefined;
};

const Profile: React.FC<ProfileProps> = (props: any) => {

  const [currentPanel, setCurrentPanel] = useState('userinfo');

  React.useEffect(() => {
   
  }, [])

  const userInfo = props.panelUserInfo;

  const getVipExpiredTime = (userInfo: any) => {
    if (userInfo && userInfo.autoRenewProductExpireTimeMs && userInfo.autoRenewProductExpireTime > new Date().getTime()) {
      return TimeUtils.getFormattedTime(Number(userInfo.autoRenewProductExpireTimeMs));
    } else {
      return "--";
    }
  }

  const renderPanelContent = () => {
    if (currentPanel && currentPanel === 'feedback') {
      return <Feedback></Feedback>
    }
    if (currentPanel && currentPanel === 'userinfo') {
      return (<div id="userinfo">
        <Card title="基本信息" style={{ marginBottom: '20px' }}>
          <Row style={{ marginTop: '10px', marginBottom: '20px' }}>
            <Col span={8}><span className="user-info">用户昵称</span></Col>
            <Col span={8}><span className="user-info">{userInfo ? userInfo!.nickname : ""}</span></Col>
            <Col span={8}></Col>
          </Row>
          <Row style={{ marginTop: '10px', marginBottom: '10px' }}>
            <Col span={8}><span className="user-info">会员到期日</span></Col>
            <Col span={8}><span className="user-info">{getVipExpiredTime(userInfo)}</span></Col>
            <Col span={8}></Col>
          </Row>
        </Card>
        <Card title="登录凭据">
          <Row style={{ marginTop: '10px', marginBottom: '10px' }}>
            <Col span={8}>
              <Avatar src={alipayPic}></Avatar>
            </Col>
            <Col span={8}><span>已绑定</span></Col>
            <Col span={8}><span></span></Col>
          </Row>
        </Card>
      </div>);
    }
    return (<div></div>);
  }

  const handlePanelSwitch = (e: any) => {
    e.preventDefault(); 
    e.stopPropagation();
    const targetData = e.target.getAttribute('data-target')|| e.target.parentNode.getAttribute('data-target');;
    if(targetData){
      setCurrentPanel(targetData);
    }
  }

  return (
    <div className="panel-container">
      <div className="panel-menu">
        <div className="menu-item" data-target="userinfo" id="userinfo-menu" onClick={handlePanelSwitch}><span>用户信息</span></div>
        <div className="menu-item" data-target="feedback" id="feedback-menu" onClick={handlePanelSwitch}><span>意见与建议</span></div>
      </div>
      <div className="panel-content">
        {renderPanelContent()}
      </div>
    </div>
  );
}

export default withConnect(Profile);
