/* eslint-disable require-jsdoc */
function Connector(key) {
  this.key = key;
  this.url = '';
};

Connector.prototype.setUrl = function(url) {
  this.url = url;
};

Connector.prototype.setKey = function(key) {
  this.key = key;
}

Connector.prototype.createRequest = function(
    method,
    data,
    cntType) {
  const request = {
    method: method,
    headers: {
      'Content-Type': cntType,
      'Accept': 'application/json, text/plain, */*',
      'user-token': this.key
    },
    body: data,
  };
  return request;
};

Connector.prototype.handleFetchErrors = function(response) {
  if (!response.ok) {
    throw response;
  }
  return response;
}

Connector.prototype.getData = function(urlPl, callback, callbackE) {
  const request = this.createRequest('GET');

  fetch(this.url + urlPl, request)
      .then(this.handleFetchErrors)
      .then((response) => response.json())
      .then((data) => callback(data))
      .catch((msg) => callbackE(msg));
};

Connector.prototype.getOneObject = function(urlPl, callback, callbackE) {
  const request = this.createRequest('GET');

  fetch(this.url + urlPl, request)
      .then(this.handleFetchErrors)
      .then((response) => response.json())
      .then((data) => callback(data))
      .catch((msg) => callbackE(msg));
};

Connector.prototype.addData = function(urlPl, data, callback, callbackE) {
  const request = this.createRequest('POST', JSON.stringify(data), 'application/json;charset=utf-8');
  fetch(this.url + urlPl, request)
      .then(this.handleFetchErrors)
      .then((response) => response.json())
      .then((data) => callback(data))
      .catch((msg) => callbackE(msg));
};

Connector.prototype.updateData = function(
    urlPl, data, callback, callbackE, params) {
  const request = this.createRequest('PUT', JSON.stringify(data),
      'application/json;charset=utf-8');

  fetch(this.url + urlPl, request)
      .then(this.handleFetchErrors)
      .then((response) => response.json())
      .then((data) => callback(params))
      .catch((msg) => callbackE(msg));
};

Connector.prototype.removeData = function(urlPl, id, callbackE) {
  const request = this.createRequest('DELETE');

  fetch(this.url + urlPl + id, request)
      .then(this.handleErrors)
      .then(()=>{})
      .catch((msg) => callbackE);
};

Connector.prototype.handleError = function(code, msg) {
  console.error(code + ': ' + msg);
};
