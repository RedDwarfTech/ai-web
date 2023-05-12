import { createBrowserRouter } from 'react-router-dom';
import App from '../page/index/Home';
import Login from '../page/user/login/Login';
import { PaySuccess } from 'rd-component';
import store from '@/store/store';

const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },
  {
    path: "/product/pay/success",
    element: <PaySuccess refreshUser={true} store={store} />
  },
  {
    path: "/user/login",
    element: <Login />
  }
]);

export default routes;