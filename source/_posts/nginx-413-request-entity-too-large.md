---
title: nginx_413_request_entity_too_large
date: 2021-05-19 13:40:07
tags: ["nginx"]
---

最近客户反映新闻内容上传图片有的时候会出现失败的情况，一开始判断是图片太大导致超时出现的问题，仔细查看发现上传文件的请求出现了 `413 request entity too large` 的错误，而且这个错误是 nginx 返回的。

![image-20210519134645333](https://static.aalmix.com/20210519145507.png)

![微信截图_20210519112536](https://static.aalmix.com/20210519145510.png)

查找资料发现 nginx 默认请求的大小只有 1M，后来在 nginx.conf 配置文件中改成 100M 就解决了这个问题。

```
# nginx.conf 
http {
    client_max_body_size 100M;
    ... 
}
```



参考：http://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size