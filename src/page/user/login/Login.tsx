import React from "react";
import styles from "./Login.module.css";

const Login: React.FC = () => {

    React.useEffect(() => {
           
    }, []);

    const openCity = (evt: any, cityName: any): void => {
      let i: number;
      const tabcontent = document.querySelectorAll(`.${styles.tabcontent}`);
      debugger
      for (i = 0; i < tabcontent.length; i++) {
        debugger
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
          <button className={styles.tablinks} onClick={(e)=>{openCity(e,"London")}}>London</button>
          <button className={styles.tablinks} onClick={(e)=>{openCity(e,"Paris")}}>Paris</button>
          <button className={styles.tablinks} onClick={(e)=>{openCity(e,"Tokyo")}}>Tokyo</button>
        </div>
        <div id="London" className={styles.tabcontent}>
          <h3>London</h3>
          <p>London is the capital city of England.</p>
        </div>

        <div id="Paris" className={styles.tabcontent}>
          <h3>Paris</h3>
          <p>Paris is the capital of France.</p>
        </div>

        <div id="Tokyo" className={styles.tabcontent}>
          <h3>Tokyo</h3>
          <p>Tokyo is the capital of Japan.</p>
        </div>
      </div>
    </div>
  );
}

export default Login;