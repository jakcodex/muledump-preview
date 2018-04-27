(function($, window) {

	//  handle ajax calls
	function queue_request(obj) {

		var oc = obj.complete;
		obj.complete = function() {
			if (oc) oc.apply(this, arguments);
			$(document).dequeue('ajax');
		};
		$.ajax(obj);

	}

	//  build and send requests to rotmg servers
	function realmAPI(path, opts, extraopts, callback) {

        if (typeof extraopts === 'function') {
            callback = extraopts;
            extraopts = {}
        }

		//  merge supplied options over default options and add random token
		opts = $.extend(true, setuptools.config.realmApiParams, opts);
        opts.ignore = Math.floor(1e3 + 9e3 * Math.random());

        //  provide a default hostname and build the full request uri
        if ( !extraopts.url ) extraopts.url = setuptools.config.appspotProd;
        var url = extraopts.url + path + '?' + $.param(opts);

        //  account assistant helps with migration, tos verification, and kongregate age verification
        if (extraopts.url && extraopts.type && setuptools.data.config.accountAssistant === 1 ) {
            setuptools.app.assistants.account(url, extraopts, callback);
            return;
        }

        //  send the request to rotmg and route the response
		window.techlog("RealmAPI call to - " + url.replace(/&(password|secret)=(.*?)&/g, '&***hidden***&'));
		queue_request({
			dataType: 'text',
			url: url,
			complete: callback,
			error: setuptools.app.assistants.xhrError
		})
	}

	window.realmAPI = realmAPI

})($, window);

