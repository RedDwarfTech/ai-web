import { useSelector } from "react-redux";
import "./Goods.css"
import { doClearAlipayFormText, doPay } from "@/service/pay/PayService";
import { ProductReq } from "rdjs-wheel/dist/src/model/product/ProductReq";
import { readConfig } from "@/config/app/config-reader";
import { doGetIapProduct } from "@/service/goods/GoodsService";
import { useState } from "react";
import BaseMethods from "rdjs-wheel/dist/src/utils/data/BaseMethods";
import { IapProduct } from "@/models/product/IapProduct";
import { Divider, message } from "antd";
import React from "react";
import { v4 as uuid } from 'uuid';
import withConnect from "@/page/component/hoc/withConnect";
import { OrderService, Pay, UserService } from "rd-component";
import store from "@/store/store";
import { RequestHandler, ResponseHandler } from "rdjs-wheel";
import 'rd-component/dist/style.css';

const Goods: React.FC = () => {

  const { iapproducts } = useSelector((state: any) => state.iapproducts);
  const { createdOrder } = useSelector((state: any) => state.rdRootReducer.pay);
  const [createdOrderInfo, setCreatedOrderInfo] = useState<{ formText: string, orderId: string }>();
  const [payFrame, setPayFrame] = useState('');
  const [products, setProducts] = useState<IapProduct[]>([]);
  const [currentProduct, setCurrentProduct] = useState<IapProduct>();

  React.useEffect(() => {
    getGoods();
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  React.useEffect(() => {
    if (iapproducts && iapproducts.length > 0) {
      setProducts(iapproducts);
    }
  }, [iapproducts]);

  React.useEffect(() => {
    if (createdOrder && Object.keys(createdOrder).length > 0) {
      setCreatedOrderInfo(createdOrder);
      setPayFrame(createdOrder.formText);
    }
    return () => {
      doClearAlipayFormText();
    }
  }, [createdOrder]);

  const handleOutsideClick = (e: any) => {
    const modal = document.getElementById('pay-popup');
    if (modal && !modal.contains(e.target)) {
      setPayFrame('');
    }
  };

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
    setCurrentProduct(row);
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
          <div key={uuid()} className="package">
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

  const payComplete = () => {
    if (!createdOrderInfo || !createdOrderInfo.orderId) {
      message.error("未找到订单信息");
      return;
    }
    const orderId = createdOrderInfo.orderId;
    OrderService.getOrderStatus(orderId, store).then((resp: any) => {
      if (ResponseHandler.responseSuccess(resp)) {
        if (Number(resp.result.orderStatus) === 1) {
          setPayFrame('');
          setCreatedOrderInfo(undefined);
          UserService.getCurrentUser(store).then((data: any) => {
            if (ResponseHandler.responseSuccess(data)) {
              localStorage.setItem("userInfo", JSON.stringify(data.result));
              RequestHandler.handleWebAccessTokenExpire();
            }
          });
        } else {
          message.warning("检测到订单当前未支付，请稍后再次确认");
        }
      } else {
        message.warning("订单检测失败");
      }
    });
  }

  return (
    <div>
      <div className="product-container">
        {productSubMenu(products)}
      </div>
      <Divider></Divider>
      <Pay payFormText={payFrame} price={currentProduct?.price!} payProvider={"支付宝"} onPayComplete={payComplete}></Pay>
    </div>
  );
}

export default withConnect(Goods);