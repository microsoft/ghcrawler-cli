// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const request = require('request');
const Q = require('q');

class CrawlerClient {

  constructor(url = null, token = null) {
    this.url = url || process.env.CRAWLER_SERVICE_URL || 'http://localhost:3000';
    this.authToken = token || process.env.CRAWLER_SERVICE_AUTH_TOKEN || 'secret';
  }

  configureCount(count) {
    count = Math.max(count, 0);
    const patch = [
      { "op": "replace", "path": "/crawler/count", "value": count }
    ];
    return configureCrawler(patch);
  }

  configureOrgs(orgs) {
    const patch = [
      { "op": "replace", "path": "/crawler/orgList", "value": orgs }
    ];
    return configureCrawler(patch);
  }

  getConfiguration() {
    return this._call('get', `${this.url}/config`, `Failed to get crawler configuration`);
  }

  configureCrawler(patches) {
    return this._call('patch', `${this.url}/config`, `Failed to patch crawler configuration`, patches);
  }

  setTokens(tokens) {
    return this._call('put', `${this.url}/config/tokens`, `Failed to set tokens`, tokens.join(';'));
  }

  queueRequests(requests, queueName = 'normal') {
    return this._call('post', `${this.url}/requests/${queueName}`, `Failed to queue requests`, requests);
  }

  getRequests(queueName, count = 1) {
    return this._call('get', `${this.url}/requests/${queueName}?count=${count}`, `Failed to get requests`);
  }

  deleteRequests(queueName, count = 1) {
    return this._call('delete', `${this.url}/requests/${queueName}?count=${count}`, `Failed to delete requests`);
  }

  flushQueue(queueName) {
    return this._call('put', `${this.url}/queues/${queueName}`, `Failed to flush queue ${queueName}`);
  }

  getInfo(queueName) {
    return this._call('get', `${this.url}/queues/${queueName}/info`, `Failed to get info for queue ${queueName}`);
  }

  listDeadletters() {
    return this._call('get', `${this.url}/deadletters`, `Failed to list deadletters`);
  }

  _call(method, url, errorMessage, body = null) {
    const deferred = Q.defer();
    const options = {
      headers: { 'X-token': this.authToken },
      json: true
    };
    if (body) {
      options.body = body;
    }
    request[method](url, options, (error, response, body) => {
      if (error || response.statusCode > 299) {
        const detail = error ? error.message : (body ? (typeof body === 'string' ? body : body.message) : (response ? response.statusMessage : ''));
        return deferred.reject(new Error(`${errorMessage}: ${detail}.`));
      }
      deferred.resolve(body);
    });
    return deferred.promise;
  }

}

module.exports = CrawlerClient;
