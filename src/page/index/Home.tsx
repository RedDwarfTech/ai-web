import { Button, Card, Col, Row } from "antd";
import Footer from "../component/footer/Footer";
import React from "react";
import { connect } from "react-redux";
import GenieHeader from "../component/header/GenieHeader";
import Chat from "./chat/Chat";


const Home: React.FC = (props) => {


  const handleMenuClick = (menu:string) => {
    renderBody(menu);
  };

  const renderChat=()=>{
    return (<Chat></Chat>);
  }

  const renderAccountBuy=()=>{
      return(<Row>
          <Col>
          <Card style={{ width: 200 }}>
            <p>ChatGPT账号</p>
            <p><Button type="primary" style={{
                marginTop:20
              }}>购买</Button></p>
          </Card>
          </Col>
        </Row>);
  }

  const renderBody=(menu: string)=>{
    if(menu === "chat"){
      return renderChat();
    }
    if(menu === "account"){
      return renderAccountBuy();
    }
    return (<div></div>);
  }


    return(<div>
      <GenieHeader onMenuClick = { (value) =>{
        debugger
        // handleMenuClick(value);
      }}/>
      <div className="content">
        {renderBody("chat")}
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
  
