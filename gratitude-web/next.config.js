const withAssetRelocator = (nextConfig = {}) => {
  return Object.assign({}, nextConfig, {
    webpack (config, options) {
      const { isServer } = options
      if (isServer) {
        config.node = Object.assign({}, config.node, {
          __dirname: false,
          __filename: false
        })

        config.module.rules.unshift({
          test: /\.(m?js|node)$/,
          parser: { amd: false },
          use: {
            loader: '@zeit/webpack-asset-relocator-loader',
            options: {
              outputAssetBase: 'assets',
              existingAssetNames: [],
              wrapperCompatibility: true,
              escapeNonAnalyzableRequires: true
            }
          }
        })

        config.module.rules.unshift({
          test: /\.txt$/i,
          use: 'raw-loader'
        })
      }

      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options)
      }
      return config
    }
  })
}

module.exports = withAssetRelocator({
  target: 'serverless',
  env: {
    API_KEY: process.env.API_KEY,
    AUTH_DOMAIN: process.env.AUTH_DOMAIN,
    DATABASE_URL: process.env.DATABASE_URL,
    PROJECT_ID: process.env.PROJECT_ID,
    STORAGE_BUCKET: process.env.STORAGE_BUCKET,
    MESSAGING_SENDER_ID: process.env.MESSAGING_SENDER_ID,
    SERVER_ENV: process.env.SERVER_ENV
  },
  exportPathMap: function () {
    return {
      '/': { page: '/' }
    }
  }
})
