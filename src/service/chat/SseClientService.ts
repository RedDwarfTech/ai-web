import { ChatAsk } from '@/models/request/chat/ChatAsk';
import { AuthHandler, RequestHandler } from 'rdjs-wheel';

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

/**
 * https://stackoverflow.com/questions/77015804/why-the-event-source-polyfill-did-not-fetch-the-sse-api-data
 * @param params 
 * @param onSseMessage 
 */
export function doSseChatAsk(params: ChatAsk, onSseMessage: (msg: string, eventSource: EventSource) => void) {
  let eventSource: EventSource;
  var queryString = Object.keys(params).map(key => key + '=' + params[key as keyof ChatAsk]).join('&');
  // https://stackoverflow.com/questions/6623232/eventsource-and-basic-http-authentication
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
  eventSource.addEventListener("chat", function (event: any) {
    onSseMessage(event.data, eventSource);
  });
}
