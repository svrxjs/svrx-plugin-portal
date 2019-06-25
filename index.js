const portal = require('./portal-client/app.js');

module.exports = {
  configSchema: {
    remoteHost: {
      type: 'string',
      default: 'igame.163.com'
    },
    subdomain: {
      type: 'string'
    },
    fallback: {
      type: 'object'
    }
  },
  hooks: {
    async onCreate({ config, events, logger }) {
      events.on('ready', async () => {
        const params = {
          remoteHost: config.get('remoteHost'),
          remotePort: 80,
          remoteConnectPort: 80,
          localHost: '127.0.0.1',
          localPort: config.get('$.port')
        };

        const fallback = config.get('fallback');
        const subdomain = config.get('subdomain');
        if (fallback !== undefined) params.fallback = fallback;
        if (subdomain !== undefined) params.subdomain = subdomain;

        const connect = await portal(params);
        connect.on('connect', connect => {
          logger.info(`Serving at ${connect.subdomain}.${connect.remoteHost}`);
        });
        connect.on('disconnect', () => {
          logger.info('disconnect');
        });
        connect.on('error', error => {
          logger.error(error);
        });
      });
    }
  }
};