import { Route,Routes,BrowserRouter } from 'react-router-dom';
import App from '../page/index/Home';

const routes = (
    <BrowserRouter>        
        <Routes>
          <Route path="/" element={<App />}/>
        </Routes>
    </BrowserRouter>
);

export default routes;