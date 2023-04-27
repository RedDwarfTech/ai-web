import React from "react";
import "./Pay.css"
import withConnect from "@/page/component/hoc/withConnect";

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

export default withConnect(Pay);
