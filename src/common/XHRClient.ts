import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { v4 as uuid } from 'uuid';
import store from '../store/store';
import { ResponseCode, ResponseHandler, WheelGlobal } from 'js-wheel';

let isRefreshing = false
let pendingRequestsQueue: Array<any> = [];

const instance = axios.create({
  timeout: 60000
})

instance.defaults.headers.post['Content-Type'] = 'application/json'

instance.interceptors.request.use((request) => {
  const accessToken = localStorage.getItem(WheelGlobal.ACCESS_TOKEN_NAME);
  accessToken && (request.headers['x-access-token'] = accessToken);
  request.headers['x-request-id'] = uuid();
  return request
},
  (error: any) => {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use((response: AxiosResponse<any, any>) => {
  const originalRequest: InternalAxiosRequestConfig<any> = response.config;
  if (isRefreshing) {
    pendingRequestsQueue.push(originalRequest);
  }
  if (!isRefreshing) {
    if (response.data.resultCode === ResponseCode.ACCESS_TOKEN_EXPIRED) {
      pendingRequestsQueue.push(originalRequest);
      isRefreshing = true;
      // refresh the access token
      ResponseHandler.handleWebCommonFailure(response.data)
        .then((data: any) => {
          isRefreshing = false;
          pendingRequestsQueue.forEach((request) => {
            const accessToken = localStorage.getItem(WheelGlobal.ACCESS_TOKEN_NAME);
            request.headers['x-access-token'] = accessToken;
            request.headers['x-request-id'] = uuid();
            instance(request).then((resp:any) => {
              // get the action of original request
              const action = request.action;
              const data = resp.data.result;
              // change the state to make it render the UI
              store.dispatch(action(data));
            });
          });
          pendingRequestsQueue = [];
        });
    }
  }
  return response;
},
  (error: any) => { return Promise.reject(error) }
)

export function requestWithAction(config: any, action: (arg0: any) => any) {
  return instance(config).then(
    (response: { data: { result: any; }; }) => {
      const data = response.data.result;
      store.dispatch(action(data));
      return response.data;
    }
  ).catch(
    (error: any) => {
      console.error(error);
    }
  );
}