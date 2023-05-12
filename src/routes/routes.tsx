import { createBrowserRouter, useLocation } from 'react-router-dom';
import App from '../page/index/Home';
import Login from '../page/user/login/Login';
import { SubPaySuccess } from 'rd-component';

const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },
  {
    path: "/product/pay/success",
    element: <SubPaySuccess location={useLocation()}/>
  },
  {
    path: "/user/login",
    element: <Login />
  }
]);

export default routes;