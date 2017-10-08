(function($, window) {

var BASEURL = window.BASEURL = [
	'https://realmofthemadgodhrd.appspot.com/',
	'https://rotmgtesting.appspot.com/'
];

var _cnt = 0;
function queue_request(obj) {
	var oc = obj.complete;
	obj.complete = function() {
		if (oc) oc.apply(this, arguments);
		_cnt = $(document).queue('ajax').length;
		update_counter();
		$(document).dequeue('ajax');
	}
	if (_cnt) {
		$(document).queue('ajax', function(){ $.ajax(obj) });
	} else {
		$.ajax(obj);
	}
	_cnt++;
	update_counter();
}

function update_counter() {
	$('#counter').text(_cnt).parent().toggle(!!_cnt);
}


function realmAPI(path, opts, extraopts, callback) {
	opts.ignore = Math.floor(1e3 + 9e3 * Math.random());
	var url = window.BASEURL + path + '?' + $.param(opts) + '&muleDump=true';

	if (typeof extraopts == 'function') {
		callback = extraopts;
		extraopts = {}
	}

	if (extraopts.url && setuptools.data.config.accountAssistant === true ) {

		if ( extraopts.type === 'ageVerify' && setuptools.state.assistant.ageVerify === false ) {

            setuptools.state.assistant.ageVerify = true;
            setuptools.lightbox.build('realmapi-popup', ' \
				You need to verify your age in order to use this account. \
				<br><br>Please proceed to: <a href="' + url + '" target="_blank">' + url + '</a> \
				<br><br>When you are ready <a href="#" class="setuptools app link popupComplete">click here</a> to continue. \
				<br><br>You can disable the account assistant in the <a href="#" class="setuptools app link settingsmanager">Settings Manager</a>. \
			');
            setuptools.lightbox.settitle('realmapi-popup', 'Kongregate Age Verification');
            setuptools.lightbox.drawhelp('realmapi-popup', 'docs/muledump/ageVerify', 'Age Verification Help');
            setuptools.lightbox.display('realmapi-popup', {actionClose: function() { setuptools.state.assistant.ageVerify = false; }});

        } else if ( extraopts.type === 'tos' && setuptools.state.assistant.tos === false ) {

            setuptools.state.assistant.tos = true;
            setuptools.lightbox.build('realmapi-popup', ' \
				You need to accept the TOS in order to use this account. \
				<br><br>Please proceed to: <a href="' + url + '" target="_blank">' + url + '</a> \
				<br><br>When you are ready <a href="#" class="setuptools app link popupComplete">click here</a> to continue. \
				<br><br>You can disable the account assistant in the <a href="#" class="setuptools app link settingsmanager">Settings Manager</a>. \
			');
            setuptools.lightbox.settitle('realmapi-popup', 'TOS Verification');
            setuptools.lightbox.drawhelp('realmapi-popup', 'docs/muledump/tos', 'TOS Verification Help');
            setuptools.lightbox.display('realmapi-popup', {actionClose: function() { setuptools.state.assistant.tos = false; }});

		} else if ( extraopts.type === 'migration' && setuptools.state.assistant.migration === false ) {

            setuptools.state.assistant.migration = true;
            setuptools.lightbox.build('realmapi-popup', ' \
				You need to finish migration in order to use this account. \
				<br><br>Please proceed to: <a href="' + url + '" target="_blank">' + url + '</a> \
				<br><br>When you are ready <a href="#" class="setuptools app link popupComplete">click here</a> to continue. \
				<br><br>Warning: Migration may no longer be possible. \
				<br><br>You can disable the account assistant in the <a href="#" class="setuptools app link settingsmanager">Settings Manager</a>. \
			');
            setuptools.lightbox.settitle('realmapi-popup', 'Account Migration');
            setuptools.lightbox.drawhelp('realmapi-popup', 'docs/muledump/migration', 'Account Migration Help');
            setuptools.lightbox.display('realmapi-popup', {actionClose: function() { setuptools.state.assistant.migration = false; }});

		} else {

			//  hmm

		}

		$('.setuptools.link.settingsmanager').click(function() { setuptools.app.config.settings('accountAssistant'); });
        if ( typeof callback === 'function' ) $('.setuptools.link.popupComplete').click(callback);
		return

	}

	window.techlog("RealmAPI call to - " + url.replace(/&(password|secret)=(.*?)&/g, '&***hidden***&'));

    queue_request({
        dataType: 'text',
        url: url,
		cors: true,
        complete: callback
    })
}

window.realmAPI = realmAPI

})($, window);

