import { Avatar, Button, Dropdown, Menu } from "antd";
import React, { useState } from "react";
import { connect } from "react-redux";
import "./GenieHeader.css"
import queryString from 'query-string';
import { useLocation } from "react-router-dom";
import { userLoginImpl } from "../../../service/user/UserService";

export type HeaderFormProps = {
    onMenuClick: (menu: String) => void;
};

const GenieHeader: React.FC<HeaderFormProps> = (props) => {

    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isAiLoggedIn') || false);
    const location = useLocation();

    const handleMenuClick = (menu:string) => {
        props.onMenuClick(menu);
    };

    const handleLogout=()=>{
        localStorage.removeItem('isAiLoggedIn');
        localStorage.removeItem('aiAccessToken');
        localStorage.removeItem('aiAvatarUrl');
        window.location.href="https://ai.poemhub.top";
    }

    const handleCruisePro=()=>{
        // showTabImpl(4);
    }

    const userLogin =() => {
      let param = {
        appId: 'vOghoo10L9'
      };
      userLoginImpl(param).then((data: any) => {
        window.location.href=data.result;
      });
    }

    const menuItems = [
        <Menu.Item key="1"><span onClick={handleCruisePro}>Cruise Pro</span></Menu.Item>,
        <Menu.Item key="2"><span onClick={handleLogout}>登出</span></Menu.Item>
      ];

    const renderLogin=()=>{
        if(isLoggedIn){
          var avatarUrl = localStorage.getItem('aiAvatarUrl');
          if(avatarUrl){
            return (<a>
              <Dropdown overlay={<Menu>{menuItems}</Menu>} trigger={['click']}>
                <Avatar size={40} src={avatarUrl} />
              </Dropdown>
              </a>);
          }else{
            return (<a>
              <Dropdown overlay={<Menu>{menuItems}</Menu>} trigger={['click']}>
                <Avatar size={40} >Me</Avatar>
              </Dropdown>
              </a>);
          }
        }
        const parsed = queryString.parse(location.search);
        if(parsed != null && parsed.access_token && parsed.avatar_url){
          localStorage.setItem('isAiLoggedIn', "true");
          localStorage.setItem('aiAccessToken', parsed.access_token.toString());
          localStorage.setItem('aiAvatarUrl',parsed.avatar_url.toString());
          window.location.href="https://ai.poemhub.top";
        }
        return (<Button name='aiLoginBtn' onClick={userLogin}>登录</Button>);
      }

    return(<header>
        <div>
            <nav>
                <a onClick={()=>handleMenuClick('chat')}>聊天</a>
                <a onClick={()=>handleMenuClick('account')}>账号购买</a>
                <a onClick={()=>handleMenuClick('about')}>关于</a>
                {renderLogin()}
            </nav>
        </div>
    </header>);
}

const mapStateToProps = (state: any) => ({
    robot: state.robot
  });
  
  const mapDispatchToProps = (dispatch: any) => {
    return {
      
    };
  };
  
  export default connect(mapStateToProps, mapDispatchToProps)(GenieHeader);
  
