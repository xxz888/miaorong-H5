# baselife

## 项目采用框架
```
框架搭建：vue cli3;
api请求：axios;
ui组建：Vant;
```
## 目录结构描述
``` bash
├── src
│   ├── api                     // 请求文件
│   ├── assets                  // 图片资源
│   ├── commone                 // 全局过滤函数
│   ├── component               // 公用vue组件
│   ├── config                  // 常用的配置文件
│   ├── router                  // 路由
│   ├── utils                   // 工具
│   │   └── request             // 公用校验方法
│   ├── views                   // 视图层
│   │   ├── planBill            // 订单查询
│   │   ├── card                // 银行卡管理
│   │   ├── plan                // 制定计划
│   │   └── zero                // 空卡管理
│   ├──store                    // vuex状态管理
│   │   └── index.js
│   │──config
│   │   └── index.js
│   │   
│   ├── App.vue
│   └── main.js
├── node_modules
└── Readme.md 
```

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

