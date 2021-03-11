/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

const appName = 'o2-website';
if (process.env.REACT_APP_RELEASE_ENV === 'uat') {
  process.env.PUBLIC_URL = `/${appName}/`;
}

module.exports = {
  webpack: {
    alias: {
      '@': path.join(__dirname, './src'),
    },
    configure: (webpackConfig, { env, paths }) => {
      if (process.env.REACT_APP_RELEASE_ENV === 'uat') {
        webpackConfig.output.publicPath = `/${appName}/`;
      }

      const dist = path.resolve(__dirname, './dist');
      webpackConfig.output.path = dist;
      paths.appBuild = dist;

      if (process.env.NODE_ENV === 'production') {
        const sassModuleRule = webpackConfig.module.rules[1]?.oneOf?.find(i => /\.module\\\.\(scss\|sass\)/.test(i?.test?.toString()));
        const cssLoaderInSassModuleRule = sassModuleRule?.use?.find(i => /\/css-loader\//.test(i?.loader));
        if (cssLoaderInSassModuleRule && cssLoaderInSassModuleRule.options && cssLoaderInSassModuleRule.options.modules) {
          cssLoaderInSassModuleRule.options.modules = {
            localIdentName: '[local]-[hash:base64:5]',
          };
        }
      }

      return webpackConfig;
    },
  },
};
