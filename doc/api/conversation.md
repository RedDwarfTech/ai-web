
#### 获取conversation列表


```bash
curl 'http://localhost:11014/ai/conversation/page' \
  -H 'Accept: text/event-stream' \
  -H 'Accept-Language: en,zh-CN;q=0.9,zh;q=0.8,zh-TW;q=0.7,fr;q=0.6' \
  -H 'Connection: keep-alive' \
  -H 'DNT: 1' \
  -H 'Referer: https://ai.poemhub.top/' \
  -H 'Sec-Fetch-Dest: empty' \
  -H 'Sec-Fetch-Mode: cors' \
  -H 'Sec-Fetch-Site: same-origin' \
  -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36' \
  -H 'sec-ch-ua: "Google Chrome";v="111", "Not(A:Brand";v="8", "Chromium";v="111"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "macOS"' \
  -H 'sec-gpc: 1' \
  -H 'x-access-token: eyJhbGciOiJIUzUxMiJ9.eyJ1c2VySWQiOjc3LCJkZXZpY2VJZCI6IjAiLCJhcHBJZCI6InZPZ2hvbzEwTDkiLCJleHAiOjE2ODAwODk4NzJ9.zC28Fb1fRlE3lz1whyVNCXVQ2_tHmWMF0XKRorB60LfG5LFB_eehW5kgyNOsT8dwEKAAGl8B9etUHp_j3zvhuw' \
  -H 'x-request-id: e183a6f9-ea8a-40a3-b205-35de6e91d2b0' \
  --compressed | jq '.'
```



