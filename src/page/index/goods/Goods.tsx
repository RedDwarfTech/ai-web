import { Button, Table } from "antd";
import { connect } from "react-redux";
import "./Goods.css"
import { doPay } from "../../../service/pay/PayService";
import Pay from "../../pay/Pay";
import { createOrder } from "../../../action/pay/PayAction";
import { ProductReq } from "js-wheel/dist/src/model/product/ProductReq";
import { readConfig } from "@/config/app/config-reader";
import { doGetIapProduct } from "@/service/goods/GoodsService";
import { useEffect } from "react";
import { getIapProductsAction } from "@/action/iapproduct/IapProductAction";
import BaseMethods from "js-wheel/dist/src/utils/data/BaseMethods";

const Goods: React.FC = (props: any) => {

  useEffect(() => {
    getGoods();
  },[]);

  const getGoods = () => {
    const req: ProductReq = {
      appId: readConfig("appId")
    };
    doGetIapProduct(req);
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',

    },
    {
      title: '名称',
      dataIndex: 'productTitle',
      key: 'productTitle',
    },
    {
      title: '单价',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: '操作',
      dataIndex: 'address',
      key: 'address',
      render: (text: string, record: any, index: number) => {
        return (<div><Button onClick={() => handlePay(record)} type="primary">购买</Button></div>);
      }
    },
  ];

  const handlePay = (row: any) => {
    let param = {
      productId: row.productId
    };
    doPay(param);
  };

  let generateFormText = props.pay.formText;
  let serverDataSource =[];
  if(BaseMethods.isNull(props.iapproducts.iapproducts)){
    
  }else{
    serverDataSource = props.iapproducts.iapproducts;
  }
  
  return (
    <div>
      <Table dataSource={serverDataSource} columns={columns} />
      <Pay payFormText={generateFormText}></Pay>
    </div>
  );
}

const mapStateToProps = (state: any) => ({
  pay: state.pay,
  iapproducts: state.iapproducts
});

const mapDispatchToProps = (dispatch: any) => {
  return {
    createOrder: (pay: any) => {
      dispatch(createOrder(pay))
    },
    getIapProducts: (iapproducts: any) => {
      dispatch(getIapProductsAction(iapproducts))
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Goods);

