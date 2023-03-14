import { Button, Input, Table } from "antd";
import React, { useState } from "react";
import { connect } from "react-redux";
import "./Goods.css"
import dayjs from 'dayjs';
import { doPay } from "../../../service/pay/PayService";

const Chat: React.FC = (props) => {

    const dataSource = [
        {
          id: '4',
          name: 'Genie会员1月',
          age: "9.9/月",
          address: '--',
        },
        {
          id: '5',
          name: '支付测试/补差价',
          age: '0.01/月',
          address: '10',
        },
      ];
      
      const columns = [
        {
          title: 'ID',
          dataIndex: 'id',
          key: 'id',
          
        },
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
          render: (text:string,record:any,index:number) => {
            return (<div><Button onClick={()=>handlePay(record)} type="primary">购买</Button></div>);
          }
        },
      ];

      const handlePay = (row:any) => {
        let param = {
          productId: row.id
        };
        doPay(param);
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
  
