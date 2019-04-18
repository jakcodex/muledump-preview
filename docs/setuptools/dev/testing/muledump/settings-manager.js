/*
// Validates Settings Manager by checking present settings and verifying them in the configuration
// Checks for key existence and type checks save and reset values
*/

found = [];
unknown = [];
missing = [];
malformed = [];
mismatch = [];
badtype = {
	save: [],
	reset: []
};
exempt = {
	both: ['encryption', 'mqBGTimeout', 'mqConcurrent', 'mqDisplayIgn', 'mqKeepHistory', 'muleloginCopyLinks', 'pagesearchMode', 'recordConsoleTtl', 'tooltip', 'vaultbuilderAccountViewLimit', 'wbTotals', 'group'],
	local: ['alertNewVersion', 'ga', 'gaErrors', 'gaOptions', 'gaPing', 'gaTotals'],
	online: []
};

//  check all settings in display
$('div.setuptools.app.config.settings').each(function() {
	
	//  no id means malformed
	if ( typeof $(this).find('div').attr('id') !== 'string' ) {
		malformed.push($(this).find('div').text());
		return;
	}
	
	var matches = $(this).find('div').attr('id').match(/^settings-(.*)$/i);
	
	//  identify if a setting is known or unknown
	if ( typeof setuptools.data.config[matches[1]] !== 'undefined' ) {
		
		found.push(matches[1]);
		if ( $(this).find('select').attr('name') !== matches[1] ) mismatch.push(matches[1]);
		
	} else {
		unknown.push(matches[1]);
	}
	
});

//  check for missing config keys and apply exemptions
Object.keys(setuptools.data.config).forEach(function(key) {
	if ( 
		found.indexOf(key) === -1 && 
		exempt.both.indexOf(key) === -1 &&
		(setuptools.state.hosted === true && exempt.online.indexOf(key) === -1) &&
		(setuptools.state.hosted === false && exempt.local.indexOf(key) === -1)
	) missing.push(key);
});

/*
// The following two checks require you run save and reset without reloading
*/

//  check save key types against default types
if ( setuptools.tmp.settingsKeysSave )
	Object.keys(setuptools.tmp.settingsKeysSave).forEach(function(key) {
		if ( typeof setuptools.copy.data.config[key] !== setuptools.tmp.settingsKeysSave[key] ) badtype.save.push(key);
	});
	
//  check reset key types against default and types
if ( setuptools.tmp.settingsKeysReset )
	Object.keys(setuptools.tmp.settingsKeysReset).forEach(function(key) {
		if ( typeof setuptools.copy.data.config[key] !== setuptools.tmp.settingsKeysReset[key] ) badtype.reset.push(key);
	});

//  display the results
console.log(' \
Report: \n\n \
+ Missing: ' + missing + ' \n\n \
+ Unknown: ' + unknown + ' \n\n \
+ Malformed: ' + malformed + ' \n\n \
+ Mismatched: ' + mismatch + ' \n\n \
+ Bad Save Type: ' + badtype.save + ' \n\n \
+ Bad Reset Type: ' + badtype.reset + '\n \
');
