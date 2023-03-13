import { Button, Input, Table } from "antd";
import React, { useState } from "react";
import { connect } from "react-redux";
import "./Goods.css"
import dayjs from 'dayjs';
import { doPay } from "../../../service/pay/PayService";

const Chat: React.FC = (props) => {

    const dataSource = [
        {
          key: '4',
          name: 'ChatGPT/OpenAi独享成品账号',
          age: 30,
          address: '1',
        },
        {
          key: '5',
          name: '支付测试/补差价',
          age: 0.01,
          address: '10',
        },
      ];
      
      const columns = [
        {
          title: '商品名称',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '商品单价',
          dataIndex: 'age',
          key: 'age',
        },
        {
          title: '商品库存',
          dataIndex: 'address',
          key: 'address',
        },
        {
          title: '操作',
          dataIndex: 'address',
          key: 'address',
          render: (record:any) => {
            return (<div><Button onClick={()=>handlePay(record)} type="primary" style={{marginTop:20}}>购买</Button></div>);
          }
        },
      ];

      const handlePay = (row:any) => {
        alert("d");
        doPay(row.id);
      };
      
    return(
        <div>
             <Table dataSource={dataSource} columns={columns} />
        </div>
    );
}

const mapStateToProps = (state: any) => ({
    robot: state.robot
  });
  
  const mapDispatchToProps = (dispatch: any) => {
    return {
      
    };
  };
  
  export default connect(mapStateToProps, mapDispatchToProps)(Chat);
  
