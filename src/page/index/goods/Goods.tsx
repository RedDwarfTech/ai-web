import { Button, Table } from "antd";
import { connect } from "react-redux";
import "./Goods.css"
import { doPay } from "@/service/pay/PayService";
import Pay from "../../pay/Pay";
import { createOrder } from "@/action/pay/PayAction";
import { ProductReq } from "js-wheel/dist/src/model/product/ProductReq";
import { readConfig } from "@/config/app/config-reader";
import { doGetIapProduct } from "@/service/goods/GoodsService";
import { useEffect } from "react";
import { getIapProductsAction } from "@/action/iapproduct/IapProductAction";
import BaseMethods from "js-wheel/dist/src/utils/data/BaseMethods";

const Goods: React.FC = (props: any) => {

  useEffect(() => {
    getGoods();
  }, []);

  const getGoods = () => {
    const req: ProductReq = {
      appId: readConfig("appId")
    };
    doGetIapProduct(req);
  }

  const handlePay = (row: any) => {
    let param = {
      productId: row.productId
    };
    doPay(param);
  };

  let generateFormText = props.pay.formText;
  let serverDataSource = [];
  if (BaseMethods.isNull(props.iapproducts.iapproducts)) {

  } else {
    serverDataSource = props.iapproducts.iapproducts;
  }

  const productSubMenu = (serverDataSource: any) => {
    if (BaseMethods.isNull(serverDataSource)) {
      return (<div></div>);
    }
    const productSubList: JSX.Element[] = [];
    serverDataSource.forEach((item: any) => {
      productSubList.push(<div className="package">
        <h2>{item.productTitle}</h2>
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
        itemList.push(<li>{item}</li>);
      });
      return itemList;
    }
  }


  return (
    <div>
      <div className="product-container">
        {productSubMenu(serverDataSource)}
      </div>
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

