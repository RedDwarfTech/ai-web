import Footer from "../component/footer/Footer";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import GenieHeader from "../component/header/GenieHeader";
import Chat from "./chat/Chat";
import Goods from "./goods/Goods";
import About from "../about/About";
import Profile from "../user/profile/Profile";
import { IUserModel } from "js-wheel";

const Home: React.FC = (props) => {

  const [currentPage, setCurrentPage] = useState("chat");
  const [userInfo, setUserInfo] = useState<IUserModel>();

  useEffect(() =>{
    if(currentPage === 'profile'){
      debugger
      if(!userInfo){
        const storeUser = localStorage.getItem("userInfo");
        if(storeUser){
          setUserInfo(JSON.parse(storeUser));
        }
      }
    }
  });

  const renderChat=()=>{
    return (<Chat></Chat>);
  }

  const renderAbout=()=>{
    return(
          
          <About></About>
      
      );
  }

  const renderAccountBuy=()=>{
      return(
        <div>    
            <Goods></Goods>
        </div>
        );
  }

  const renderBody=(menu: string)=>{
    if(menu === "chat"){
      return renderChat();
    }
    if(menu === "account"){
      return renderAccountBuy();
    }
    if(menu === "about"){
      return renderAbout();
    }
    if(menu === "profile"){
      return (<Profile panelUserInfo={userInfo}></Profile>);
    }
    return (<div></div>);
  }

    return(<div>
      <GenieHeader onMenuClick = { (value) =>{
        setCurrentPage(value.toString());
      }}/>
      <div className="content">
        {renderBody(currentPage)}
      </div>
      <Footer></Footer>
    </div>);

}

const mapStateToProps = (state: any) => ({
    robot: state.robot
  });
  
  const mapDispatchToProps = (dispatch: any) => {
    return {
      
    };
  };
  
  export default connect(mapStateToProps, mapDispatchToProps)(Home);
  
