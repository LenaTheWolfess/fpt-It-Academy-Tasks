/* eslint-disable require-jsdoc */
function Connector(id, key) {
  this.id = id;
  this.key = key;
  this.url = '';
};

Connector.prototype.setUrl = function(url) {
  this.url = url;
};

Connector.prototype.createRequest = function(
    method,
    addUrl = '',
    reqType = '') {
  const request = new XMLHttpRequest();
  request.open(method, this.url + addUrl, true);
  if (reqType) {
    request.responseType = reqType;
  }
  request.setRequestHeader('X-Parse-Application-Id', this.id);
  request.setRequestHeader('X-Parse-REST-API-Key', this.key);
  return request;
};

Connector.prototype.getData = function(callback) {
  const request = this.createRequest('GET');
  request.onload = () => {
    const status = request.status;
    if (status != 200) {
      this.handleError(status, request.response);
      return;
    }
    callback(request.response);
  };
  request.send();
};

Connector.prototype.getOneObject = function(id, callback) {
  const request = this.createRequest('GET', id);
  request.onload = () => {
    const status = request.status;
    if (status != 200) {
      this.handleError(status, request.response);
      return;
    }
    callback(request.response);
  };
  request.send();
};

Connector.prototype.addData = function(data, callback) {
  const request = this.createRequest('POST');
  request.onload = () => {
    const status = request.status;
    if (status != 201) {
      this.handleError(status, request.response);
      return;
    }
    callback && callback(request.response);
  };
  request.send(JSON.stringify(data));
};

Connector.prototype.updateData = function(id, data) {
  const request = this.createRequest('PUT', id, 'json');
  request.onload = () => {
    const status = request.status;
    if (status != 200) {
      this.handleError(status, request.response);
      return;
    }
  };
  request.send(JSON.stringify(data));
};

Connector.prototype.removeData = function(id) {
  const request = this.createRequest('DELETE', id);
  request.onload = () => {
    const status = request.status;
    if (status != 200) {
      this.handleError(status, request.response);
      return;
    }
  };
  request.send();
};

Connector.prototype.handleError = function(code, msg) {
  console.error(code + ': ' + msg);
};
