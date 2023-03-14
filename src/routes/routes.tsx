import { createBrowserRouter } from 'react-router-dom';
import App from '../page/index/Home';
import PaySuccess from '../page/pay/success/PaySuccess';

const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },
  {
    path: "/product/pay/success",
    element: <PaySuccess />
  }
]);

export default routes;