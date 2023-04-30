import { useSelector } from "react-redux";
import "./Goods.css"
import { doClearAlipayFormText, doPay } from "@/service/pay/PayService";
import Pay from "@/page/pay/Pay";
import { ProductReq } from "js-wheel/dist/src/model/product/ProductReq";
import { readConfig } from "@/config/app/config-reader";
import { doGetIapProduct } from "@/service/goods/GoodsService";
import { useState } from "react";
import BaseMethods from "js-wheel/dist/src/utils/data/BaseMethods";
import { IapProduct } from "@/models/product/IapProduct";
import { Divider } from "antd";
import React from "react";
import { v4 as uuid } from 'uuid';
import withConnect from "@/page/component/hoc/withConnect";

const Goods: React.FC = () => {

  const { iapproducts } = useSelector((state: any) => state.iapproducts);
  const { formText } = useSelector((state: any) => state.rdRootReducer.pay);
  const [payFrame, setPayFrame] = useState('');
  const [products, setProducts] = useState<IapProduct[]>([]);

  React.useEffect(() => {
    getGoods();
  }, []);

  React.useEffect(() => {
    if(iapproducts && iapproducts.length > 0) {
      setProducts(iapproducts);
    }
  }, [iapproducts]);

  React.useEffect(() => {
    if(formText && formText.length > 0) {
      setPayFrame(formText);
    }
    return () => {
      doClearAlipayFormText(); 
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
        {productSubMenu(products)}
      </div>
      <Divider></Divider>
      <Pay payFormText={payFrame}></Pay>
    </div>
  );
}

export default withConnect(Goods);