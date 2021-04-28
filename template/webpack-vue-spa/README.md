# Template Multi

### 简介

vue2+webpack4前端项目，支持多端、多语言

### 安装依赖

```
npm install
```

### development 模式启动

```
npm run dev

```

### production 单页模式构建

```
npm run build-test
npm run build-prod

```
### production 预渲染静态页面
```
npm run generate

```

### 目录结构

```
├─dist(部署目录)
    ├──js
    ├──css
    ├──img
    ├──fonts
    └──index.html
├─build // 打包配置文件
├─public // index.html模板
├─src
    ├──api // ajax请求方法
    ├──assets // 资源文件，图片、字体、图标等
    ├──config // 全局配置
    ├──lang // 多语言
    ├──router // 路由
    ├──store // 全局状态
    ├──utills // 工具函数
    ├──views-desktop // PC端视图目录
    ├──views-mobile // 移动端端视图目录
        ├──components // 公共组件
        ├──styles // 公共样式
        └──pages // 页面目录
├─.gitignore
├─package.json
└─README.md

```

### 部署

nginx 配置

```nginx
server {
    listen       80;
    server_name  local.yodafone.cn;

    set $web_root "D:\xingding\dist";
    set $device "PC";
    set $entry index.html;

    if ( $http_user_agent ~* (spider|crawl|slurp|bot) ) {
        set $web_root "D:\xingding\dist-seo";
    }

    if ( $http_user_agent ~* "Mobile" ) {
        set $device "Mobile";
    }

    if ( $device = "PC" ) {
        #rewrite ^/(.*) http://nihaomobile.cn last;
        #break;
        set $entry index-pc.html;
    }

    location / {
        root $web_root;
        index $entry;
        try_files $uri $uri/ /$entry;
    }

    location /en {
        root $web_root;
        index $entry;
        try_files $uri $uri/ /$entry;
    }

    location /cn {
        root $web_root;
        index $entry;
        try_files $uri $uri/ /$entry;
    }

    location /api/ {
        proxy_pass http://llj-rj_back.yodafone.cn/;
    }

    location /en/api/ {
        proxy_pass http://llj-rj_back.yodafone.cn/;
    }

    location /cn/api/ {
        proxy_pass http://llj-rj_back.yodafone.cn/;
    }
}
```
