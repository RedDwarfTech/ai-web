import { createBrowserRouter } from 'react-router-dom';
import App from '../page/index/Home';
import PaySuccess from '../page/pay/success/PaySuccess';
import Login from '../page/user/login/Login';

const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },
  {
    path: "/product/pay/success",
    element: <PaySuccess />
  },
  {
    path: "/user/login",
    element: <Login />
  }
]);

export default routes;