// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const request = require('request');
const Q = require('q');

class CrawlerClient {

  constructor(url, token) {
    this.url = process.env.CRAWLER_SERVICE_URL || 'http://localhost:3000';
    this.authToken = process.env.CRAWLER_SERVICE_AUTH_TOKEN || 'secret';
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

  configureCrawler(patch) {
    const deferred = Q.defer();
    request.patch(`${this.url}/config`, {
      headers: {
        'X-token': this.authToken
      },
      json: true,
      body: patch
    }, (error, response, body) => {
      if (error) {
        return deferred.reject(new Error(`Failed to configure crawler: ${error.message}.`));
      }
      if (response.statusCode !== 200) {
        return deferred.reject(new Error(`Failed to configure crawler: ${body}.`));
      }
      deferred.resolve();
    });
    return deferred.promise;
  }

  getConfiguration() {
    const deferred = Q.defer();
    request.get(`${this.url}/config`, {
      headers: {
        'X-token': this.authToken
      },
      json: true,
    }, (error, response, body) => {
      if (error) {
        return deferred.reject(new Error(`Failed to get crawler configuration: ${error.message}.`));
      }
      if (response.statusCode !== 200) {
        return deferred.reject(new Error(`Failed to get crawler configuration: ${body}.`));
      }
      deferred.resolve(body);
    });
    return deferred.promise;
  }

  patchConfiguration(patches) {
    const deferred = Q.defer();
    request.patch(`${this.url}/config`, {
      headers: {
        'X-token': this.authToken
      },
      body: patches,
      json: true,
    }, (error, response, body) => {
      if (error) {
        return deferred.reject(new Error(`Failed to patch crawler configuration: ${error.message}.`));
      }
      if (response.statusCode !== 200) {
        return deferred.reject(new Error(`Failed to patch crawler configuration: ${body}.`));
      }
      deferred.resolve(body);
    });
    return deferred.promise;
  }

  setTokens(tokens) {
    const deferred = Q.defer();
    request.put(`${this.url}/tokens`, {
      headers: {
        'X-token': this.authToken
      },
      body: tokens.join(';')
    }, (error, response, body) => {
      if (error) {
        return deferred.reject(new Error(`Failed to set tokens: ${error.message}.`));
      }
      if (response.statusCode !== 200) {
        return deferred.reject(new Error(`Failed to set tokens: ${body}.`));
      }
      deferred.resolve(null);
    });
    return deferred.promise;
  }

  queueRequests(requests, queueName = 'normal') {
    const deferred = Q.defer();
    request.post(`${this.url}/requests/${queueName}`, {
      headers: {
        'X-token': this.authToken
      },
      json: true,
      body: requests
    }, (error, response, body) => {
      if (error) {
        return deferred.reject(new Error(`Failed to queue requests: ${error.message}.`));
      }
      if (response.statusCode !== 201) {
        return deferred.reject(new Error(`Failed to queue requests: ${body}.`));
      }
      deferred.resolve();
    });
    return deferred.promise;
  }

  getRequests(queueName, count = 1) {
    const deferred = Q.defer();
    request.get(`${this.url}/requests/${queueName}?count=${count}`, {
      headers: {
        'X-token': this.authToken
      },
      json: true
    }, (error, response, body) => {
      if (error) {
        return deferred.reject(new Error(`Failed to get requests: ${error.message}.`));
      }
      if (response.statusCode !== 200) {
        return deferred.reject(new Error(`Failed to get requests: ${body}.`));
      }
      deferred.resolve(body);
    });
    return deferred.promise;
  }

  deleteRequests(queueName, count = 1) {
    const deferred = Q.defer();
    request.delete(`${this.url}/requests/${queueName}?count=${count}`, {
      headers: {
        'X-token': this.authToken
      },
      json: true
    }, (error, response, body) => {
      if (error) {
        return deferred.reject(new Error(`Failed to delete requests: ${error.message}.`));
      }
      if (response.statusCode !== 200) {
        return deferred.reject(new Error(`Failed to delete requests: ${body}.`));
      }
      deferred.resolve(body);
    });
    return deferred.promise;
  }

  flushQueue(queueName) {
    const deferred = Q.defer();
    request.put(`${this.url}/queue/${queueName}`, {
      headers: {
        'X-token': this.authToken
      },
      json: true
    }, (error, response, body) => {
      if (error) {
        return deferred.reject(new Error(`Failed to flush queue ${queueName}: ${error.message}.`));
      }
      if (response.statusCode !== 200) {
        return deferred.reject(new Error(`Failed to flush queue ${queueName}: ${body}.`));
      }
      deferred.resolve();
    });
    return deferred.promise;
  }
}

module.exports = CrawlerClient;