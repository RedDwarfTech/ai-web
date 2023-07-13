import React from "react";
import styles from "./Login.module.css";

const Login: React.FC = () => {

  React.useEffect(() => {

  }, []);

  const openCity = (evt: any, cityName: any): void => {
    let i: number;
    const tabcontent = document.querySelectorAll(`.${styles.tabcontent}`);
    for (i = 0; i < tabcontent.length; i++) {
      (tabcontent[i] as HTMLElement).style.display = "none";
    }
    const tablinks = document.querySelectorAll(`.${styles.tablinks}`);
    for (i = 0; i < tablinks.length; i++) {
      (tablinks[i] as HTMLElement).className = (tablinks[i] as HTMLElement).className.replace(" active", "");
    }
    const cityElement = document.getElementById(cityName);
    if (cityElement) {
      cityElement.style.display = "block";
    }
    (evt.currentTarget as HTMLElement).className += " active";
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginForm}>
        <div className={styles.loginTabs}>
          <button className={styles.tablinks} onClick={(e) => { openCity(e, "phone") }}>手机号登录</button>
          <button className={styles.tablinks} onClick={(e) => { openCity(e, "wechat") }}>微信扫码登录</button>
          <button className={styles.tablinks} onClick={(e) => { openCity(e, "alipay") }}>支付宝扫码登录</button>
        </div>
        <div id="phone" className={styles.tabcontent}>
          <h3>登录</h3>
          <form method="post" className={styles.loginElement}>
            <div className={styles.userName}>
              <select id="countryCode">
                <option value="+86">+86</option>
                <option value="+1">+1</option>
              </select>
              <input type="text" id="phone" placeholder="请输入手机号码"/>
            </div>
            <div className={styles.password}>
              <input type="password" placeholder="密码" name="p"></input> 
            </div>  
            <button className={styles.loginButton} type="submit">登录</button>  
          </form>
        </div>

        <div id="wechat" className={styles.tabcontent}>
          
        </div>

        <div id="alipay" className={styles.tabcontent}>
          
        </div>
      </div>
    </div>
  );
}

export default Login;