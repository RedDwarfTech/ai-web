import { Button, Table } from "antd";
import { connect } from "react-redux";
import "./Goods.css"
import { doPay } from "../../../service/pay/PayService";
import Pay from "../../pay/Pay";
import { createOrder } from "../../../action/pay/PayAction";

const Goods: React.FC = (props:any) => {

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
      
    let generateFormText = props.formText;
      debugger
    return(
        <div>
             <Table dataSource={dataSource} columns={columns} />
             <Pay payFormText={generateFormText}></Pay>
        </div>
    );
}

  const mapStateToProps = (state: any) => ({
    pay: state.pay
  });
  
  const mapDispatchToProps = (dispatch: any) => {
    return {
      createOrder: (pay: any) => {
        dispatch(createOrder(pay))
      }
    };
  };
  
  export default connect(mapStateToProps, mapDispatchToProps)(Goods);
  
