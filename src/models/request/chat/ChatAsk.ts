export type ChatAsk = {
    prompt: string;
    cid: number;
    /** 
     * eventsource did not support put JWT token into header
     * so put the JWT token in query parameter to do the authorize 
     *  
     * */
    access_token: string,
}