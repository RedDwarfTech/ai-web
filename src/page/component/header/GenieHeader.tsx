import { Avatar, Button, Dropdown, Menu } from "antd";
import React, { useState } from "react";
import { connect } from "react-redux";
import type { MenuProps } from 'antd';
import "./GenieHeader.css"
import { doLoginOut, userLoginImpl } from "../../../service/user/UserService";

export type HeaderFormProps = {
    onMenuClick: (menu: String) => void;
};

const GenieHeader: React.FC<HeaderFormProps> = (props) => {

    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') || false);

    const handleMenuClick = (menu:string) => {
        props.onMenuClick(menu);
    };


    const handleGeniePro=()=>{
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

    const items: MenuProps['items'] = [
      {
        key: '1',
        onClick: handleGeniePro,
        label: (
          <a>
            Cruise Pro
          </a>
        )},
        {
        key: '2',
        onClick: doLoginOut,
        label: (
          <a>
            登出
          </a>
        )
      }]
    

    const renderLogin=()=>{
        if(isLoggedIn){
          var avatarUrl = localStorage.getItem('avatarUrl');
          if(avatarUrl){
            return (<a>
              <Dropdown menu={{ items }} trigger={['click']}>
                <Avatar size={40} src={avatarUrl} />
              </Dropdown>
              </a>);
          }else{
            return (<a>
              <Dropdown menu={{ items }} trigger={['click']}>
                <Avatar size={40} >Me</Avatar>
              </Dropdown>
              </a>);
          }
        }
        const accessTokenOrigin = document.cookie.split('; ').find(row => row.startsWith('accessToken='));
        if(accessTokenOrigin){
          const accessTokenCookie = accessTokenOrigin.split("=")[1];
          const refreshTokenCookie = document.cookie.split('; ').find(row => row.startsWith('refreshToken='))?.split("=")[1];
          const avatarUrlCookie = document.cookie.split('; ').find(row => row.startsWith('avatarUrl='))?.split("=")[1];
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('aiAccessToken', accessTokenCookie);
          localStorage.setItem('aiRefreshToken', refreshTokenCookie?refreshTokenCookie:"");
          localStorage.setItem('avatarUrl',avatarUrlCookie?avatarUrlCookie:"");
        }
        return (<Button name='aiLoginBtn' onClick={userLogin}>登录</Button>);
      }

    return(<header>
        <div>
            <nav>
                <a onClick={()=>handleMenuClick('chat')}>聊天</a>
                <a onClick={()=>handleMenuClick('account')}>订阅</a>
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
  
