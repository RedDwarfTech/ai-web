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
          name: 'Genie会员1月',
          age: "9.9/月",
          address: '--',
        },
        {
          key: '5',
          name: '支付测试/补差价',
          age: '0.01/月',
          address: '10',
        },
      ];
      
      const columns = [
        {
          title: '名称',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '单价',
          dataIndex: 'age',
          key: 'age',
        },
        {
          title: '库存',
          dataIndex: 'address',
          key: 'address',
        },
        {
          title: '操作',
          dataIndex: 'address',
          key: 'address',
          render: (record:any) => {
            return (<div><Button onClick={()=>handlePay(record)} type="primary">购买</Button></div>);
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
  
