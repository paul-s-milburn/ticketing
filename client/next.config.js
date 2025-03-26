module.exports = {
  webpack: (config) => {
    config.watchOptions.poll = 300;
    return config;
  },
  allowedDevOrigins: ['7wx.co.uk','*.7wx.co.uk'],
};
