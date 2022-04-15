/*
 * This file runs in a Node context (it's NOT transpiled by Babel), so use only
 * the ES6 features that are supported by your Node version. https://node.green/
 */

// Configuration for your app
// https://quasar.dev/quasar-cli/quasar-conf-js
const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
/* eslint-env node */
const ESLintPlugin = require("eslint-webpack-plugin");
const { configure } = require("quasar/wrappers");

module.exports = configure(function (ctx) {
  return {
    // https://quasar.dev/quasar-cli/supporting-ts
    supportTS: false,

    // https://quasar.dev/quasar-cli/prefetch-feature
    // preFetch: true,

    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    // https://quasar.dev/quasar-cli/boot-files
    boot: ["i18n", "axios", 'prototypes', 'middleware', 'axios', 'moment', 'directive'],

    // https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-css
    css: ["app.scss"],

    // https://github.com/quasarframework/quasar/tree/dev/extras
    extras: [
      // 'ionicons-v4',
      // 'mdi-v5',
      // 'fontawesome-v5',
      // 'eva-icons',
      // 'themify',
      // 'line-awesome',
      // 'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!

      "roboto-font", // optional, you are not bound to it
      "material-icons", // optional, you are not bound to it
    ],

    // Full list of options: https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-build
    build: {
      vueRouterMode: "history", // available values: 'hash', 'history'

      // transpile: false,
      // publicPath: '/',

      // Add dependencies for transpiling with Babel (Array of string/regex)
      // (from node_modules, which are by default not transpiled).
      // Applies only if "transpile" is set to true.
      // transpileDependencies: [],

      // rtl: true, // https://quasar.dev/options/rtl-support
      // preloadChunks: true,
      // showProgress: false,
      // gzip: true,
      // analyze: true,

      // Options below are automatically set depending on the env, set them if you want to override
      // extractCSS: false,

      // https://quasar.dev/quasar-cli/handling-webpack
      // "chain" is a webpack-chain object https://github.com/neutrinojs/webpack-chain
      chainWebpack (chain) {
        chain
          .plugin("eslint-webpack-plugin")
          .use(ESLintPlugin, [{ extensions: ["js", "vue"] }]);
      },
      // https://quasar.dev/quasar-cli/cli-documentation/handling-webpack
      extendWebpack (cfg) {
        cfg.resolve.alias = {
          ...cfg.resolve.alias,
          // Add your own alias like this
          // 'vue$': 'vue/dist/vue.esm.js',
          '@': path.resolve('src')
          // 'Vue': 'vue/dist/vue.esm-bundler.js'
        }

        // cfg.plugins.push(new CopyPlugin([{ from: './statics/', to: '../' }]))
        cfg.plugins.push(new CopyPlugin({ patterns: [{ from: './statics/', to: '../' }] }))

        // for i18n resources (json/json5/yaml)
        cfg.module.rules.push({
          test: /\.(json5?|ya?ml)$/, // target json, json5, yaml and yml files
          type: 'javascript/auto',
          // Use `Rule.include` to specify the files of locale messages to be pre-compiled
          include: [path.resolve(__dirname, './src/i18n')],
          loader: '@intlify/vue-i18n-loader'
        })

        // for i18n custom block
        cfg.module.rules.push({
          resourceQuery: /blockType=i18n/,
          type: 'javascript/auto',
          loader: '@intlify/vue-i18n-loader'
        })
      },
      // environment
      env: ctx.dev
        ? { // so on dev we'll have
          APP_NAME: 'TM-Store', // JSON.stringify('TM-Store'),
          API: '/api',//'http://localhost:8080/api',//'/api', // JSON.stringify('http://localhost:8001/api'),
          API_UPLOAD: 'http://localhost:8080/uploads', // JSON.stringify('http://localhost:8001/uploads'),
          API_PUBLIC: 'http://localhost:8080/public', // JSON.stringify('http://localhost:8001/public'),
          API_FILE_UPLOAD: 'http://localhost:8080/api/file-manager' // JSON.stringify('http://localhost:8001/api/file-manager')
        }
        : { // and on build (production):
          APP_NAME: 'TM-Store', // JSON.stringify('TM-Store'),
          API: 'https://tm-store-api-opkgzsyymq-uc.a.run.app/api', // JSON.stringify('https://tm-store-express.herokuapp.com/api'),
          API_UPLOAD: 'https://tm-store-api-opkgzsyymq-uc.a.run.app/uploads', // JSON.stringify('https://tm-store-express.herokuapp.com/uploads'),
          API_PUBLIC: 'https://tm-store-api-opkgzsyymq-uc.a.run.app/public', // JSON.stringify('https://tm-store-express.herokuapp.com/public'),
          API_FILE_UPLOAD: 'https://tm-store-api-opkgzsyymq-uc.a.run.app/api/file-manager' // JSON.stringify('https://tm-store-express.herokuapp.com/api/file-manager')
        }
    },

    // Full list of options: https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-devServer
    devServer: {
      server: {
        type: "https",
      },
      port: 8100,
      open: false, // opens browser window automatically
      proxy: {
        '/api': {
          // target: 'https://tm-store-api-opkgzsyymq-uc.a.run.app',
          target: 'http://localhost:8080',
          // pathRewrite: { '^/api': '' },
          changeOrigin: true,
          secure: true
        }
      }
    },

    // https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-framework
    framework: {
      // iconSet: 'material-icons', // Quasar icon set
      // lang: 'en-US', // Quasar language pack

      // For special cases outside of where the auto-import strategy can have an impact
      // (like functional components as one of the examples),
      // you can manually specify Quasar components/directives to be available everywhere:
      //
      // components: [],
      // directives: [],

      // Quasar plugins
      plugins: ['Notify', 'AppFullscreen', 'Dialog'],
      config: {
        notify: {
          position: 'top',
          timeout: 5000,
          color: 'blue-grey',
          textColor: 'white',
          actions: [{ icon: 'close', color: 'white' }]
        }
      },
    },

    // animations: 'all', // --- includes all animations
    // https://quasar.dev/options/animations
    animations: [],

    // https://quasar.dev/quasar-cli/developing-ssr/configuring-ssr
    ssr: {
      pwa: false,

      // manualStoreHydration: true,
      // manualPostHydrationTrigger: true,

      prodPort: 3000, // The default port that the production server should use
      // (gets superseded if process.env.PORT is specified at runtime)

      maxAge: 1000 * 60 * 60 * 24 * 30,
      // Tell browser when a file from the server should expire from cache (in ms)

      chainWebpackWebserver (chain) {
        chain
          .plugin("eslint-webpack-plugin")
          .use(ESLintPlugin, [{ extensions: ["js"] }]);
      },

      middlewares: [
        ctx.prod ? "compression" : "",
        "render", // keep this as last one
      ],
    },

    // https://quasar.dev/quasar-cli/developing-pwa/configuring-pwa
    pwa: {
      workboxPluginMode: "GenerateSW", // 'GenerateSW' or 'InjectManifest'
      workboxOptions: {}, // only for GenerateSW

      // for the custom service worker ONLY (/src-pwa/custom-service-worker.[js|ts])
      // if using workbox in InjectManifest mode
      chainWebpackCustomSW (chain) {
        chain
          .plugin("eslint-webpack-plugin")
          .use(ESLintPlugin, [{ extensions: ["js"] }]);
      },

      manifest: {
        name: `TM Store`,
        short_name: `TM Store`,
        description: `A Quasar Framework app`,
        display: "standalone",
        orientation: "portrait",
        background_color: "#ffffff",
        theme_color: "#027be3",
        icons: [
          {
            src: "icons/icon-128x128.png",
            sizes: "128x128",
            type: "image/png",
          },
          {
            src: "icons/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icons/icon-256x256.png",
            sizes: "256x256",
            type: "image/png",
          },
          {
            src: "icons/icon-384x384.png",
            sizes: "384x384",
            type: "image/png",
          },
          {
            src: "icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    },

    // Full list of options: https://quasar.dev/quasar-cli/developing-cordova-apps/configuring-cordova
    cordova: {
      noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
    },

    // Full list of options: https://quasar.dev/quasar-cli/developing-capacitor-apps/configuring-capacitor
    capacitor: {
      hideSplashscreen: true,
    },

    // Full list of options: https://quasar.dev/quasar-cli/developing-electron-apps/configuring-electron
    electron: {
      bundler: "packager", // 'packager' or 'builder'

      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options
        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',
        // Windows only
        // win32metadata: { ... }
      },

      builder: {
        // https://www.electron.build/configuration/configuration

        appId: "tm-store-mobile",
      },

      // "chain" is a webpack-chain object https://github.com/neutrinojs/webpack-chain
      chainWebpackMain (chain) {
        chain
          .plugin("eslint-webpack-plugin")
          .use(ESLintPlugin, [{ extensions: ["js"] }]);
      },

      // "chain" is a webpack-chain object https://github.com/neutrinojs/webpack-chain
      chainWebpackPreload (chain) {
        chain
          .plugin("eslint-webpack-plugin")
          .use(ESLintPlugin, [{ extensions: ["js"] }]);
      },
    },
  };
});
