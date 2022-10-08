const autoprefixer = require('autoprefixer');
const pxtorem = require('postcss-pxtorem');
module.exports = {
  publicPath: './',
  assetsDir: 'static',

  productionSourceMap:false,
  // chainWebpack: config => {
  //   config.plugin("define").tap(args => {
  //     args[0]["process.env"].BASE_URL = JSON.stringify(process.env.BASE_URL);
  //     return args;
  //   });
    
  // },
  configureWebpack: config => { //打包后去除console
        if (process.env.NODE_ENV === "production") {
         config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true;
        }
        },
        
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
            red: '#FE6C3E',
            blue: '#666',
            green:'#30AEFB',
          // orange: '#f08d49',
          // 'text-color': '#111',
          // 'tabbar-item-active-color':'#E3B66F',
        }
      }
    }
  },
  // devServer:{
  //   host:'192.168.10.58',
  //   port:8888,
  //   proxy:{
  //     '/v1.0':{
  //       target:'http://192.168.10.32',
  //       ws:true,
  //       changeOrigin:true
  //     }
  //   }
  // }
 
}