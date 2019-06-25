/*
 * @Author: Feng fan
 * @Date: 2018-09-13 15:45:11
 * @Last Modified by: Feng fan
 * @Last Modified time: 2019-05-08 17:11:54
 */
const axios = require('axios');
const Connection = require('./connection');
// const logger = require('./utils/logger');

class Portal {
  constructor(options) {
    Object.assign(this, options);
  }
  
  async init({ maxConnectionCount }) {
    this.maxConnectionCount = maxConnectionCount;
    const response = await this._getAddress();
    // 分配的子域名
    this.subdomain = response.data.subdomain;
    // logger.info('已获取:', this.subdomain)
    return this._connect();
  }

  // 取得远程连接的相关信息
  _getAddress() {
    const { remoteHost, remotePort, subdomain = ''} = this;
    const url = `http://portal.${remoteHost}:${remotePort}/portal/connect?subdomain=${subdomain}`;
    return axios.get(url);
  }

  _connect() {
    const { 
      remoteHost, remoteConnectPort, 
      localHost, localPort, subdomain,
      fallback
    } = this;
    this.connection = new Connection({
      remoteHost, remoteConnectPort, 
      localHost, localPort, subdomain,
      fallback
    });
    // this.connection.on('connect', () => {
    //   logger.info(`可访问${subdomain}.${remoteHost}`);
    // });
    this.connection.on('disconnect', () => {
      // 退出程序
      process.exit();
    });

    return this.connection;
  }
}

module.exports = Portal;