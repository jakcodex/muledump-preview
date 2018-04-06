(function($, window) {

	function queue_request(obj) {

		var oc = obj.complete;
		obj.complete = function() {
			if (oc) oc.apply(this, arguments);
			$(document).dequeue('ajax');
		};
		$.ajax(obj);

	}

	function realmAPI(path, opts, extraopts, callback) {

		opts.ignore = Math.floor(1e3 + 9e3 * Math.random());

		if (typeof extraopts === 'function') {
			callback = extraopts;
			extraopts = {}
		}

		if ( !extraopts.url ) extraopts.url = setuptools.config.appspotProd;
		var url = extraopts.url + path + '?' + $.param(opts) + '&muleDump=true';

		//  account assistant helps with migration, tos verification, and kongregate age verification
		if (extraopts.url && setuptools.data.config.accountAssistant === true ) {
			setuptools.app.assistants.account(url, extraopts, callback);
			return;
		}

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

