import axios from 'axios';
import { v4 as uuid } from 'uuid';
import store from '../store/store';
import { ResponseHandler } from 'js-wheel';

const instance = axios.create({
  timeout: 15000
})

instance.defaults.headers.post['Content-Type'] = 'application/json'

instance.interceptors.request.use((request) => {
      const accessToken = localStorage.getItem('aiAccessToken');
      accessToken && (request.headers['x-access-token'] = accessToken);
      request.headers['x-request-id'] = uuid();
      return request
  },
    (  error: any) => {return Promise.reject(error)
  }
)

let isRefreshing = false
instance.interceptors.response.use((response) => {
  if(!isRefreshing) {
    ResponseHandler.handleCommonFailure(response);
  }
  return response;
},
(  error: any) => {return Promise.reject(error)}
)

export function requestWithAction(config: any, action: (arg0: any) => any) {
  return instance(config).then(
      (    response: { data: { result: any; }; }) => {
      const data = response.data.result;
      store.dispatch(action(data));
      return response.data;
    }
  ).catch(
      (    error: any) => {
      console.error(error);
    }
  );
}