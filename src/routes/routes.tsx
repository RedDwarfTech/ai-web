import { createBrowserRouter } from 'react-router-dom';
import App from '../page/index/Home';
import Login from '../page/user/login/Login';
import { PaySuccess } from 'rd-component';
import Reg from '@/page/user/reg/Reg';

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
  },
  {
    path: "/user/reg",
    element: <Reg />
  }
]);

export default routes;