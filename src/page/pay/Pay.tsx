import { Col, Row } from "antd";
import React from "react";
import "./Pay.css"
import { connect } from "react-redux";
import { createOrder } from "../../action/pay/PayAction";

export type PayProps = {
  payFormText: string;
};

const Pay: React.FC<PayProps> = (props) => {

  const formText = props.payFormText;

  return (
    <div>
      <iframe srcDoc={formText}
            width="600"
            height="600"
            frameBorder="no"
            scrolling="no"
          ></iframe>
    </div>
  );
}

const mapStateToProps = (state: { formText: any; }) => ({
  formText: state.formText
});

const mapDispatchToProps = (dispatch: any) => {
  return {
    createOrder: (formText: String) => {
      dispatch(createOrder(formText))
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Pay);
