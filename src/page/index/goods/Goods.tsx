import { connect, useSelector } from "react-redux";
import "./Goods.css"
import { doPay } from "@/service/pay/PayService";
import Pay from "../../pay/Pay";
import { createOrder } from "@/action/pay/PayAction";
import { ProductReq } from "js-wheel/dist/src/model/product/ProductReq";
import { readConfig } from "@/config/app/config-reader";
import { doGetIapProduct } from "@/service/goods/GoodsService";
import { useState } from "react";
import { getIapProductsAction } from "@/action/iapproduct/IapProductAction";
import BaseMethods from "js-wheel/dist/src/utils/data/BaseMethods";
import { IapProduct } from "@/models/product/IapProduct";
import { Divider } from "antd";
import React from "react";
import { v4 as uuid } from 'uuid';

const Goods: React.FC = (props: any) => {

  const { formText } = useSelector((state: any) => state.pay);
  const [payFrame, setPayFrame] = useState('');

  React.useEffect(() => {
    getGoods();
  }, []);

  React.useEffect(() => {
    if(formText && formText.length > 0) {
      setPayFrame(formText);
    }
  }, [formText]);

  const getGoods = () => {
    const req: ProductReq = {
      appId: readConfig("appId")
    };
    doGetIapProduct(req);
  }

  const handlePay = (row: any) => {
    let param = {
      productId: Number(row.id)
    };
    doPay(param);
  };

  let serverDataSource = [];
  if (BaseMethods.isNull(props.iapproducts.iapproducts)) {

  } else {
    serverDataSource = props.iapproducts.iapproducts;
  }

  const productSubMenu = (serverDataSource: IapProduct[]) => {
    if (BaseMethods.isNull(serverDataSource)) {
      return (<div></div>);
    }
    const productSubList: JSX.Element[] = [];
    serverDataSource.sort((a: IapProduct, b: IapProduct) => b.sort - a.sort)
      .forEach((item: IapProduct) => {
        productSubList.push(
        <div key= {uuid()} className="package">
          <h2>{item.productTitle}</h2>
          <p className="price">{item.price}<span>元</span></p>
          <ul>
            {vipItems(item.description)}
          </ul>
          <button onClick={() => handlePay(item)}>立即订阅</button>
        </div>);
      });
    return productSubList;
  }

  const vipItems = (items: string) => {
    const parsedItmes = JSON.parse(items);
    if (parsedItmes) {
      const itemList: JSX.Element[] = [];
      parsedItmes.forEach((item: string) => {
        itemList.push(<li key={uuid()}>{item}</li>);
      });
      return itemList;
    }
  }

  return (
    <div>
      <div className="product-container">
        {productSubMenu(serverDataSource)}
      </div>
      <Divider></Divider>
      <Pay payFormText={payFrame}></Pay>
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

