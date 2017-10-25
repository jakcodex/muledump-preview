//  manage setuptools and muledump settings
setuptools.app.config.settings = function(highlight) {

    if ( typeof highlight === 'string' ) highlight = [highlight];
    if ( typeof highlight === 'undefined' ) highlight = [];
    var disabled = '';

    setuptools.lightbox.build('settings', ' \
        <div class="setuptools app config container"> \
            <div class="setuptools app config settings"> \
                <div>SetupTools Enabled</div> \
                <select name="enabled" class="setting"' + ( (setuptools.state.hosted === true) ? ' disabled' : '' ) + '>\
                    <option' + ( (setuptools.data.config.enabled === true) ? ' selected' : '' ) + ' value="1">Yes</option> \
                    <option' + ( (setuptools.data.config.enabled === false) ? ' selected' : '' ) + ' value="0">No</option> \
                </select> \
            </div> \
    ');

    if ( setuptools.data.config.enabled === true ) {

        setuptools.lightbox.build('settings', ' \
            <div class="setuptools app config settings"> \
                <div>Prevent Auto Download</div> \
                <select name="preventAutoDownload" class="setting"> \
                    <option' + ( (setuptools.data.config.preventAutoDownload === true) ? ' selected' : '' ) + ' value="1">Yes</option> \
                    <option' + ( (setuptools.data.config.preventAutoDownload === false) ? ' selected' : '' ) + ' value="0">No</option> \
                </select> \
            </div> \
            <div class="setuptools app config settings"> \
                <div>Maximum Backups in Local Storage</div> \
                <select name="maximumBackupCount" class="setting"> \
        ');

        for (i = 0; i < 31; i++) setuptools.lightbox.build('settings', ' \
            <option ' + ( (Number(i) === Number(setuptools.data.config.maximumBackupCount)) ? 'selected' : '' ) + ' value="' + i + '">' + i + '</option> \
        ');

        setuptools.lightbox.build('settings', ' \
                    </select> \
                </div> \
                <div class="setuptools app config settings"> \
                    <div>Automatic Backups</div> \
                    <select name="automaticBackups" class="setting">\
                        <option' + ( (setuptools.data.config.automaticBackups === true) ? ' selected' : '' ) + ' value="1">Yes</option> \
                        <option' + ( (setuptools.data.config.automaticBackups === false) ? ' selected' : '' ) + ' value="0">No</option> \
                    </select> \
                </div> \
                <div class="setuptools app config settings"> \
                    <div>Account Load Delay in Seconds</div> \
                    <select name="accountLoadDelay" class="setting"> \
        ');

        for (i = 0; i <= 60; i++) setuptools.lightbox.build('settings', ' \
            <option ' + ( (Number(i) === Number(setuptools.data.config.accountLoadDelay)) ? 'selected' : '' ) + ' value="' + i + '">' + i + '</option> \
        ');

        setuptools.lightbox.build('settings', ' \
                    </select> \
                </div> \
                <div class="setuptools app config settings"> \
                    <div>Characters Displayed per Row</div> \
                    <select name="rowlength" class="setting"> \
        ');

        for (i = 1; i <= 50; i++) setuptools.lightbox.build('settings', ' \
            <option ' + ( (Number(i) === Number(setuptools.data.config.rowlength)) ? 'selected' : '' ) + ' value="' + i + '">' + i + '</option> \
        ');

        setuptools.lightbox.build('settings', ' \
                    </select> \
                </div> \
                <div class="setuptools app config settings"> \
                    <div>Testing</div> \
                    <select name="testing" class="setting">\
                        <option' + ( (setuptools.data.config.testing === 1) ? ' selected' : '' ) + ' value="1">Yes</option> \
                        <option' + ( (setuptools.data.config.testing === 0) ? ' selected' : '' ) + ' value="0">No</option> \
                    </select> \
                </div> \
                <div class="setuptools app config settings"> \
                    <div>Price Display in Tooltips</div> \
                    <select name="prices" class="setting">\
                        <option' + ( (setuptools.data.config.prices === 1) ? ' selected' : '' ) + ' value="1">Yes</option> \
                        <option' + ( (setuptools.data.config.prices === 0) ? ' selected' : '' ) + ' value="0">No</option> \
                    </select> \
                </div> \
                <div class="setuptools app config settings"' + disabled + '> \
                    <div>Enable One-click Login</div> \
                    <select name="mulelogin" class="setting">\
                        <option' + ( (setuptools.data.config.mulelogin === 1) ? ' selected' : '' ) + ' value="1">Yes</option> \
                        <option' + ( (setuptools.data.config.mulelogin === 0) ? ' selected' : '' ) + ' value="0">No</option> \
                    </select> \
                </div> \
                <div class="setuptools app config settings"> \
                    <div>Use Smart Layout</div> \
                    <select name="nomasonry" class="setting">\
                        <option' + ( (setuptools.data.config.nomasonry === 0) ? ' selected' : '' ) + ' value="0">Yes</option> \
                        <option' + ( (setuptools.data.config.nomasonry === 1) ? ' selected' : '' ) + ' value="1">No</option> \
                    </select> \
                </div> \
                <div class="setuptools app config settings"> \
                    <div>Menu Position</div> \
                    <select name="menuPosition" class="setting">\
                        <option' + ( (setuptools.data.config.menuPosition === 0) ? ' selected' : '' ) + ' value="0">Left</option> \
                        <option' + ( (setuptools.data.config.menuPosition === 1) ? ' selected' : '' ) + ' value="1">Center</option> \
                        <option' + ( (setuptools.data.config.menuPosition === 2) ? ' selected' : '' ) + ' value="2">Right</option> \
                    </select> \
                </div> \
                <div class="setuptools app config settings"> \
                    <div>Longpress Length in Seconds</div> \
                    <select name="longpress" class="setting">\
                        <option' + ( (setuptools.data.config.longpress === 500) ? ' selected' : '' ) + ' value="500">0.5 seconds</option> \
                        <option' + ( (setuptools.data.config.longpress === 1000) ? ' selected' : '' ) + ' value="1000">1 second</option> \
                        <option' + ( (setuptools.data.config.longpress === 2000) ? ' selected' : '' ) + ' value="2000">2 seconds</option> \
                        <option' + ( (setuptools.data.config.longpress === 3000) ? ' selected' : '' ) + ' value="3000">3 seconds</option> \
                    </select> \
                </div> \
                <div class="setuptools app config settings"> \
                    <div id="settings-corsAssistant">CORS Assistant</div> \
                    <select name="corsAssistant" class="setting">\
                        <option' + ( (setuptools.data.config.corsAssistant === 0) ? ' selected' : '' ) + ' value="0">No</option> \
                        <option' + ( (setuptools.data.config.corsAssistant === 1) ? ' selected' : '' ) + ' value="1">Yes</option> \
                    </select> \
                </div> \
                <div class="setuptools app config settings"> \
                    <div id="settings-corsAssistant">Account Assistant</div> \
                    <select name="accountAssistant" class="setting"> \
                        <option' + ( (setuptools.data.config.accountAssistant === 0) ? ' selected' : '' ) + ' value="0">No</option> \
                        <option' + ( (setuptools.data.config.accountAssistant === 1) ? ' selected' : '' ) + ' value="1">Yes</option> \
                    </select> \
                </div> \
                <div class="setuptools app config settings"> \
                    <div>Enable Debug Logging</div> \
                    <select name="debugging" class="setting">\
                        <option' + ( (setuptools.data.config.debugging === true) ? ' selected' : '' ) + ' value="1">Yes</option> \
                        <option' + ( (setuptools.data.config.debugging === false) ? ' selected' : '' ) + ' value="0">No</option> \
                    </select> \
                </div> \
        ');

        if (setuptools.config.devForcePoint === 'online-versioncheck' || setuptools.state.hosted === true) {

            setuptools.lightbox.build('settings', ' \
                <div class="setuptools app config settings"> \
                    <div id="settings-alertNewVersion">Alert on New Version</div> \
                    <select name="alertNewVersion" class="setting">\
                        <option' + ( (setuptools.data.config.alertNewVersion === 0) ? ' selected' : '' ) + ' value="0">Off</option> \
                        <option' + ( (setuptools.data.config.alertNewVersion === 1) ? ' selected' : '' ) + ' value="1">On, releases only</option> \
                        <option' + ( (setuptools.data.config.alertNewVersion === 2) ? ' selected' : '' ) + ' value="2">On, all versions</option> \
                    </select> \
                </div> \
            ');

        }

    }

    setuptools.lightbox.build('settings', ' \
            <a href="#" class="setuptools app config settings action save">Save Settings</a> \
            <a href="#" class="setuptools app config settings action destroy noclose">Reset to Default Settings</a> \
            <a href="#" class="setuptools app config settings action arrrrgbaaad noclose">Erase Configuration</a> \
        </div> \
    ');

    setuptools.lightbox.settitle('settings', 'Muledump Settings');
    setuptools.lightbox.goback('settings', setuptools.app.index);
    setuptools.lightbox.drawhelp('settings', 'docs/setuptools/help/settings-manager', 'Muledump Settings Help');
    setuptools.lightbox.display('settings');
    if ( typeof highlight === 'object' ) {

        for ( i = 0; i < highlight.length; i++ ) {

            var settingDiv = $('#settings-' + highlight[i]);
            settingDiv.html('<strong>' + settingDiv.text() + '</strong>');
            console.log(highlight[i]);

        }

    }

    //  reset the settings to default values
    $('.setuptools.app.config.settings.action.destroy').click(function() {

        $('.setuptools.app.config.settings select').each(function() {

            //  setup
            var name = $(this).attr('name');
            var newvalue = false;

            //  these options are boolean in the config
            if ( ['enabled', 'preventAutoDownload', 'automaticBackups', 'debugging'].indexOf(name) > -1 ) {

                newvalue = ( setuptools.copy.config[name] === true ) ? 1 : 0;
                if ( name === 'enabled' && setuptools.state.hosted === true ) newvalue = 1;

                //  these settings are integers in the config
            } else if ( [
                'maximumBackupCount', 'rowlength', 'nomasonry', 'accountLoadDelay', 'testing', 'prices', 'mulelogin',
                'alertNewVersion', 'menuPosition', 'corsAssistant', 'accountAssistant', 'longpress'
            ].indexOf(name) > -1 ) {

                newvalue = setuptools.copy.config[name];

            } else setuptools.lightbox.error('Setting value does not exist');

            if ( newvalue !== false ) $('.setuptools.app.config select[name="' + name + '"] option[value="' + newvalue + '"]').prop('selected', 'selected');

        });

    });

    //  assist user in erasing setuptools configuration
    $('.setuptools.app.config.settings.action.arrrrgbaaad').click(function() {

        setuptools.lightbox.build('settings-erase-confirm', ' \
            This will complete erase SetupTools and its configuration. It will not erase any accounts.js file. \
            <br><br>Are you sure? \
            <br><br><a href="#" class="setuptools app erase">Yes, erase</a> or <a href="#" class="setuptools app cancelBadThing">No, cancel</a> \
            <br><br><input type="checkbox" name="clearBackups"> Erase backups stored in your browser \
        ');
        setuptools.lightbox.display('settings-erase-confirm', {"openSpeed": 0, "closeSpeed": 0});

        $('.setuptools.app.erase').click(function () {

            var BackupList = [];
            if ( $('input[name="clearBackups"]').prop('checked') === true ) {

                BackupList = setuptools.app.backups.listAll();
                for ( var i in BackupList )
                    if ( BackupList.hasOwnProperty(i) )
                        setuptools.storage.delete(BackupList[i][1]);

            }

            setuptools.storage.delete('configuration');
            setuptools.storage.delete('test');

            setuptools.lightbox.build('settings-erase-completed', ' \
                SetupTools configuration has been erased. \
                ' + ( (BackupList.length > 0) ? '<br><br>Erased ' + BackupList.length + ' backups.' : '') + ' \
                <br><br>This window will reload in a few seconds. \
            ');

            setuptools.lightbox.display('settings-erase-completed', {closeOnClick: false, otherClose: '', closeOnEsc: false, closeIcon: ''});

            setTimeout(function() {
                location.reload();
            }, 3000);

        });

    });

    $('.setuptools.app.config.settings.save').click(function() {

        $(this).unbind('click');

        //  gather our new settings
        var Reroll = true;
        var settings = {};
        settings.enabled = ( $('.setuptools.app.config.settings select[name="enabled"]').val() === '1' );
        if ( setuptools.data.config.enabled === true ) {
            Reroll = false;
            settings.preventAutoDownload = ( $('.setuptools.app.config.settings select[name="preventAutoDownload"]').val() === '1' );
            settings.maximumBackupCount = Number($('.setuptools.app.config.settings select[name="maximumBackupCount"]').val());
            settings.automaticBackups = ( $('.setuptools.app.config.settings select[name="automaticBackups"]').val() === '1' );
            settings.rowlength = Number($('.setuptools.app.config.settings select[name="rowlength"]').val());
            settings.accountLoadDelay = Number($('.setuptools.app.config.settings select[name="accountLoadDelay"]').val());
            settings.testing = ( $('.setuptools.app.config.settings select[name="testing"]').val() === '1' ) ? 1 : 0;
            settings.prices = ( $('.setuptools.app.config.settings select[name="prices"]').val() === '1' ) ? 1 : 0;
            settings.mulelogin = ( $('.setuptools.app.config.settings select[name="mulelogin"]').val() === '1' ) ? 1 : 0;
            settings.nomasonry = ( $('.setuptools.app.config.settings select[name="nomasonry"]').val() === '0' ) ? 0 : 1;
            settings.debugging = ( $('.setuptools.app.config.settings select[name="debugging"]').val() === '1' );
            settings.menuPosition = Number($('.setuptools.app.config.settings select[name="menuPosition"]').val());
            settings.longpress = Number($('.setuptools.app.config.settings select[name="longpress"]').val());
            settings.corsAssistant = Number($('.setuptools.app.config.settings select[name="corsAssistant"]').val());
            settings.accountAssistant = Number($('.setuptools.app.config.settings select[name="accountAssistant"]').val());
        }
        if ( setuptools.state.hosted === true ) {
            settings.alertNewVersion = Number($('.setuptools.app.config.settings select[name="alertNewVersion"]').val());
            settings.enabled = true;
        }

        //  roll them into the config
        for (var i in settings)
            if (settings.hasOwnProperty(i))
                setuptools.data.config[i] = settings[i];

        //  if the user had been disabled we need to reroll their original config back into setuptools.data.config
        if ( Reroll === true ) {

            var ImportData = JSON.parse(setuptools.storage.read('configuration'));
            for (var i in ImportData.config)
                if (ImportData.config.hasOwnProperty(i))
                    if ( i != 'enabled' )
                        setuptools.data.config[i] = ImportData.config[i];
        }

        //  save the configuration
        if ( setuptools.app.config.save() === false ) {
            setuptools.app.config.saveError();
        } else {
            setuptools.lightbox.build('settings-saved', 'Settings have been saved. <br><br>This page will reload in a few seconds.');
            setuptools.lightbox.goback('settings-saved', setuptools.app.config.settings);
            setuptools.lightbox.display('settings-saved');

            var ReloadTimeout = setTimeout(function() {
                window.location.reload();
            }, 3000);
            $('.setuptools.goback').click(function() {

                clearTimeout(ReloadTimeout);

            });
        }

    });

};

//  create account configuration backup
setuptools.app.config.backup = function(backupProtected, auto) {

    if ( typeof backupProtected != 'boolean' ) backupProtected = false;
    if ( typeof auto != 'boolean' ) auto = false;
    date = new Date(Date.now()+new Date().getTimezoneOffset());
    var BackupID = "muledump-backup-" + Date.now();
    var BackupName = "muledump-backup-" +
        date.getFullYear() +
        ('0' + (Number(date.getMonth())+1)).slice(-2) +
        ('0' + date.getDate()).slice(-2) + '-' +
        ('0' + date.getHours()).slice(-2) +
        ('0' + date.getMinutes()).slice(-2) +
        ('0' + date.getSeconds()).slice(-2);

    //  build our backup data object with meta data, setuptool.data, and muledump options
    var BackupData = JSON.stringify($.extend(true, {},
        {meta: {BackupDate: new Date().toISOString(), protected: backupProtected, auto: auto}},
        setuptools.data,
        {options: window.options}
    ), null, 4);

    //  write to local storage
    var BackupStatus = setuptools.storage.write(BackupID, BackupData);

    //  cleanup backups if we are over the limit1
    if ( BackupStatus === true ) setuptools.app.backups.cleanup();

    //  return the result
    return {
        BackupID: BackupID,
        BackupName: BackupName,
        BackupData: BackupData,
        status: BackupStatus
    };

};

//  in case the user fails to read instructions we can get their attention
setuptools.app.config.downloadAck = function() {

    var AckCount = Number(0);
    $('.setuptools.config.download').click(function(e) {

        //  if autoDownload is disabled then we should remind the user what they need to do
        if ( setuptools.data.config.preventAutoDownload === true ) {

            //  stop the automatic download
            e.preventDefault();

            //  visual response
            css = false;
            if (AckCount % 1 == 0) css = {'color': setuptools.config.errorColor};
            if (AckCount % 2 == 0) css = {'color': 'red'};
            if (AckCount == Number(0)) css = {'font-weight': 'bold'};
            if (typeof css === 'object') $('.setuptools.config.download.acknowledge').css(css);

            //  this is a bonafide easter egg
            if (AckCount == Number(50)) $('.setuptools.config.download.acknowledge').html('You\'re really having fun with this, aren\'t you?');
            if (AckCount == Number(100)) $('.setuptools.config.download.acknowledge').html('Yeah I thought so. <a href="#" data-featherlight="http://3.bp.blogspot.com/_D_Z-D2tzi14/S8TTPQCPA6I/AAAAAAAACwA/ZHZH-Bi8OmI/s400/ALOT2.png">I care about this Alot more</a>.');
            AckCount++;

        }

    });

};

//  convert account data format
setuptools.app.config.convert = function(accountConfig, format, group, all) {

    if ( group ) group = Number(group);
    if ( typeof all === 'undefined' ) all = false;
    format = Number(format);
    if ( !accountConfig || !$.isNumeric(format) ) {
        setuptools.lightbox.error("Supplied data is invalid for conversion.", 4);
        return;
    }

    //  format 0 is original muledump accounts var format
    var accountData;
    if ( format === 0 ) {

        //  is the supplied data in the correct format
        if ( setuptools.app.config.validateFormat(accountConfig, 1) === true ) {

            //  loop thru the accounts and return accounts that are enabled and, if provided, match the specified group
            accountData = {};
            for (var i in accountConfig.accounts)
                if (accountConfig.accounts.hasOwnProperty(i))
                    if ( all === true || (accountConfig.accounts[i].enabled === true && (!group || accountConfig.accounts[i].group === group)) )
                        accountData[i] = accountConfig.accounts[i].password;

            return accountData;

            //  something is wrong
        } else if ( accountConfig.meta && accountConfig.meta.format ) {
            setuptools.lightbox.error('Account configuration format ' + accountConfig.meta.format + ' cannot be converted to format ' + format, 6);
        } else setuptools.lightbox.error('Supplied configuration is not of a known format.', 7);

        //  format 1 is setuptools muledump accounts var format
    } else if ( format === 1 ) {

        //  validation is done inside setuptools.app.config.create()

        //  create the newly formatted account config
        accountData = setuptools.app.config.create(accountConfig, 1);

        return accountData;

        //  there are no other formats
    } else setuptools.lightbox.error("Request format for conversion is unknown", 5);

};

//  validate the supplied config against the specified format
setuptools.app.config.validateFormat = function(accountConfig, format) {

    format = Number(format);
    if ( format === 0 ) {

        //  is the supplied data in the correct format
        //  format 0 is very simple {'email1': 'password', 'email2': 'password', ...}
        for ( var i in accountConfig )
            if ( accountConfig.hasOwnProperty(i) )
                if ( !i.match(setuptools.config.regex.email) && !i.match(setuptools.config.regex.guid) )
                    return false;

        return true;

    } else if ( format === 1 ) {

        return !!( accountConfig.meta && accountConfig.meta.format === 1 )

    }

    return false;

};

//  determine the format in use
setuptools.app.config.determineFormat = function(accountConfig) {

    if ( setuptools.app.config.validateFormat(accountConfig, 1) === true ) {
        return 1;
    } else if ( setuptools.app.config.validateFormat(accountConfig, 0) === true ) {
        return 0;
    } else setuptools.lightbox.error('Supplied account configuration is of an unknown format.', 14);

};

//  determine if a user exists
setuptools.app.config.userExists = function(username) {

    if ( setuptools.data.config.enabled === true ) {

        format = setuptools.app.config.determineFormat(setuptools.data.accounts);
        if (format === 0) {
            return !!( setuptools.data.accounts[username] );
        } else if (format === 1) {
            return !!( setuptools.data.accounts.accounts[username] );
        } else {
            //  this honestly shouldn't happen
            setuptools.lightbox.error('Invalid account data provided', 14);
        }

    } else {

        return !!( window.accounts[username] );

    }

};

//  determine if a user is enabled
setuptools.app.config.userEnabled = function(username) {

    if ( setuptools.data.config.enabled === true ) {

        format = setuptools.app.config.determineFormat(setuptools.data.accounts);
        if ( format === 0 ) {
            return true;
        } else if ( format === 1 ) {
            return setuptools.data.accounts.accounts[username].enabled;
        } else {
            //  this honestly shouldn't happen
            setuptools.lightbox.error('Invalid account data provided', 14);
        }

    } else {
        return true;
    }

};

//  create a new user object and do something with it
setuptools.app.config.createUser = function(username, password, enabled, group, autoReload, action, format) {

    var accountConfig;
    format = Number(format);

    //  traditional format
    if ( format === 0 ) {

        //  type 0 implies set
        if ( setuptools.app.config.validateFormat(setuptools.data.accounts, 0) === true ) {
            setuptools.data.accounts[username] = password;
        } else setuptools.lightbox.error('Cannot set user on an invalid format configuration', 12);

        //  new format
    } else if ( format === 1 ) {

        accountConfig = {
            password: password,
            enabled: enabled,
            group: group,
            autoReload: autoReload
        };

        if ( action == 'set' ) {

            if ( setuptools.app.config.validateFormat(setuptools.data.accounts, 1) === true ) {
                setuptools.data.accounts.accounts[username] = accountConfig;
            } else setuptools.lightbox.error('Cannot set user on an invalid format configuration', 12);

        } else if ( action == 'return' ) {

            return accountConfig;

        }

    } else {

        setuptools.lightbox.error('The specified format does not exist.', 13);

    }

};

//  return a list of users and their status without passwords
setuptools.app.config.listUsers = function(id, enabled) {

    var result = {
        meta: {
            results: 0,
            duplicates: {
                count: 0,
                list: []
            },
            terms: {
                id: id,
                enabled: enabled
            }
        },
        accounts: {}
    };

    //  process a guid into the result
    function UserObject(guid) {

        //  verify and dedup
        if ( setuptools.data.accounts.accounts[guid] && typeof result.accounts[guid] === 'undefined' ) {

            //  if enabled is specified we'll only show accounts matching this value
            if ( typeof result.meta.terms.enabled === 'undefined' || (typeof result.meta.terms.enabled === 'boolean' && result.meta.terms.enabled === setuptools.data.accounts.accounts[guid].enabled) ) {

                result.meta.results++;
                result.accounts[guid] = {
                    enabled: setuptools.data.accounts.accounts[guid].enabled,
                    group: setuptools.data.accounts.accounts[guid].group
                };

            }

        } else if ( typeof result.data[guid] === 'object' ) {

            result.meta.duplicates.count++;
            if ( result.meta.duplicates.list.indexOf(guid) === -1 ) result.meta.duplicates.list.push(guid);

        }

    }

    //  id is a group
    if ( typeof id === 'string' && setuptools.data.groups[id] ) {

        //  groups not yet supported

        //  id is a username
    } else if ( typeof id === 'string' && (setuptools.data.accounts.accounts[id] || setuptools.data.accounts.accounts[id]) ) {

        UserObject(id);

        //  list all users
    } else if ( typeof id === 'undefined' || id === false ) {

        //  this feature is not supported if setuptools isn't in use
        if ( setuptools.app.config.determineFormat(setuptools.data.accounts) === 1 ) {

            for ( var guid in setuptools.data.accounts.accounts )
                if ( setuptools.data.accounts.accounts.hasOwnProperty(guid) )
                    UserObject(guid);

        } else setuptools.lightbox.error('ListUsers only supports users migrated to SetupTools.', 26);

    }

    return result;

};

//  create a new account configuration object
setuptools.app.config.create = function(accountConfig, format) {

    format = Number(format);
    var accountData = {};

    //  currently the only format, but this could change in the future
    if ( format === 1 ) {

        if ( setuptools.app.config.validateFormat(accountConfig, 0) === true ) {

            accountData = {meta: {created: Date.now(), modified: Date.now(), format: 1, version: 1}, accounts: {}};
            for (var i in accountConfig)
                if (accountConfig.hasOwnProperty(i))
                    accountData.accounts[i] = setuptools.app.config.createUser(i, accountConfig[i], true, 0, false, 'return', 1);

        } else {
            setuptools.lightbox.error("The supplied account configuration was invalid.", 8);
            return;
        }

    } else {
        setuptools.lightbox.error('Requested configuration format ' + format + ' does not exist.', 9);
        return;
    }

    return accountData;

};

//  generate a usable accounts.js file
setuptools.app.config.generateAccountsJS = function(accountConfig) {

    if ( typeof accountConfig === 'undefined' ) accountConfig = setuptools.data.accounts;

    //  load relevant user configuration into accounts.js export
    var rest = '';
    var keys = {
        rowlength: setuptools.data.config.rowlength,
        testing: setuptools.data.config.testing,
        prices: setuptools.data.config.prices,
        mulelogin: setuptools.data.config.mulelogin,
        nomasonry: setuptools.data.config.nomasonry,
        accountLoadDelay: setuptools.data.config.accountLoadDelay,
        debugging: setuptools.data.config.debugging
    };
    for ( var i in keys )
        rest += '\n' + i + ' = ' + keys[i] + ';';

    return btoa('accounts = ' + JSON.stringify(setuptools.app.config.convert(accountConfig, 0), null, 4) + rest + '\n');

};

//  display an error when the config fails to save to local storage
setuptools.app.config.saveError = function() {

    var AccountsJS = setuptools.app.config.generateAccountsJS(setuptools.data.accounts);
    setuptools.lightbox.build('saveerror', ' \
            Warning: Failed to save configuration to local storage. \
            <br><br>You may continue using Muledump but you will need to save the accounts.js file to the Muledump folder. \
            <br><br><span class="setuptools config download acknowledge">Right click and choose \'Save link as...\' to download.</span> \
            <br><br><a download="accounts.js" href="data:text/json;base64,' + AccountsJS + '" class="setuptools config download">Download accounts.js</a> \
        ');
    setuptools.lightbox.display('saveerror', {closeOnClick: 'background', closeIcon: '&#10005;', otherClose: null});
    setuptools.app.config.downloadAck();

};

//  save the current configuration
setuptools.app.config.save = function() {

    //  seems reasonable
    if ( setuptools.state.error === false && setuptools.config.devForcePoint != 'config-save' ) {

        //  new users importing their accountsjs
        if ( setuptools.app.config.determineFormat(setuptools.data.accounts) === 0 && !setuptools.storage.read('configuration') ) setuptools.data.accounts = setuptools.app.config.create(setuptools.data.accounts, '1');

        //  update metadata
        setuptools.data.accounts.meta.modified = Date.now();
        setuptools.data.accounts.meta.version++;

        //  try to write the configuration
        return setuptools.storage.write('configuration', JSON.stringify(setuptools.data));

    } else {
        return false;
    }

};
