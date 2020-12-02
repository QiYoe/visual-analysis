const path = require("path");
const resolve = dir => path.join(__dirname, dir);
const webpack = require("webpack");
const DllReferencePlugin = require('webpack/lib/DllReferencePlugin');
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const AddAssetHtmlPlugin = require("add-asset-html-webpack-plugin");

const port = process.env.port || process.env.npm_config_port || 1314 // dev port


module.exports = {
  // 'admin': {
  //   template: 'public/index.html',
  //   filename: 'admin.html',
  //   title: '后台管理',
  //   },
  // 'mobile': {
  //   template: 'public/index.html',
  //   filename: 'mobile.html',
  //   title: '移动端',
  // },
  // 'pc/crm': {
  //   template: 'public/index.html',
  //   filename: 'pc-crm.html',
  //   title: '预发服务',
  // },
  // 默认情况下，Vue CLI 会假设你的应用是被部署在一个域名的根路径上，例如 https://www.my-app.com/。如果应用被部署在一个子路径上，你就需要用这个选项指定这个子路径。例如，如果你的应用被部署在 https://www.my-app.com/my-app/，则设置 publicPath 为 /my-app/。
  publicPath: '/',
  // 当运行 vue-cli-service build 时生成的生产环境构建文件的目录
  outputDir: 'dist',
  //放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录，默认为""
  assetsDir: "static",
  //指定生成的 index.html 的输出路径 (相对于 outputDir)
  // indexPath: "",
  // eslint-loader 是否在保存的时候检查
  lintOnSave: true,
  // webpack配置
  // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  //如果这个值是一个对象，则会通过 [webpack-merge](https://github.com/survivejs/webpack-merge) 合并到最终的配置中。
  //如果这个值是一个函数，则会接收被解析的配置作为参数。该函数及可以修改配置并不返回任何东西，也可以返回一个被克隆或合并过的配置版本。
  configureWebpack: config => { 
    //生产模式启用gzip压缩
    if (process.env.NODE_ENV === "prod") {
      const plugins = []
      // start 生成 gzip 压缩文件
      plugins.push([
        new CompressionWebpackPlugin({
          test: /\.js$|\.css$|\.html$/i,    //包括所有通过测试断言的资产
          threshold: 10240,
          exclude: /.map$/,    //排除所有符合这些条件的资产
          algorithm: "gzip",    //压缩算法/函数
          compressionOptions: { level: 1 },  //只处理大于此大小的资产。以字节为单位
          minRatio: 0.8,    //只处理压缩性能优于此比率的资产(minRatio = Compressed Size/Original Size)。例如: 你有一个1024b 大小的 image.png 文件，压缩版本的文件有768b 大小，所以 minRatio 等于0.75。换句话说，当压缩尺寸/原始尺寸值减去 minRatio 值时，资产将被处理。
          filename: "[path][base].gz",    //目标资产文件名
          deleteOriginalAssets: true,   //是否删除原始资产
          // deleteOriginalAssets: 'keep-source-map',    //从压缩中排除源代码
        }),
        new CompressionWebpackPlugin({
          filename: "[path][base].br",
          algorithm: "brotliCompress",
          test: /\.(js|css|html|svg)$/,
          // compressionOptions: {
          //   params: {
          //     [zlib.constants.BROTLI_PARAM_QUALITY]: https://github.com/webpack-contrib/compression-webpack-plugin/blob/master/11,
          //   },
          // },
          threshold: 10240,
          minRatio: 0.8,
        }),
        // 提高构建速度
        new DllReferencePlugin({
          context: process.cwd(),
          manifest: require("./public/vendor/vendor-manifest.json")
        }),
        // 将 dll 注入到 生成的 html 模板中
        new AddAssetHtmlPlugin({
          // dll文件位置
          filepath: path.resolve(__dirname, "./public/vendor/*.js"),
          // dll 引用路径
          publicPath: `${process.env.BASE_URL}static/js/vendor`,
          // dll最终输出的目录
          outputPath: "static/js/vendor"
        }),
      ]);

      // End 生成 gzip 压缩文件
      config.plugins = [...config.plugins, ...plugins];
      
      // 配置 externals 引入 cdn 资源
      config.externals = {
        vue: "Vue",
        "element-ui": "ELEMENT",
        "vue-router": "VueRouter",
        vuex: "vuex",
        axios: "axios",
        echarts: 'echarts'
      };
    }  
  },
  //是一个函数，会接收一个基于 [webpack-chain](https://github.com/mozilla-neutrino/webpack-chain) 的 `ChainableConfig` 实例。允许对内部的 webpack 配置进行更细粒度的修改。
  chainWebpack: config => { 
    // 修复HMR(热更新)失效
    config.resolve.symlinks(true);

    // 添加别名
    config.resolve.alias
      .set("@", resolve("src"))
      .set("@assets", resolve("src/assets"))
      .set("@components", resolve("src/components"))
      .set("@router", resolve("src/router"))
      .set("@views", resolve("src/views"));
    
    // 打包分析
    if (process.env.IS_ANALYZ) {
      config.plugin("webpack-report").use(BundleAnalyzerPlugin, [
        {
          //  可以是`server`，`static`或`disabled`。
          //  在`server`模式下，分析器将启动HTTP服务器来显示软件包报告。
          //  在“静态”模式下，会生成带有报告的单个HTML文件。
          //  在`disabled`模式下，你可以使用这个插件来将`generateStatsFile`设置为`true`来生成Webpack Stats JSON文件。
          analyzerMode: "static"
        }
      ]);
    }

    const cdn = {
      // 访问https://unpkg.com/element-ui/lib/theme-chalk/index.css获取最新版本
      css: ["//unpkg.com/element-ui@2.14.1/lib/theme-chalk/index.css"],
      js: [
        "//unpkg.com/vue@3.0.3/dist/vue.global.prod.js", // 访问https://unpkg.com/vue/dist/vue.min.js获取最新版本
        "//unpkg.com/vue-router@3.4.9/dist/vue-router.js",
        "//unpkg.com/vuex@3.6.0/dist/vuex.js",
        "//unpkg.com/axios@0.21.0/dist/axios.min.js",
        "//unpkg.com/element-ui@2.14.1/lib/index.js",
        "//cdn.bootcdn.net/ajax/libs/echarts/4.8.0/echarts.min.js"
      ]
    }
    // 如果使用多页面打包，使用vue inspect --plugins查看html是否在结果数组中
    config.plugin("html").tap(args => {
      // html中添加cdn
      args[0].cdn = cdn;
      return args;
    });
  },
  // 生产环境是否生成 sourceMap 文件
  productionSourceMap: false,
  // 是否为 Babel 或 TypeScript 使用 thread-loader。该选项在系统的 CPU 有多于一个内核时自动启用，仅作用于生产构建。
  parallel: require('os').cpus().length > 1,
  // PWA 插件相关配置
  // see https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
  pwa: {},
  /* webpack-dev-server 相关配置 */
  devServer: {
    /* 自动打开浏览器 */
    open: true,
    /* 设置为0.0.0.0则所有的地址均能访问 */
    host: '0.0.0.0',
    port: port,
    https: false,
    hotOnly: false,
    /* 使用代理 */
    // proxy: {
    //   '/api': {
    //     /* 目标代理服务器地址 */
    //     target: 'http://47.100.47.3/',
    //     /* 允许跨域 */
    //     changeOrigin: true,
    //     secure: false,
    //     // ws: true, // 是否启用websockets
    //     pathRewrite: {
    //       "^/api": "/"
    //     }
    //   },
    // },
  },
  // 第三方插件配置
  pluginOptions: {

  },
}