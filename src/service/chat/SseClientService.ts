import { ChatAsk } from '@/models/request/chat/ChatAsk';
import { EventSourcePolyfill } from 'event-source-polyfill';
import { AuthHandler, RequestHandler } from 'rdjs-wheel';
import { v4 as uuid } from 'uuid';

export function doAskPreCheck(params: ChatAsk, onSseMessage: (msg: string, eventSource: EventSource) => void) {
  if (AuthHandler.isTokenNeedRefresh(60)) {
    RequestHandler.handleWebAccessTokenExpire()
      .then((data) => {
        doSseChatAsk(params, onSseMessage);
      });
  } else {
    doSseChatAsk(params, onSseMessage);
  }
}

export function doSseChatAsk(params: ChatAsk, onSseMessage: (msg: string, eventSource: EventSource) => void) {
  let eventSource: EventSource;
  const accessToken = localStorage.getItem("x-access-token");
  var queryString = Object.keys(params).map(key => key + '=' + params[key as keyof ChatAsk]).join('&');
  // https://stackoverflow.com/questions/6623232/eventsource-and-basic-http-authentication
  var queryString = Object.keys(params).map(key => key + '=' + params[key as keyof ChatAsk]).join('&');
  eventSource = new EventSource('/ai/azure/stream/chat/ask?' + queryString);
  eventSource.onopen = () => {

  }
  eventSource.onerror = (error: any) => {
    console.log("onerror", error);
    eventSource.close();
  }
  eventSource.onmessage = e => {
    onSseMessage(e.data, eventSource);
  };
}
