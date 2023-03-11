import React from "react";
import { connect } from "react-redux";
import "./GenieHeader.css"

export type HeaderFormProps = {
    onMenuClick: (menu: String) => void;
};

const GenieHeader: React.FC<HeaderFormProps> = (props) => {

    const handleMenuClick = (menu:string) => {
        props.onMenuClick(menu);
    };

    return(<header>
        <div>
            <nav>
                <a onClick={()=>handleMenuClick
                ('chat')}>聊天</a>
                <a href="#">账号购买</a>
                <a href="#">关于</a>
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
  
