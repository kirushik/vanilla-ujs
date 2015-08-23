var LiteAjax = (function () {
  var LiteAjax = {};

  LiteAjax.options = {
    method: 'GET',
    url: window.location.href
  };

  LiteAjax.ajax = function (url, options) {
    if (typeof url == 'object') {
      options = url;
      url = undefined;
    }

    options = options || {};
    url = url || options.url || location.href || '';
    var data = options.data;

    options.method = options.method || 'GET';

    // PhantomJS workaround
    if (options.method === 'PATCH') {
      data['_method'] = 'PATCH';
      options.method = 'PUT';
    }


    var xhr = new XMLHttpRequest();

    xhr.addEventListener('load', function () {
      responseType = xhr.getResponseHeader('content-type');
      if(responseType === 'text/javascript; charset=utf-8') {
        eval(xhr.response);
      }

      window.ajaxRequestsInProgress -= 1;
      var event = new CustomEvent('ajaxComplete', {detail: xhr});
      document.dispatchEvent(event);
    });

    if (typeof options.success == 'function')
      xhr.addEventListener('load', function (event) {
        if (xhr.status >= 200 && xhr.status < 300)
          options.success(xhr);
      });

    if (typeof options.error == 'function') {
      xhr.addEventListener('load', function (event) {
        if (xhr.status < 200 || xhr.status >= 300)
          options.error(xhr);
      });
      xhr.addEventListener('error', function (event) {
        options.error(xhr);
      });
    }

    xhr.open(options.method || 'GET', url);
    xhr.setRequestHeader('X-Requested-With', 'XmlHttpRequest');

    if(options.json) {
      xhr.setRequestHeader('Content-type', 'application/json');
      data = JSON.stringify(data)
    }

    if ( window.ajaxRequestsInProgress === undefined ) {
      window.ajaxRequestsInProgress = 1;
    } else {
      window.ajaxRequestsInProgress += 1;
    }
    var beforeSend = new CustomEvent('ajax:before', {detail: xhr});
    document.dispatchEvent(beforeSend);
    xhr.send(data);

    return xhr;
  };

  return LiteAjax;
})();
