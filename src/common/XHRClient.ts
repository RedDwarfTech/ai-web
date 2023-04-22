import axios from 'axios';
import { v4 as uuid } from 'uuid';
import store from '../store/store';
import { ResponseCode, ResponseHandler, WheelGlobal } from 'js-wheel';

let isRefreshing = false
let subscribers: ((token: string) => void)[] = [];
let pendingRequestsQueue: Array<any> = [];

const subscribeTokenRefresh = (cb: (token: string) => void) => {
  subscribers.push(cb);
};

const onTokenRefreshed = (token: string) => {
  subscribers.forEach((cb) => cb(token));
};

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

function addRequestToQueue(originalRequest: any){
  return new Promise((resolve, reject) => {
    pendingRequestsQueue.push({ resolve, reject });
  })
    .then((data:any) => {
      originalRequest.headers['x-access-token'] = data.accessToken;
      originalRequest.headers['x-request-id'] = uuid();
      return instance(originalRequest);
    })
    .catch((err) => {
      return Promise.reject(err);
    });
}

instance.interceptors.response.use((response) => {
  const originalRequest = response.config;
  if(isRefreshing){
    addRequestToQueue(originalRequest);
  }
  if (!isRefreshing) {
    if(response.data.resultCode === ResponseCode.ACCESS_TOKEN_EXPIRED){
      addRequestToQueue(originalRequest);
      isRefreshing = true;
      ResponseHandler.handleWebCommonFailure(response.data)
      .then((data:any) => {
        isRefreshing = false;
        pendingRequestsQueue.forEach((request) => {
          request.resolve(data);
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