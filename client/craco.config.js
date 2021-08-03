const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { 
              '@primary-color': '#45E4CF',
              '@link-color': '#0F6157',
              '@text-color': '#003A5A'
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};