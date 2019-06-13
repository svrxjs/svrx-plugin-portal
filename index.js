const portal = require('./portal-client/app.js');

module.exports = {
  configSchema: {
    remoteHost: {
      type: 'string',
      default: 'igame.163.com'
    },
    remotePort: {
      type: 'number',
      default: 80
    },
    subdomain: {
      type: 'string'
    },
    remoteConnectPort: {
      type: 'number',
      default: 80
    },
    localHost: {
      type: 'string',
      default: 'localHost'
    },
    localPort: {
      type: 'string'
    },
    fallback: {
      type: 'object'
    }
  },
  hooks: {
    async onCreate({ config }) {
      const params = {
        remoteHost: config.get('remoteHost'),
        remotePort: config.get('remotePort'),
        subdomain: config.get('subdomain'),
        remoteConnectPort: config.get('remoteConnectPort'),
        localHost: config.get('localHost')
      };
      const fallback = config.get('fallback');
      const subdomain = config.get('subdomain');
      const localPort = config.get('localPort');
      if (fallback !== undefined) params.fallback = fallback;
      if (subdomain !== undefined) params.subdomain = subdomain;
      params.localPort = localPort === undefined ? config.get('$.port') : localPort;
      portal(params);
    }
  }
};