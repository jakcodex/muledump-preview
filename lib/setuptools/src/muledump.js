//
//  settings and things inside muledump / separate from mainland setuptools
//

//  provide a warning button for an account when problems are detected
setuptools.app.muledump.warnData = function(Mule, name, data) {


    if ( !setuptools.tmp.warnData ) setuptools.tmp.warnData = {guid: {}};

    if ( !setuptools.tmp.warnData[Mule.guid] ) {

        setuptools.tmp.warnData[Mule.guid] = {problems: {}};

        //  add the icon to the dom
        setuptools.tmp.warnData[Mule.guid].dom = $('<div class="button" title="Error in Account Data">').text('?');
        setuptools.tmp.warnData[Mule.guid].dom.prependTo(Mule.dom);

        //  capture clicks on the icon
        setuptools.tmp.warnData[Mule.guid].dom.click(function() {

            setuptools.lightbox.build('muledump-warnData', 'Unusual account data was detected. The following items failed to process:');

            for ( var i in setuptools.tmp.warnData[Mule.guid].problems )
                if ( setuptools.tmp.warnData[Mule.guid].problems.hasOwnProperty(i) )
                    setuptools.lightbox.build('muledump-warnData', ' \
                        <br><br><strong class="problem">' + i + '</strong> \
                        <br>' + setuptools.tmp.warnData[Mule.guid].problems[i].join(', ') + ' \
                    ');

            setuptools.lightbox.build('muledump-warnData', ' \
                <br><br><strong>What can you do?</strong> \
                <br>Try reloading that account\'s data from Deca servers. This sort of problem can happen briefly and fix itself. \
                <br><br>If this account is causing issues loading your other accounts, disable it in <a href="#" class="setuptools link accountsManager">Accounts Manager</a> for now. \
            ');

            setuptools.lightbox.settitle('muledump-warnData', 'Account Data Problems');
            setuptools.lightbox.display('muledump-warnData', {variant: 'setuptools-medium'});

            $('strong.problem').css('text-transform', 'capitalize');

            $('.setuptools.link.accountsManager').click(setuptools.app.accounts.manager);

        });


    }

    if ( typeof setuptools.tmp.warnData[Mule.guid].problems[name] === 'undefined' ) setuptools.tmp.warnData[Mule.guid].problems[name] = [];
    setuptools.tmp.warnData[Mule.guid].problems[name].push(data);


};

//  deduplicate and validate custom character id list
setuptools.app.muledump.chsortcustomDedupAndValidate = function(CustomList, mule) {

    //  get our list of char ids
    var FinalList = [];
    var CharIdList = [];
    var DuplicateList = [];
    var RemovedList = [];
    CustomList = CustomList.replace('#', '').split(/, ?/);

    //  generate the character id list
    for ( var i = 0; i < mule.data.query.results.Chars.Char.length; i++ ) CharIdList.push(mule.data.query.results.Chars.Char[i].id);

    //  validate and deduplicate
    for ( var i in CustomList ) {

        if ( CustomList.hasOwnProperty(i) ) {

            //  is it a valid id
            if ( CharIdList.indexOf(CustomList[i]) === -1 ) {
                if ( typeof CustomList[i] === 'string' ) RemovedList.push(JSON.parse(JSON.stringify(CustomList[i])));
                delete CustomList[i];
            }

            //  is it already in the list
            if ( DuplicateList.indexOf(CustomList[i]) > -1) {
                if ( typeof CustomList[i] === 'string' ) RemovedList.push(JSON.parse(JSON.stringify(CustomList[i])));
                delete CustomList[i];
            } else {
                if ( typeof CustomList[i] === 'string' ) DuplicateList.push(JSON.parse(JSON.stringify(CustomList[i])));
            }

        }

    }

    //  clean up our final list
    for ( var i in CustomList )
        if ( CustomList.hasOwnProperty(i) )
            if ( typeof CustomList[i] === 'string' )
                FinalList.push(CustomList[i]);

    return {FinalList: FinalList, RemovedList: RemovedList};

};

//  assist the user in creating a custom sort list
setuptools.app.muledump.chsortcustom = function(mule) {

    if ( !mule ) setuptools.lightbox.error('No mule provided to custom sort utility.');

    //  prepare the object is none exists
    if ( typeof setuptools.data.muledump.chsortcustom.accounts[mule.guid] === 'undefined' ) setuptools.data.muledump.chsortcustom.accounts[mule.guid] = {active: '', data: {}};

    setuptools.lightbox.build('muledump-chsortcustom-index', ' \
        Saving a list will set that list as active and overwrite any stored data for that list or create a new list item. \
        <br><br><strong>For account :</strong><span style="font-weight: bold;">:</span> ' + mule.guid + ' \
        ' + ( (
            setuptools.state.loaded === true &&
            typeof setuptools.data.accounts.accounts[mule.guid].ign === 'string' &&
            setuptools.data.accounts.accounts[mule.guid].ign.length > 0
            ) ? '<br><strong>IGN :</strong><span style="font-weight: bold;">:</span> ' + setuptools.data.accounts.accounts[mule.guid].ign + '</span>' : '' ) + '\
        <br><br><strong>Choose Existing List</strong> \
        <br>\
        <div class="setuptools app"> \
    ');

    //  build our select menu
    if ( Object.keys(setuptools.data.muledump.chsortcustom.accounts[mule.guid].data).length > 0 ) {

        setuptools.lightbox.build('muledump-chsortcustom-index', ' \
                <br><select name="chsortExisting" class="setuptools app nomargin"> \
        ');

        //  loop thru data
        for ( var i in setuptools.data.muledump.chsortcustom.accounts[mule.guid].data )
            if ( setuptools.data.muledump.chsortcustom.accounts[mule.guid].data.hasOwnProperty(i) )
                setuptools.lightbox.build('muledump-chsortcustom-index', ' \
                    <option value="' + i + '" ' + ( (setuptools.data.muledump.chsortcustom.accounts[mule.guid].active === i) ? 'selected' : '' ) + '>' + i + '</option> \
                ');

        setuptools.lightbox.build('muledump-chsortcustom-index', ' \
                </select> \
        ');

    } else {

        setuptools.lightbox.build('muledump-chsortcustom-index', 'No saved lists found');

    }

    setuptools.lightbox.build('muledump-chsortcustom-index', ' \
            <br><br><strong>List Name to Edit</strong> \
            <br><br><input name="chsortListName" class="setuptools app nomargin" value="' + setuptools.data.muledump.chsortcustom.accounts[mule.guid].active + '"> \
        </div>\
        <br><strong>Prepare List</strong> \
        <br><br>Enter a list of IDs separated by commas. \
        <br><br><input type="text" name="chsortcustom" class="setuptools app wideinput" value="' + ( ( setuptools.data.muledump.chsortcustom.accounts[mule.guid].active.length > 0 ) ? setuptools.data.muledump.chsortcustom.accounts[mule.guid].data[setuptools.data.muledump.chsortcustom.accounts[mule.guid].active].join(', ') : '' ) + '"> \
        <br><br> \
        <div>\
            <div class="setuptools link muledump save list nomargin cfleft menuStyle">Save List</div> \
            <div class="setuptools link muledump save delete nomargin destroy action noclose menuStyle negative cfright">Delete List</div> \
        </div> \
    ');

    setuptools.lightbox.settitle('muledump-chsortcustom-index', 'Character Sorting Lists');
    setuptools.lightbox.drawhelp('muledump-chsortcustom-index', 'docs/features/character-sorting', 'Character Sorting Lists Help');
    setuptools.lightbox.display('muledump-chsortcustom-index');

    //  populate selected data
    $('select[name="chsortExisting"]').change(function() {

        var chsortId = $(this).val();
        $('input[name="chsortListName"]').val(chsortId);
        $('input[name="chsortcustom"]').val(setuptools.data.muledump.chsortcustom.accounts[mule.guid].data[chsortId].join(', '));

    });

    $('.setuptools.link.muledump.save.delete').click(function() {

        var chsortId = $('input[name="chsortListName"]').val();
        if ( chsortId.length === 0 ) return;
        if ( typeof setuptools.data.muledump.chsortcustom.accounts[mule.guid].data[chsortId] === 'undefined' ) return;

        //  delete the list
        delete setuptools.data.muledump.chsortcustom.accounts[mule.guid].data[chsortId];

        //  set default value to top key
        var newChsortId = Object.keys(setuptools.data.muledump.chsortcustom.accounts[mule.guid].data)[0];
        if ( setuptools.data.muledump.chsortcustom.accounts[mule.guid].active === chsortId )
            setuptools.data.muledump.chsortcustom.accounts[mule.guid].active = (typeof newChsortId === 'undefined' ) ? '' : newChsortId;

        //  save the changes
        setuptools.app.config.save('CharacterSort/Delete');

        //  update the form
        $('select[name="chsortExisting"] option[value="' + chsortId + '"]').remove();
        if ( typeof newChsortId === 'string' ) {

            $('select[name="chsortExisting"] option[value="' + newChsortId + '"]').prop('selected', 'selected');
            $('input[name="chsortListName"]').val(newChsortId);
            $('input[name="chsortcustom"]').val(setuptools.data.muledump.chsortcustom.accounts[mule.guid].data[newChsortId].join(', '));

        }

    });

    //  save changes to a list or new list
    $('.setuptools.link.muledump.save.list').click(function() {

        var UserListName = $('input[name="chsortListName"]').val();
        var UserInput = $('input[name="chsortcustom"]').val();
        var Lists = false;
        if ( UserInput.length > 0 ) Lists = setuptools.app.muledump.chsortcustomDedupAndValidate(UserInput, mule);
        var SaveState = false;

        //  save the list if it's at least 1 long
        if ( typeof Lists === 'object' && Lists.FinalList.length > 0 ) {

            setuptools.data.muledump.chsortcustom.accounts[mule.guid].active = UserListName;
            setuptools.data.muledump.chsortcustom.accounts[mule.guid].data[UserListName] = $.extend(true, [], Lists.FinalList);
            SaveState = setuptools.app.config.save('CharacterSort/Save');
            if ( setuptools.config.devForcePoint !== 'chsortcustom-save' && SaveState === true ) {

                if ( Lists.RemovedList.length > 0 ) setuptools.lightbox.build('muledump-chsortcustom-save', 'The follow IDs were invalid or duplicates: <br><br>' + Lists.RemovedList.join(', ') + '<br><br>');
                setuptools.lightbox.build('muledump-chsortcustom-save', 'The changes have been saved.');
                mule.query(false, true);

            }

        } else {

            //  if no list is provided then we're erasing this instead
            if ( UserInput.length === 0 ) {

                setuptools.lightbox.build('muledump-chsortcustom-save', 'Choose \'Delete List\' to remove a list.');

            } else {

                setuptools.lightbox.build('muledump-chsortcustom-save', 'Oops! No valid account IDs were detected.');

            }

            setuptools.lightbox.build('muledump-chsortcustom-save', ' \
                <br><br>Valid formats include: \
                <br><br><span style="margin-right: 20px; margin-top: 20px;">1, 2, 3, 4, ...</span> \
                <br><br><span style="margin-right: 20px; margin-top: 20px;">1,2,3,4,...</span> \
                <br><br><span style="margin-right: 20px; margin-top: 20px;">#1,#2,#3,#4,...</span> \
                <br><br><span style="margin-right: 20px; margin-top: 20px;">1, #2, 3,#4, ...</span> \
                <br><br>You get the idea. \
            ');

        }

        if ( SaveState === false ) setuptools.lightbox.build('muledump-chsortcustom-save', 'Hmm, there was a problem saving. This setting will reset on page reload.');
        setuptools.lightbox.goback('muledump-chsortcustom-save', function() {
            setuptools.app.muledump.chsortcustom(mule);
        });
        setuptools.lightbox.settitle('muledump-chsortcustom-save', 'Character Sorting Lists');
        setuptools.lightbox.display('muledump-chsortcustom-save');


    });

};

//  binds the item tooltip to all item divs
setuptools.app.muledump.tooltip = function($i, classes) {

    //  select all items
    if ( !item ) $i = $('.item');

    //  item mouseenter events
    $i.off('mouseenter.muledump.tooltip').on('mouseenter.muledump.tooltip', function(e) {

        if ( e.ctrlKey === true ) return;
        var self = this;
        var id = +$(self).attr('data-itemId');
        var ItemData = items[id];
        if ( typeof ItemData !== 'object' || ItemData[0] === 'Empty Slot' ) return;

        //  tooltip popup
        clearTimeout(setuptools.tmp.tstateOpen);
        setuptools.tmp.tstateOpen = setTimeout(function() {
            if ( typeof ItemData !== 'object' || ItemData[0] === 'Empty Slot' ) return;

            //  build tooltip data
            //  three columns: [ bagTypeImage ] [ item name/feed power ] [ tier/fame bonus ]
            var html = '';

            //  poorman's bagType constants
            var bagPosition = '0px 0px';
            if ( ItemData[7] === 1 ) bagPosition = '-26px -0px';
            if ( ItemData[7] === 2 ) bagPosition = '-52px -0px';
            if ( ItemData[7] === 3 ) bagPosition = '-78px -0px';
            if ( ItemData[7] === 4 ) bagPosition = '-26px -26px';
            if ( ItemData[7] === 5 ) bagPosition = '-52px -26px';
            if ( ItemData[7] === 6 ) bagPosition = '-26px -52px';
            if ( ItemData[7] === 7 ) bagPosition = '-0px -26px';
            if ( ItemData[7] === 8 ) bagPosition = '-78px -26px';
            if ( ItemData[7] === 9 ) bagPosition = '-0px -52px';

            //  column one
            html += ' \
                <div class="cfleft ignore"> \
                    <div class="bagType" style="background-position: ' + bagPosition + ';">&nbsp;</div> \
                </div>\
            ';

            //  column two
            html += ' \
            <div class="fleft"> \
                ' + ItemData[0] + ( ( ItemData[8] === true ) ? '<span class="tooltip generic text" style="margin-left: 2px;"> (SB)</span>' : '' ) + ' \
                ' + ( (ItemData[6]) ? '<br><span class="tooltip feed">Feed Power: ' + ItemData[6] + '</span>' : '' ) + '\
            </div>\
        ';

            //  column three
            var tier = '';
            if ( ItemData[2] > -1 && ItemData[1] !== 10 ) tier += '<span class="tooltip tiered">T' + ItemData[2] + '</span>';
            if ( ItemData[9] === 1 && ItemData[1] !== 10 ) tier += '<span class="tooltip ut">UT</span>';
            if ( ItemData[9] === 2 ) tier += '<span class="tooltip st">ST</span>';
            var c2Margin = ( tier.length > 0 ) ? ' margin-left: 15px;' : '';
            html += ' \
                <div class="fleft" style="clear: right;' + c2Margin + '"> \
                    ' + tier + ' \
                    ' + ( ( ItemData[5] ) ? '<br><span class="tooltip generic text">Fame Bonus:</span> <span class="tooltip famebonus value">' + ItemData[5] + '%</span>' : '' ) + ' \
                </div>\
            ';

            setuptools.lightbox.tooltip(self, html, {classes: classes});
        }, setuptools.data.config.tooltip);

        //  search context menu
        /*$(this).contextmenu(function(e) {

            e.preventDefault();

            //  display the menu
            if ( !setuptools.tmp.contextMenuOpen || typeof setuptools.tmp.contextMenuOpen['tooltip-menu'] === 'undefined' ) {

                //  base info
                var position = $(self);
                var options = [
                    {
                        option: 'pos',
                        vpx: 45
                    },
                    {
                        option: 'header',
                        value: 'Item Menu'
                    },
                    {
                        class: 'gotoRealmeye',
                        name: 'Open in Realmeye',
                        callback: function() {
                            console.log('gotoRealmeye');
                        }
                    }
                ];

                setuptools.lightbox.menu.context.create('tooltip-menu', false, position, options, self);
                $('div.setuptools.menu').mouseenter(function() {
                    clearInterval(setuptools.tmp.tstateMenuClose);
                });

                $('div.setuptools.menu').mouseleave(function() {
                    clearInterval(setuptools.tmp.tstateMenuClose);
                    setuptools.tmp.tstateMenuClose = setTimeout(function() {
                        setuptools.lightbox.menu.context.close('tooltip-menu');
                    }, 500);
                });

            } else {

                setuptools.lightbox.menu.context.close();

            }

        });*/

    });

    //  close the tooltip, cancel the load delay, or close context menu
    $i.off('mouseleave').on('mouseleave', function(e) {

        clearInterval(setuptools.tmp.findPosition);
        $(this).unbind('contextmenu');
        setuptools.tmp.tstateMenuClose = setTimeout(function() {
            setuptools.lightbox.menu.context.close('tooltip-menu');
        }, 500);
        clearTimeout(setuptools.tmp.tstateOpen);
        $('.tooltip').remove();

    });

};

//  add an item to the notice button
setuptools.app.muledump.notices.add = function(title, callback, argList) {

    var queue = setuptools.app.muledump.notices.queue;
    var modifiers = {};
    if ( typeof argList === 'object' && Array.isArray(argList) === false ) {

        modifiers = $.extend(true, {}, argList);
        argList = modifiers.argList;

    }

    //  search for and deduplicate incoming entries
    if ( queue.find(function(object) {
            return object.title === title;
    }) ) return;

    //  adjust the argList to meet our format
    if ( typeof argList === 'undefined' ) argList = [];
    if ( Array.isArray(argList) === false ) argList = [argList];

    //  add the entry to the queue
    queue.push({
        index: queue.length,
        title: title,
        callback: callback,
        argList: argList,
        modifiers: modifiers
    });

    window.techlog('Notice: ' + title, 'force');

};

//  check for new notices and display them
setuptools.app.muledump.notices.monitor = function() {

    if ( typeof setuptools.tmp.noticesMonitorMax !== 'number' ) setuptools.tmp.noticesMonitorMax = 0;
    if ( setuptools.tmp.noticesMonitorInterval ) clearInterval (setuptools.tmp.noticesMonitorInterval);
    setuptools.tmp.noticesMonitorAge = 0;
    setuptools.tmp.noticesMonitorInterval = setInterval(function() {

        //  if the queue grows we'll update the system
        var queue = setuptools.app.muledump.notices.queue;
        if ( queue.length > setuptools.tmp.noticesMonitorMax ) {

            setuptools.tmp.noticesMonitorMax = queue.length;
            setuptools.app.muledump.notices.display();

        }

        //  don't run indefinitely
        setuptools.tmp.noticesMonitorAge++;
        if ( setuptools.tmp.noticesMonitorAge > setuptools.config.noticesMonitorMaxAge ) clearInterval(setuptools.tmp.noticesMonitorInterval);

    }, 1000);

};

setuptools.app.muledump.notices.remove = function(queuePos) {

    var noticeDom = $('#notice');
    setuptools.app.muledump.notices.queue.splice(queuePos, 1);
    if ( setuptools.app.muledump.notices.queue.length === 0 ) noticeDom.fadeOut(1000, function() {
        $(this).remove();
    })

};

//  build and display the notice button
setuptools.app.muledump.notices.display = function(queuePos) {

    //  do nothing if the queue is empty
    var queue = setuptools.app.muledump.notices.queue;
    if ( queue.length === 0 ) return;

    //  search for notify button class overrides
    var classOrder = ['notifyPulse', 'rateLimited'];
    var notifyClass = 'notifyPulse';
    var modifiers = {};
    for ( var i = 0; i < queue.length; i++ )
        if (
            typeof queue[i].modifiers === 'object'
        ) {

            //  determine if this queue object has priority modifiers
            if (
                typeof queue[i].modifiers.notifyClass === 'string' &&
                classOrder.indexOf(queue[i].modifiers.notifyClass) > classOrder.indexOf(notifyClass)
            ) notifyClass = queue[i].modifiers.notifyClass;

            //  if this matches the newly selected class or if no class has been selected then use these modifiers
            if ( classOrder.indexOf(notifyClass) === 0 || notifyClass === queue[i].modifiers.notifyClass ) modifiers = queue[i].modifiers;

        }

    //  build the context menu
    var noticeDom = $('#notice');
    noticeDom.unbind('click').click(function() {

        //  close the menu if it is already open
        if ( setuptools.lightbox.menu.context.isOpen('notices') === true ) {

            setuptools.lightbox.menu.context.close();
            return;

        }

        //  build menu options
        var options = [
            {
                option: 'pos',
                vpx: noticeDom.outerHeight(true)+4
            },
            {
                option: 'css',
                css: {
                    "width": '284px',
                    "background-color": '#2c2c2c'
                }
            },
            {
                option: 'skip',
                value: 'reposition'
            },
            {
                option: 'hover',
                action: 'close'
            }
        ];

        if ( typeof modifiers.menuClass === 'string' ) options.push({
            option: 'class',
            value: modifiers.menuClass
        });

        for ( var i = 0; i < queue.length; i++ ) options.push({
            class: 'notice-' + i,
            name: queue[i].title,
            callback: function(input) {
                input[0].apply(undefined, input[1]);
            },
            callbackArg: [queue[i].callback, queue[i].argList]
        });

        options.push({
            class: 'close',
            name: 'Close'
        });

        //  create the context menu
        setuptools.lightbox.menu.context.create('notices', false, noticeDom, options);

    });

    //  display the button
    noticeDom.addClass(notifyClass).show();

};

//  generate an image of the specified dom
setuptools.app.muledump.canvas = function(dom) {

    setuptools.tmp.canvasWait = true;
    setuptools.lightbox.build('canvas-loading', 'Please wait...');
    setuptools.lightbox.settitle('canvas-loading', 'Generating Image');
    setuptools.lightbox.display('canvas-loading', {
        afterClose: function() { setuptools.tmp.canvasWait = false; },
        closeSpeed: 0
    });

    html2canvas(dom).then(function(canvas) {

        if ( setuptools.tmp.canvasWait === true ) {

            setuptools.lightbox.close('canvas-loading');
            setuptools.lightbox.build('canvas-display', 'Right click and choose "Save image as..." <br><br><div id="html2canvas"></div>');
            setuptools.lightbox.settitle('canvas-display', 'Mule Image');
            setuptools.lightbox.display('canvas-display', {
                variant: 'setuptools-large',
                openSpeed: 0
            });
            $('#html2canvas').append(canvas);
            setuptools.app.ga('send', 'event', {
                eventCategory: 'detect',
                eventAction: 'export-html2canvas'
            });

        }

        //  rip all those cpu cycles if they closed the loading window

    });

};

/* AffaSearch(TM) */
setuptools.app.muledump.pagesearch = {
    state: {
        list: []
    }
};

//  prepare the account search menu
setuptools.app.muledump.pagesearch.init = function() {

    //  generate a PageList of account guids and igns
    var Accounts = ( setuptools.app.config.determineFormat(setuptools.data.accounts) === 0 ) ? window.accounts : setuptools.data.accounts.accounts;
    for ( var guid in Accounts ) {

        if ( Accounts.hasOwnProperty(guid) ) {

            setuptools.app.muledump.pagesearch.state.list.push({
                username: guid,
                ign: ( (Accounts[guid].ign) ? Accounts[guid].ign : undefined )
            });

        }

    }

    //  create pagination object
    setuptools.app.muledump.pagesearch.paginate = new setuptools.lightbox.menu.paginate.create(
        setuptools.app.muledump.pagesearch.state.list,
        undefined,
        'pagesearch',
        undefined,
        undefined,
        undefined,
        {
            search: {
                container: 'div#top',
                keys: ['ign', 'username'],
                keyup: true,
                execute: setuptools.app.muledump.pagesearch.execute,
                skip: ['reposition'],
                channel: {
                    keyup: setuptools.app.muledump.quickUserAdd
                },
                context: function(self, e) {

                    e.preventDefault();
                    setuptools.app.muledump.mulemenu(e, $(self).text(), undefined, $('div#pagesearch'), {
                        top:[{
                            option: 'header',
                            value: $(self).text()
                        }],
                    });

                }
            }
        }
    );

    setuptools.app.muledump.pagesearch.bind();

};

//  display the advanced totals menu
setuptools.app.muledump.totalsmenuAdvanced = function(track, page) {

    console.log('tmA', track, page);
    if ( !(track instanceof jQuery) ) track = $('#totalsMenu');
    setuptools.lightbox.menu.context.close('totalsmenuAdvanced');
    var options = [
        {
            option: 'hover',
            action: 'close'
        },
        {
            option: 'skip',
            value: 'reposition'
        },
        {
            option: 'afterClose',
            callback: setuptools.app.muledump.totalsmenuAdvanced,
            callbackArg: [track, page]
        },
        {
            option: 'css',
            css: {
                width: '177px',
                position: 'fixed'
            }
        },
        {
            option: 'class',
            value: 'smallMenuCells'
        },
        {
            option: 'customPos',
            vpx: track[0].offsetTop,
            hpx: track[0].offsetLeft
        },
        {
            option: 'pos',
            h: 'left',
            v: 'top',
            vpx: 28
        },
        {
            class: 'goBack',
            name: 'Go back...',
            callback: setuptools.app.muledump.totalsmenu,
            override: 'afterClose'
        },
        {
            class: 'goBack',
            name: 'Basic Filters...',
            callback: setuptools.app.muledump.totalsmenuBasic,
            override: 'afterClose'
        },
        {
            option: 'header',
            value: 'Weapons',
            class: 'openTotalWeaponsMenu',
            callback: function(args) {
                setuptools.app.muledump.totalsmenuAdvanced(args.track, args.page);
            },
            callbackArg: {track: track, page: 'weapons'},
            override: 'afterClose'
        }
    ];

    /*var tmp = {};
    tmp.weapons = [100003, 100002, 100024, 100017, 100001, 100008];
    for ( x = 0; x < tmp.weapons.length; x++ )options.push(
        {
            class: 'toggleTypes' + somevar[tmp.weapons[x]].name,
            name: ( (setuptools.data.options['totalsTypes' + somevar[tmp.weapons[x]].name] === true) ? 'Hide' : 'Show' ) + ' ' + somevar[tmp.weapons[x]].name,
            callback: setuptools.app.muledump.toggleoption,
            callbackArg: 'totalsTypes' + somevar[tmp.weapons[x]].name
        }
    );*/

    if ( page === 'weapons' ) options.push(
        {
            class: 'toggleTypesBows',
            name: ( (setuptools.data.options.totalsTypesBows === true) ? 'Hide' : 'Show' ) + ' Bows',
            callback: setuptools.app.muledump.toggleoption,
            callbackArg: 'totalsTypesBows'
        },
        {
            class: 'toggleTypesDaggers',
            name: ( (setuptools.data.options.totalsTypesDaggers === true) ? 'Hide' : 'Show' ) + ' Daggers',
            callback: setuptools.app.muledump.toggleoption,
            callbackArg: 'totalsTypesDaggers'
        },
        {
            class: 'toggleTypesKatanas',
            name: ( (setuptools.data.options.totalsTypesKatanas === true) ? 'Hide' : 'Show' ) + ' Katanas',
            callback: setuptools.app.muledump.toggleoption,
            callbackArg: 'totalsTypesKatanas'
        },
        {
            class: 'toggleTypesStaves',
            name: ( (setuptools.data.options.totalsTypesStaves === true) ? 'Hide' : 'Show' ) + ' Staves',
            callback: setuptools.app.muledump.toggleoption,
            callbackArg: 'totalsTypesStaves'
        },
        {
            class: 'toggleTypesSwords',
            name: ( (setuptools.data.options.totalsTypesSwords === true) ? 'Hide' : 'Show' ) + ' Swords',
            callback: setuptools.app.muledump.toggleoption,
            callbackArg: 'totalsTypesSwords'
        },
        {
            class: 'toggleTypesWands',
            name: ( (setuptools.data.options.totalsTypesWands === true) ? 'Hide' : 'Show' ) + ' Wands',
            callback: setuptools.app.muledump.toggleoption,
            callbackArg: 'totalsTypesWands'
        }
    );

    options.push({
        option: 'header',
        value: 'Abilities',
        class: 'openTotalAbilitiesMenu',
        callback: function(args) {
            setuptools.app.muledump.totalsmenuAdvanced(args.track, args.page);
        },
        callbackArg: {track: track, page: 'abilities'},
        override: 'afterClose'
    });

    if ( page === 'abilities' ) options.push(
        {
            class: 'toggleTypesHelms',
            name: ( (setuptools.data.options.totalsTypesHelms=== true) ? 'Hide' : 'Show' ) + ' Helms',
            callback: setuptools.app.muledump.toggleoption,
            callbackArg: 'totalsTypesHelms'
        },
        {
            class: 'toggleTypesOrbs',
            name: ( (setuptools.data.options.totalsTypesOrbs === true) ? 'Hide' : 'Show' ) + ' Orbs',
            callback: setuptools.app.muledump.toggleoption,
            callbackArg: 'totalsTypesOrbs'
        },
        {
            class: 'toggleTypesPoisons',
            name: ( (setuptools.data.options.totalsTypesPoisons === true) ? 'Hide' : 'Show' ) + ' Poisons',
            callback: setuptools.app.muledump.toggleoption,
            callbackArg: 'totalsTypesPoisons'
        },
        {
            class: 'toggleTypesPrisms',
            name: ( (setuptools.data.options.totalsTypesPrisms === true) ? 'Hide' : 'Show' ) + ' Prisms',
            callback: setuptools.app.muledump.toggleoption,
            callbackArg: 'totalsTypesPrisms'
        },
        {
            class: 'toggleTypesQuivers',
            name: ( (setuptools.data.options.totalsTypesQuivers === true) ? 'Hide' : 'Show' ) + ' Quivers',
            callback: setuptools.app.muledump.toggleoption,
            callbackArg: 'totalsTypesQuivers'
        },
        {
            class: 'toggleTypesScepters',
            name: ( (setuptools.data.options.totalsTypesScepters === true) ? 'Hide' : 'Show' ) + ' Scepters',
            callback: setuptools.app.muledump.toggleoption,
            callbackArg: 'totalsTypesScepters'
        },
        {
            class: 'toggleTypesSeals',
            name: ( (setuptools.data.options.totalsTypesSeals === true) ? 'Hide' : 'Show' ) + ' Seals',
            callback: setuptools.app.muledump.toggleoption,
            callbackArg: 'totalsTypesSeals'
        },
        {
            class: 'toggleTypesShields',
            name: ( (setuptools.data.options.totalsTypesShields === true) ? 'Hide' : 'Show' ) + ' Shields',
            callback: setuptools.app.muledump.toggleoption,
            callbackArg: 'totalsTypesShields'
        },
        {
            class: 'toggleTypesSkulls',
            name: ( (setuptools.data.options.totalsTypesSkulls === true) ? 'Hide' : 'Show' ) + ' Skulls',
            callback: setuptools.app.muledump.toggleoption,
            callbackArg: 'totalsTypesSkulls'
        },
        {
            class: 'toggleTypesSpells',
            name: ( (setuptools.data.options.totalsTypesSpells === true) ? 'Hide' : 'Show' ) + ' Spells',
            callback: setuptools.app.muledump.toggleoption,
            callbackArg: 'totalsTypesSpells'
        },
        {
            class: 'toggleTypesStars',
            name: ( (setuptools.data.options.totalsTypesStars === true) ? 'Hide' : 'Show' ) + ' Stars',
            callback: setuptools.app.muledump.toggleoption,
            callbackArg: 'totalsTypesStars'
        },
        {
            class: 'toggleTypesTomes',
            name: ( (setuptools.data.options.totalsTypesTomes === true) ? 'Hide' : 'Show' ) + ' Tomes',
            callback: setuptools.app.muledump.toggleoption,
            callbackArg: 'totalsTypesTomes'
        },
        {
            class: 'toggleTypesTraps',
            name: ( (setuptools.data.options.totalsTypesTraps === true) ? 'Hide' : 'Show' ) + ' Traps',
            callback: setuptools.app.muledump.toggleoption,
            callbackArg: 'totalsTypesTraps'
        }
    );

    options.push({
        option: 'header',
        value: 'Armor',
        class: 'openTotalArmorMenu',
        callback: function(args) {
            setuptools.app.muledump.totalsmenuAdvanced(args.track, args.page);
        },
        callbackArg: {track: track, page: 'armor'},
        override: 'afterClose'
    });

    if ( page === 'armor' ) options.push(
        {
            class: 'toggleTypesCloaks',
            name: ( (setuptools.data.options.totalsTypesCloaks === true) ? 'Hide' : 'Show' ) + ' Cloaks',
            callback: setuptools.app.muledump.toggleoption,
            callbackArg: 'totalsTypesCloaks'
        },
        {
            class: 'toggleTypesHeavyArmor',
            name: ( (setuptools.data.options.totalsTypesHeavyArmor === true) ? 'Hide' : 'Show' ) + ' Heavy Armor',
            callback: setuptools.app.muledump.toggleoption,
            callbackArg: 'totalsTypesHeavyArmor'
        },
        {
            class: 'toggleTypesLightArmor',
            name: ( (setuptools.data.options.totalsTypesLightArmor === true) ? 'Hide' : 'Show' ) + ' Light Armor',
            callback: setuptools.app.muledump.toggleoption,
            callbackArg: 'totalsTypesLightArmor'
        },
        {
            class: 'toggleTypesRobes',
            name: ( (setuptools.data.options.totalsTypesRobes === true) ? 'Hide' : 'Show' ) + ' Robes',
            callback: setuptools.app.muledump.toggleoption,
            callbackArg: 'totalsTypesRobes'
        }
    );

    options.push(
        {
            class: 'resetTotalsSettings',
            name: 'Reset Settings',
            callback: function() {
                console.log('resetting totals');
            },
            override: 'afterClose'
        }
    );

    setuptools.lightbox.menu.context.create('totalsmenuAdvanced', false, track, options);

};

//  display the item types totals menu
setuptools.app.muledump.totalsmenuBasic = function(track) {

    if ( !(track instanceof jQuery) ) track = $('#totalsMenu');
    setuptools.lightbox.menu.context.close('totalsmenuBasic');
    var options = [
        {
            option: 'hover',
            action: 'close'
        },
        {
            option: 'skip',
            value: 'reposition'
        },
        {
            option: 'afterClose',
            callback: setuptools.app.muledump.totalsmenuBasic
        },
        {
            option: 'class',
            value: 'smallMenuCells'
        },
        {
            option: 'css',
            css: {
                width: '177px',
                position: 'fixed'
            }
        },
        {
            option: 'customPos',
            vpx: track[0].offsetTop,
            hpx: track[0].offsetLeft
        },
        {
            option: 'pos',
            h: 'left',
            v: 'top',
            vpx: 28
        },
        {
            class: 'goBack',
            name: 'Go back...',
            callback: setuptools.app.muledump.totalsmenu,
            override: 'afterClose'
        },
        {
            class: 'goBack',
            name: 'Advanced Filters...',
            callback: setuptools.app.muledump.totalsmenuAdvanced,
            override: 'afterClose'
        },
        {
            option: 'header',
            value: 'Equipment'
        },
        {
            class: 'toggleTypesWeapons',
            name: ( (setuptools.data.options.totalsTypesWeapons === true) ? 'Hide' : 'Show' ) + ' Weapons',
            callback: setuptools.app.muledump.toggleoption,
            callbackArg: 'totalsTypesWeapons'
        },
        {
            class: 'toggleTypesAbilities',
            name: ( (setuptools.data.options.totalsTypesAbilities === true) ? 'Hide' : 'Show' ) + ' Abilities',
            callback: setuptools.app.muledump.toggleoption,
            callbackArg: 'totalsTypesAbilities'
        },
        {
            class: 'toggleTypesArmor',
            name: ( (setuptools.data.options.totalsTypesArmor === true) ? 'Hide' : 'Show' ) + ' Armor',
            callback: setuptools.app.muledump.toggleoption,
            callbackArg: 'totalsTypesArmor'
        },
        {
            class: 'toggleTypesRings',
            name: ( (setuptools.data.options.totalsTypesRings === true) ? 'Hide' : 'Show' ) + ' Rings',
            callback: setuptools.app.muledump.toggleoption,
            callbackArg: 'totalsTypesRings'
        },
        {
            option: 'header',
            value: 'Other Items'
        },
        {
            class: 'toggleTypesPotions',
            name: ( (setuptools.data.options.totalsTypesPotions === true) ? 'Hide' : 'Show' ) + ' Potions',
            callback: setuptools.app.muledump.toggleoption,
            callbackArg: 'totalsTypesPotions'
        },
        {
            class: 'toggleTypesKeys',
            name: ( (setuptools.data.options.totalsTypesKeys === true) ? 'Hide' : 'Show' ) + ' Keys',
            callback: setuptools.app.muledump.toggleoption,
            callbackArg: 'totalsTypesKeys'
        },
        {
            class: 'toggleTypesSkins',
            name: ( (setuptools.data.options.totalsTypesSkins === true) ? 'Hide' : 'Show' ) + ' Skins',
            callback: setuptools.app.muledump.toggleoption,
            callbackArg: 'totalsTypesSkins'
        },
        {
            class: 'toggleTypesTextiles',
            name: ( (setuptools.data.options.totalsTypesTextiles === true) ? 'Hide' : 'Show' ) + ' Dyes/Cloths',
            callback: setuptools.app.muledump.toggleoption,
            callbackArg: 'totalsTypesTextiles'
        },
        {
            class: 'toggleTypesEggs',
            name: ( (setuptools.data.options.totalsTypesEggs === true) ? 'Hide' : 'Show' ) + ' Eggs',
            callback: setuptools.app.muledump.toggleoption,
            callbackArg: 'totalsTypesEggs'
        },
        {
            class: 'resetTotalsSettings',
            name: 'Reset Settings',
            callback: function() {
                console.log('resetting totals');
            },
            override: 'afterClose'
        }
    ];

    setuptools.lightbox.menu.context.create('totalsmenuBasic', false, track, options);

};

//  display a menu for managing totals-related settings
setuptools.app.muledump.totalsmenuSettings = function() {

    setuptools.lightbox.close();
    setuptools.lightbox.build('totalsmenu-settings', ' \
        <div class="flex-container" style="flex-wrap: wrap;">\
    ');

    //  display the account filter info
    setuptools.lightbox.build('totalsmenu-settings', ' \
        <div class="w100 flex-container" style="justify-content: space-around;">\
            <div style="flex-basis: 233px; font-size: 14px;"><strong>Active Configuration Set</strong></div>\
            <div style="flex-basis: 201px;">\
                <select class="setuptools w100" name="totalsConfigSets">\
    ');

    Object.filter(setuptools.data.muledump.totals.configSets.settings, function(name, config) {
        var activeText = '';
        if ( setuptools.data.muledump.totals.configSets.active === name ) activeText = ' (active)';
        setuptools.lightbox.build('totalsmenu-settings', ' \
                        <option ' + ( (setuptools.data.muledump.totals.configSets.active === name) ? 'selected' : '' ) + ' value="' + name + '">' + name + activeText + '</option>\
        ');
    });

    var favClass = '';
    var favTitle = 'Click to Favorite';
    if ( setuptools.data.muledump.totals.configSets.favorites.indexOf(setuptools.data.muledump.totals.configSets.active) > -1 ) {
        favClass = 'selected';
        favTitle = 'Click to Unfavorite';
    }

    setuptools.lightbox.build('totalsmenu-settings', ' \
                </select>\
            </div>\
            <div class="flex-container noFlexAutoWidth" style="flex-basis: 326px; justify-content: flex-start; padding-left: 5px;">\
                <div class="setuptools link favorite noclose menuStyle flex-container ' + favClass + '" title="' + favTitle + '" style="background-color: initial; width: 26px; height: 26px"><span style="margin-top: -2px;">&#9733;</span></div>\
                <div class="setuptools link activateSet noclose menuStyle disabled truly menuTiny textCenter flex-container" style="width: 93px; height: 26px;">Active</div> \
                <div class="setuptools link reset noclose menuStyle menuTiny textCenter flex-container" style="width: 93px; height: 26px;">Reset</div> \
                <div class="setuptools link deleteSet noclose menuStyle menuTiny negative textCenter flex-container mr0" style="width: 93px; height: 26px;">Delete</div> \
            </div>\
        </div>\
        <div class="w100">&nbsp;</div>\
        <div class="w100 flex-container" style="justify-content: space-around;">\
            <div class="accountFilterList" style="flex-basis: 233px; font-size: 14px;"><strong>Create New Configuration Set</strong></div>\
            <div style="flex-basis: 201px;">\
                <input type="text" name="newConfigSetName" placeholder="New configuration set name..." class="setuptools w100">\
            </div>\
            <div class="flex-container noFlexAutoWidth" style="flex-basis: 326px; justify-content: flex-start; padding-left: 5px;">\
                <div class="setuptools link saveNewSet noclose menuStyle menuTiny positive textCenter flex-container" style="width: 130px; height: 26px;">Create</div>  \
            </div>\
        </div>\
        <div class="w100">&nbsp;</div>\
        <div class="w100 accountFilterList" style="justify-content: flex-start; font-size: 14px;"><strong>Active Account Filter Members</strong></div>\
        ' + ( (setuptools.data.muledump.totals.accountFilter.length === 0) ? '<div class="w100" style="justify-content: flex-start">No accounts in filter</div>' : '' ) + ' \
        <div class="w100 scrollbar flex-container" style="max-height: 264px; overflow-y: scroll; flex-wrap: wrap; " id="accountFilterList">\
    ');

    setuptools.data.muledump.totals.accountFilter.sort();
    setuptools.data.muledump.totals.accountFilter.filter(function(guid) {

        setuptools.lightbox.build('totalsmenu-settings', ' \
            <div>' + guid + '</div>\
        ');

    });

    setuptools.lightbox.build('totalsmenu-settings', ' \
        </div>\
        <div class="w100">&nbsp;</div>\
    ');

    //  display the hidden items filter info
    setuptools.lightbox.build('totalsmenu-settings', ' \
        <div class="w100" style="justify-content: flex-start; font-size: 14px;"><strong>Permanently Hidden Items</strong></div>\
        ' + ( ( setuptools.data.muledump.totals.itemFilter.length === 0 ) ? '<div class="w100" style="justify-content: flex-start">No items hidden</div>' : '' ) + '\
        <div class="w100 scrollbar flex-container" style="max-height: 216px; overflow-y: scroll; flex-wrap: wrap; justify-content: flex-start;" id="hiddenItems">\
    ');

    if ( setuptools.data.muledump.totals.itemFilter.length > 0 ) {

        setuptools.data.muledump.totals.itemFilter.filter(function(itemid) {

            var item = items[+itemid];
            setuptools.lightbox.build('totalsmenu-settings', '<div class="item noselect" data-itemId="' + itemid + '" style="background-position: -' + item[3] + 'px -' + item[4] + 'px;"></div>');

        });

    }

    setuptools.lightbox.build('totalsmenu-settings', ' \
        </div>\
    ');

    if ( setuptools.data.muledump.totals.itemFilter.length > 0 ) setuptools.lightbox.build('totalsmenu-settings', ' \
        <div class="w100" style="margin-top: 4px; margin-left: 1px; justify-content: flex-start;"><div class="setuptools link clearAllHidden menuStyle negative">Clear All Hidden Items</div></div> \
    ');

    setuptools.lightbox.settitle('totalsmenu-settings', 'Totals Settings Menu');
    setuptools.lightbox.drawhelp('totalsmenu-settings', 'docs/setuptools/help/totals', 'Totals Help');
    setuptools.lightbox.display('totalsmenu-settings', {variant: 'fl-Totals'});

    //  toggle favorite status
    $('.setuptools.link.favorite').on('click.muledump.totals.favorite', function() {

        var name = $(this).parent().prev().find('select[name="totalsConfigSets"]').val();
        if ( name === 'Default' ) {
            setuptools.lightbox.status(this, 'No!');
            return;
        }
        var index = setuptools.data.muledump.totals.configSets.favorites.indexOf(name);
        if ( index === -1 ) {
            setuptools.data.muledump.totals.configSets.favorites.push(name);
            $(this).addClass('selected').attr('title', 'Click to Unfavorite');
        } else {
            setuptools.data.muledump.totals.configSets.favorites.splice(index, 1);
            $(this).removeClass('selected').attr('title', 'Click to Favorite');
        }
        setuptools.app.config.save('Totals config set was favorite toggled', true);

    });

    //  automatically switch buttons on config selection
    $('select[name="totalsConfigSets"]').on('change.muledump.totals.totalsConfigSets', function() {

        var name = $(this).val();

        var favoriteButton = $('.setuptools.link.favorite');
        if ( setuptools.data.muledump.totals.configSets.favorites.indexOf(name) === -1 ) {
            favoriteButton.removeClass('selected').attr('title', 'Click to Favorite');
        } else favoriteButton.addClass('selected').attr('title', 'Click to Unfavorite');

        var activateButton = $('.setuptools.link.activateSet');
        if ( setuptools.data.muledump.totals.configSets.active === name ) {
            activateButton.addClass('disabled truly').text('Active');
        } else activateButton.removeClass('disabled truly').text('Switch To');

    });

    $('.setuptools.link.reset').on('click.muledump.totals.reset', function() {
        setuptools.app.muledump.totalsActivateSet(setuptools.data.muledump.totals.configSets.active);
        setuptools.lightbox.status(this, 'Active reset!');
    });

    //  switch active configuration
    $('.setuptools.link.activateSet').on('click.muledump.totals.activateSet', function() {

        var name = $('select[name="totalsConfigSets"]').val();
        if ( typeof setuptools.data.muledump.totals.configSets.settings[name] !== 'object' ) return;
        setuptools.app.muledump.totalsActivateSet(name);
        setuptools.app.muledump.totalsmenuSettings();
        setuptools.lightbox.status($('.setuptools.link.activateSet'), "Enabled!");

    });

    //  delete a configuration set
    $('.setuptools.link.deleteSet').on('click.muledump.totals.deleteSet', function() {

        var name = $('select[name="totalsConfigSets"]').val();
        if ( name === 'Default' ) {
            setuptools.lightbox.status(this, 'No!');
            return;
        }
        if ( typeof setuptools.data.muledump.totals.configSets.settings[name] !== 'object' ) return;
        delete setuptools.data.muledump.totals.configSets.settings[name];
        setuptools.app.config.save('Totals config set deleted', true);
        setuptools.app.muledump.totalsActivateSet('Default');

    });

    //  save configurations
    $('.setuptools.link.saveNewSet').on('click.muledump.totals.saveNewSet', function() {

        if ( this.busy === true ) return;
        var name = $('input[name="newConfigSetName"]').val();

        //  name cannot be empty
        if ( name === '' ) {

            this.busy = true;
            $(this).removeClass('positive').addClass('negative');
            setuptools.lightbox.status(this, 'Invalid set name', function(self) {
                self.busy = false;
                $(self).removeClass('negative').addClass('positive');
            });
            return;

        }

        //  name must be unique
        if ( typeof setuptools.data.muledump.totals.configSets[name] === 'object' ) {

            $(this).removeClass('positive').addClass('negative');
            setuptools.lightbox.status(this, 'Name already exists', function(self) {
                self.removeClass('negative').addClass('positive');
            });
            return;

        }

        //  create the configuration
        setuptools.app.muledump.totalsSaveSet(name);
        setuptools.app.muledump.totalsmenuSettings();
        setuptools.lightbox.status($('.setuptools.link.saveNewSet'), 'Created!');

    });

    //  erase the hidden items list
    $('div.setuptools.link.clearAllHidden').on('click.muledump.clearAllHidden', function() {
        setuptools.data.muledump.totals.itemFilter = [];
        setuptools.tmp.globalTotalsCounter.import('clearExcluded');
        setuptools.app.config.save('Clearing hidden items filter', true);
        option_updated('totals');
        setuptools.app.muledump.totalsmenuSettings();
    });

    //  handle hidden items list clicks
    var itemsSelected = $('div#hiddenItems div.item');
    setuptools.app.muledump.tooltip(itemsSelected, 'hiddenItemsTooltip');
    itemsSelected.off('click.muledump.totals.hiddenItems').on('click.muledump.totals.hiddenItems', function(e) {
        if ( e.shiftKey === true ) {

            var itemId = +$(this).attr('data-itemid');
            setuptools.data.muledump.totals.itemFilter.splice(setuptools.data.muledump.totals.itemFilter.indexOf(itemId), 1);
            $(this).remove();
            $('.tooltip').remove();
            setuptools.app.config.save('Updating hidden items filter', true);
            option_updated('totals');
            $('.tooltip').remove();

        }
    });

    //  handle account filter list clicks
    $('#accountFilterList div').off('click.muledump.totals.accountFilterList').on('click.muledump.totals.accountFilterList', function(e) {
        if ( e.shiftKey === true ) {

            var guid = $(this).text();
            setuptools.data.muledump.totals.accountFilter.splice(setuptools.data.muledump.totals.accountFilter.indexOf(guid), 1);
            $(this).remove();
            setuptools.tmp.globalTotalsCounter.import('clearExcluded');
            setuptools.app.config.save('Updating account list filter', true);
            option_updated('totals');
            if ( setuptools.data.muledump.totals.accountFilter.length === 0 ) {

                $('#accountFilterList').text('No accounts in filter');

            }

        }
    });

};

//  create a totals configuration set
setuptools.app.muledump.totalsSaveSet = function(name) {

    if ( setuptools.data.muledump.totals.configSets.settings[name] !== 'object' ) setuptools.data.muledump.totals.configSets.settings[name] = {};
    setuptools.config.totalsSaveKeys.filter(function(item) {
        setuptools.data.muledump.totals.configSets.settings[name][item] = setuptools.data.options[item];
    });
    setuptools.data.muledump.totals.configSets.active = name;
    setuptools.app.config.save('Totals config set created', true);

};

//  activate a totals configuration set
setuptools.app.muledump.totalsActivateSet = function(name) {

    if ( typeof setuptools.data.muledump.totals.configSets.settings[name] !== 'object' ) return;
    Object.filter(setuptools.data.muledump.totals.configSets.settings[name], function(key, value) {
        setuptools.data.options[key] = value;
    });
    setuptools.data.muledump.totals.configSets.active = name;
    setuptools.app.config.save('Totals config set activated', true);
    option_updated('totals');

};

//  display the totals menu
setuptools.app.muledump.totalsmenu = function(track) {

    if ( !(track instanceof jQuery) ) track = $('#totalsMenu');
    setuptools.lightbox.menu.context.close('totalsmenu');
    var options = [
        {
            option: 'hover',
            action: 'close'
        },
        {
            option: 'skip',
            value: 'reposition'
        },
        {
            option: 'afterClose',
            callback: setuptools.app.muledump.totalsmenu
        },
        {
            option: 'class',
            value: 'smallMenuCells'
        },
        {
            option: 'css',
            css: {
                width: '177px',
                position: 'fixed'
            }
        },
        {
            option: 'customPos',
            vpx: track[0].offsetTop,
            hpx: track[0].offsetLeft
        },
        {
            option: 'pos',
            h: 'left',
            v: 'top',
            vpx: 28
        },
        {
            class: 'toggleTotals',
            name: ( (setuptools.data.options.totals === true) ? 'Disable' : 'Enable' ) + ' Totals',
            callback: setuptools.app.muledump.toggleoption,
            callbackArg: 'totals'
        }
    ];

    //  totals needs to be enabled for these options
    if ( setuptools.data.options.totals === true ) {

        if ( Array.isArray(setuptools.data.muledump.totals.accountFilter) && setuptools.data.muledump.totals.accountFilter.length > 0 ) options.push({
            class: 'resetAccountFilter',
            name: 'Reset Account Filter',
            callback: function() {
                setuptools.data.muledump.totals.accountFilter = [];
                setuptools.app.config.save('Mule Menu - Modifying totalsFilter', true);
                setuptools.tmp.globalTotalsCounter.import('clearExcluded');
                option_updated('totals');
            }
        });

        options.push({
            class: 'displayGlobalTotals',
            name: ( (setuptools.data.options.totalsGlobal === true) ? 'Disable' : 'Enable' ) + ' Global',
            callback: setuptools.app.muledump.toggleoption,
            callbackArg: 'totalsGlobal'
        });

        var favoriteOptions = {};
        setuptools.data.muledump.totals.configSets.favorites.filter(function(item) {
            favoriteOptions[item] = item;
        });

        options.push({
            class: 'totalsSettingsStatus',
            name: 'Settings Status',
            callback: setuptools.app.muledump.totalsmenuSettings,
            override: 'afterClose'
        },
        {
            class: 'totalsBasicMenu',
            name: 'Basic Filters...',
            callback: setuptools.app.muledump.totalsmenuBasic,
            override: 'afterClose'
        },
        {
            class: 'totalsAdvancedMenu',
            name: 'Advanced Filters...',
            callback: setuptools.app.muledump.totalsmenuAdvanced,
            override: 'afterClose'
        },
        {
            option: 'select',
            name: 'Favorite Filters',
            class: 'favoriteFilter',
            options: favoriteOptions,
            selected: setuptools.data.muledump.totals.configSets.active,
            binding: function() {

                $('select.favoriteFilter').on('change.muledump.totals.favoriteFilter', function() {

                    var name = $(this).val();
                    if ( typeof setuptools.data.muledump.totals.configSets.settings[name] !== 'object' ) return;
                    setuptools.app.muledump.totalsActivateSet(name);
                    option_updated('totals');

                });

            }
        });

        options.push({
            option: 'header',
            value: 'Standard Filters'
        },
        {
            option: 'select',
            name: 'Fame Bonus',
            class: 'fameBonusFilter',
            options: {
                '-1': 'Disabled',
                '0': '&gt; 0',
                '1': '&gt; 1%',
                '2': '&gt; 2%',
                '3': '&gt; 3%',
                '4': '&gt; 4%',
                '5': '&gt; 5%'
            },
            selected: setuptools.data.options.fameamount,
            binding: function() {

                $('select.fameBonusFilter').change(function() {

                    setuptools.data.options.famefilter = !( $(this).val() === '-1' );
                    setuptools.data.options.fameamount = $(this).val();

                    option_updated('famefilter');

                });

            }
        },
        {
            option: 'select',
            name: 'Feed Power',
            class: 'feedPowerFilter',
            options: {
                '-1': 'Disabled',
                '0': '> 0',
                '100': '> 100',
                '250': '> 250',
                '500': '> 500',
                '1000': '> 1000',
                '2500': '> 2500'
            },
            selected: setuptools.data.options.feedpower,
            binding: function() {

                $('select.feedPowerFilter').change(function() {

                    setuptools.data.options.feedfilter = !( $(this).val() === '-1' );
                    setuptools.data.options.feedpower = $(this).val();

                    option_updated('feedfilter');

                });

            }
        },
        {
            class: 'toggleSBFilter',
            name: ( (setuptools.data.options.sbfilter === true) ? 'Disable' : 'Enable' ) + ' Soulbound',
            callback: setuptools.app.muledump.toggleoption,
            callbackArg: 'sbfilter'
        },
        {
            class: 'toggleUTFilter',
            name: ( (setuptools.data.options.utfilter === true) ? 'Disable' : 'Enable' ) + ' Untiered',
            callback: setuptools.app.muledump.toggleoption,
            callbackArg: 'utfilter'
        },
        {
            class: 'toggleSTFilter',
            name: ( (setuptools.data.options.stfilter === true) ? 'Disable' : 'Enable' ) + ' Set Items',
            callback: setuptools.app.muledump.toggleoption,
            callbackArg: 'stfilter'
        },
        {
            class: 'resetTotalsSettings',
            name: 'Reset Settings',
            callback: function() {
                console.log('resetting totals');
            },
            override: 'afterClose'
        });

    }

    setuptools.lightbox.menu.context.create('totalsmenu', false, track, options);

};

setuptools.app.muledump.totalsHide = function(itemid) {

    itemid = Number(itemid);
    var index = setuptools.data.muledump.totals.itemFilter.indexOf(itemid);
    if ( index === -1 ) {
        setuptools.data.muledump.totals.itemFilter.push(itemid);
    } else setuptools.data.muledump.totals.itemFilter.splice(index, 1);
    setuptools.app.config.save('Item exclusion filter toggle', true);
    option_updated('totals');

};

setuptools.app.muledump.toggleoption = function(option, value) {

    if ( option && !value ) {
        setuptools.data.options[option] = !setuptools.data.options[option];
        option_updated(option);
    }

};

//  display the account mule menu
setuptools.app.muledump.mulemenu = function(e, guid, context, track, extraopts) {

    var accounts = ( setuptools.app.config.determineFormat(setuptools.data.accounts) === 1 ) ?
        setuptools.app.config.convert(setuptools.data.accounts, 0) :
        window.accounts;

    if ( typeof accounts !== 'object' ) return;
    if ( typeof extraopts !== 'object' ) extraopts = {};

    //  convert ign to guid
    if ( typeof accounts[guid] === 'undefined' && setuptools.app.config.determineFormat(setuptools.data.accounts) === 1 )
        Object.keys(setuptools.data.accounts.accounts).filter(function(element) {
            if ( setuptools.data.accounts.accounts[element].ign === guid ) guid = element;
        });

    if ( !accounts[guid] ) return;

    var muleId = 'mule-' + setuptools.seasalt.hash.sha256(guid);
    if ( e ) e.preventDefault();
    if ( !context && setuptools.lightbox.menu.context.isOpen(muleId) === true ) {
        setuptools.lightbox.menu.context.close();
        return;
    }

    if ( context ) setuptools.lightbox.menu.context.close();

    var options = [];

    if ( typeof extraopts.top === 'object' ) options = options.concat(extraopts.top);

    options.push(
        {
            option: 'keyup',
            value: false
        },
        {
            option: 'hover',
            action: 'close'
        }
    );

    if ( typeof track === 'undefined' ) {

        //  right-click context menus open with different positioning data
        if (context) {

            options.push(
                {
                    option: 'pos',
                    h: 'right',
                    v: 'bottom',
                    hpx: -5,
                    vpx: -15
                },
                {
                    option: 'absPos',
                    h: 'left',
                    v: 'top',
                    hpx: e.pageX,
                    vpx: e.pageY
                },
                {
                    option: 'header',
                    value: 'Mule Menu'
                }
            );

        } else {

            options.push({
                option: 'pos',
                h: 'right',
                hpx: 8
            });

        }

    } else {

        options.push({
            option: 'absPos',
            h: 'left',
            v: 'top',
            hpx: track.offset().left,
            vpx: track.offset().top+28
        })

    }

    options.push({
        class: 'reloadImmediate',
        name: 'Reload Account',
        callback: function(guid) {
            setuptools.app.mulequeue.task.start(guid);
        },
        callbackArg: guid
    });

    //  add one click login option if enabled
    if ( guid.indexOf('steamworks:') === -1 && window.mulelogin) {

        options.push({
            option: 'link',
            class: 'oneclick',
            name: 'One click login',
            href: setuptools.app.muledump.mulelink(guid)
        });

    } else {

        options.push({
            option: 'link',
            class: 'oneclick',
            name: 'One click login',
            href: setuptools.config.oneclickHelp,
            target: '_blank'
        });

    }

    //  add global options
    if (
        setuptools.app.config.determineFormat(setuptools.data.accounts, 0) === true ||
        (setuptools.state.loaded === true && setuptools.data.accounts.accounts[guid].loginOnly === false )
    ) options.push(
        {
            class: 'chsort',
            name: 'Edit Character Sorting Lists',
            callback: function(guid) {
                setuptools.app.muledump.chsortcustom(mules[guid]);
            },
            callbackArg: guid
        },
        {
            class: 'canvas-clipboard',
            name: 'Create Image of Mule',
            callback: function(guid) {
                setuptools.app.muledump.canvas(document.querySelector('.mule[data-guid="' + guid + '"]'));
            },
            callbackArg: guid
        }
    );

    if ( setuptools.data.options.totals === true ) options.push({
        class: 'toggleTotals',
        name: ((
            Array.isArray(setuptools.data.muledump.totals.accountFilter) === false ||
            (
                Array.isArray(setuptools.data.muledump.totals.accountFilter) === true &&
                setuptools.data.muledump.totals.accountFilter.indexOf(guid) === -1
            )) ? 'Add to' : 'Remove from' ) + ' Totals Filter',
        callback: function(guid) {

            if ( typeof setuptools.data.muledump.totals.accountFilter === 'undefined' ) setuptools.data.muledump.totals.accountFilter = [];
            if ( setuptools.data.muledump.totals.accountFilter.indexOf(guid) === -1 ) {
                setuptools.data.muledump.totals.accountFilter.push(guid);
            } else setuptools.data.muledump.totals.accountFilter.splice(setuptools.data.muledump.totals.accountFilter.indexOf(guid), 1);
            setuptools.tmp.globalTotalsCounter.import();
            setuptools.app.config.save('Mule Menu - Modifying totalsFilter', true);
            option_updated('totals');

        },
        callbackArg: guid
    });

    options.push({
        class: 'copyMenuOpen',
        name: "Copy...",
        callback: setuptools.app.muledump.copymenu,
        callbackArg: guid
    });

    if ( !context ) {
        $(this).addClass('selected');
    } else {
        context.addClass('selected');
    }

    if ( typeof extraopts.bottom === 'object' ) options = options.concat(extraopts.bottom);
    if ( typeof track === 'undefined' && context ) track = context;
    if ( typeof track === 'undefined' ) track = $(this);
    setuptools.lightbox.menu.context.create(muleId, false, track, options, track);

};

setuptools.app.muledump.pagesearch.bind = function() {

    new setuptools.lightbox.menu.search.bind(
        setuptools.app.muledump.pagesearch.paginate,
        false,
        'div#top',
        undefined,
        {
            h: 'left',
            v: 'top',
            vpx: 28,
            hpx: 0
        }
    );

};

//  perform the lookup and search action
setuptools.app.muledump.pagesearch.execute = function(state, searchTerm) {

    //  find our result object
    var object = setuptools.app.muledump.pagesearch.paginate.PageList.find(function(element) {
       return ( element.ign === searchTerm || element.username === searchTerm )
    });

    window.techlog('PageSearch/Scroll to ' + JSON.stringify(object));

    //  get positioning information
    var fix = $('#fix').outerHeight();
    var mule = mules[object.username].dom;
    var pos = mule.offset();

    //  generate the notice panel
    var panel = $('<div>')
        .css({
            left: pos.left-5,
            top: pos.top-50
        })
        .addClass('pagesearch result flex-container')
        .html(' \
            <div>Here!</div>\
        ');

    //  display panel and set removal timeout
    $('body').append(panel);
    setTimeout(function() {
        panel.fadeOut(2500, function() {
            $(this).remove();
        });
    }, 500);

    //  scroll to the result position
    window.scrollTo(0, pos.top-fix-50);

    //  empty the search bar
    $('div#pagesearch input').val('').blur();
    if ( setuptools.data.config.pagesearch === 1 ) $('#pagesearch').removeClass('full').addClass('small');

};

setuptools.app.muledump.quickUserAdd = function() {

};

//  automatically adjust totals width
setuptools.app.muledump.totalsWidth = function(totals) {

    //  update totals width
    var totalswidth = setuptools.data.config.totalswidth;
    var totalItems = Object.keys(totals).length;

    //  if total items is less than the totalswidth then we need to adjust it
    if ( totalItems < setuptools.data.config.totalswidth ) totalswidth = totalItems;

    //  if totalswidth is set to whole screen we need to determine how many items that could possibly be
    if ( setuptools.data.config.totalswidth === 0 ) {

        var maxItems = Math.floor($(window).innerWidth()/setuptools.config.totalsItemWidth);
        if ( totalItems < maxItems ) totalswidth = totalItems;

    }

    $('#totals').css({'max-width': ( (totalswidth === 0) ?
            (setuptools.config.totalsItemWidth*(Math.floor(($(window).innerWidth()-30)/setuptools.config.totalsItemWidth)))-setuptools.config.totalsItemWidth+2 :
            (totalswidth*setuptools.config.totalsItemWidth)+2
    )});

};

//  generate a one click login url
setuptools.app.muledump.mulelink = function(guid) {

    //  does not support guid's or testing
    if (
        guid.match(setuptools.config.regex.guid) !== null ||
        (setuptools.state.loaded === true && setuptools.data.accounts.accounts[guid].testing === true)
    ) return;

    //  return the link
    return 'muledump:' + sodium.to_hex(guid) + '-' + sodium.to_hex(window.accounts[guid]);

};

/*setuptools.app.muledump.trackGold = function() {

};*/

/*
//  Realmeye features
*/

setuptools.app.muledump.realmeye.state = {
    selected: []
};

//  generate links to the realmeye wiki for items
setuptools.app.muledump.realmeye.link = function(itemNumber, link, extra) {

    var itemName;

    //  determine itemName
    if ( typeof itemNumber === 'number' || typeof Number(itemNumber) === 'number' ) itemName = items[itemNumber][0];

    //  if we still don't have the item hex yet, let's assume it's the item's exact name
    if ( typeof itemNumber === 'undefined' ) itemName = itemNumber;

    //  determine uri
    if ( link === 'wiki' ) {
        itemName = itemName.toLowerCase().replace(/\s/g, '-');
    } else if ( link === 'sell' ) {
        link = 'offers-to/buy';
        itemName = itemNumber;
    } else if ( link === 'buy' ) {
        link = 'offers-to/sell';
        itemName = itemNumber;
    } else return;

    if ( typeof extra !== 'undefined' && (typeof extra === 'number' || typeof Number(extra) === 'number') ) extra = '/' + extra;

    return setuptools.config.realmeyeUrl + '/' + link + '/' + itemName + ( (typeof extra === 'string') ? extra : '' );

};

//  react to ctrl+click actions
setuptools.app.muledump.realmeye.itemCtrlUp = function(e) {

    var selected = setuptools.app.muledump.realmeye.state.selected;

    //  single item menu
    if ( selected.length === 1 ) {

        var position = $(selected[0]);
        var options = [{
            option: 'header',
            value: 'Realmeye Menu'
        },
        {
            option: 'close',
            callback: function() {
                for ( var i in setuptools.app.muledump.realmeye.state.selected )
                    if ( setuptools.app.muledump.realmeye.state.selected.hasOwnProperty(i) )
                        $(setuptools.app.muledump.realmeye.state.selected[i]).removeClass('realmeyeBorder');
                setuptools.app.muledump.realmeye.state.selected = [];
                setuptools.lightbox.menu.context.close();
            }
        },
        {
            option: 'css',
            css: {
                width: 'auto'
            }
        },
        {
            option: 'pos',
            vpx: 44
        },
        {
            option: 'hover',
            action: 'close',
            timer: 'realmeyeMenu'
        },
        {
            option: 'link',
            name: 'View in Wiki',
            href: setuptools.app.muledump.realmeye.link($(selected[0]).attr('data-itemid'), 'wiki'),
            target: '_blank'
        }];

        var item = items[$(selected[0]).attr('data-itemid')];
        if ( setuptools.config.realmeyeOfferIds.indexOf(Number($(selected[0]).attr('data-itemid'))) > -1 ) options.push({
            option: 'link',
            name: 'Buy ' + item[0],
            href: setuptools.app.muledump.realmeye.link($(selected[0]).attr('data-itemid'), 'buy'),
            target: '_blank'
        },
        {
            option: 'link',
            name: 'Sell ' + item[0],
            href: setuptools.app.muledump.realmeye.link($(selected[0]).attr('data-itemid'), 'sell'),
            target: '_blank'
        });

        setuptools.lightbox.menu.context.create('realmeyeMenu', false, position, options);

    }
    //  trading menu
    else if ( selected.length === 2 ) {

        //  we only allow the last two selected items to be used
        for ( var x = 0; x < (selected.length-2); x++ ) $(selected[x]).removeClass('realmeyeBorder');

        var position = $(selected[selected.length-1]);
        var options = [{
                option: 'header',
                value: 'Realmeye Offers Menu'
            },
            {
                option: 'close',
                callback: function() {
                    for ( var i in setuptools.app.muledump.realmeye.state.selected )
                        if ( setuptools.app.muledump.realmeye.state.selected.hasOwnProperty(i) )
                            $(setuptools.app.muledump.realmeye.state.selected[i]).removeClass('realmeyeBorder');
                    setuptools.app.muledump.realmeye.state.selected = [];
                    setuptools.lightbox.menu.context.close();
                }
            },
            {
                option: 'css',
                css: {
                    width: 'auto'
                }
            },
            {
                option: 'pos',
                vpx: 44
            },
            {
                option: 'hover',
                action: 'close',
                timer: 'realmeyeMenu'
        }];

        //  build the menu if both items can be traded on realmeye
        var item = items[$(selected[0]).attr('data-itemid')];
        if (
            setuptools.config.realmeyeOfferIds.indexOf(Number($(selected[0]).attr('data-itemid'))) > -1 &&
            setuptools.config.realmeyeOfferIds.indexOf(Number($(selected[1]).attr('data-itemid'))) > -1
        ) {
            options.push({
                option: 'link',
                name: 'Buy ' + items[$(selected[0]).attr('data-itemid')][0],
                href: setuptools.app.muledump.realmeye.link($(selected[0]).attr('data-itemid'), 'buy', $(selected[1]).attr('data-itemid')),
                target: '_blank'
            },
            {
                option: 'link',
                name: 'Sell ' + items[$(selected[1]).attr('data-itemid')][0],
                href: setuptools.app.muledump.realmeye.link($(selected[0]).attr('data-itemid'), 'sell', $(selected[1]).attr('data-itemid')),
                target: '_blank'
            });
        } else {

            for ( var x = 0; x < selected.length; x++ ) $(selected[x]).removeClass('realmeyeBorder');
            setuptools.app.muledump.realmeye.state.selected = [];
            return;

        }

        setuptools.lightbox.menu.context.create('realmeyeMenu', false, position, options);

    } else {

        //  one or both items is ineligible for trading
        for ( var x = 0; x < selected.length; x++ ) $(selected[x]).removeClass('realmeyeBorder');
        setuptools.app.muledump.realmeye.state.selected = [];

    }

};

//  update item on selection in realmeye menu
setuptools.app.muledump.realmeye.itemSelection = function(self) {

    var item = $(self);
    if ( item.hasClass('realmeyeBorder') === false ) {
        setuptools.app.muledump.realmeye.state.selected.push(self);
        item.addClass('realmeyeBorder');
    }

};

//  generate the account copy menu
setuptools.app.muledump.copymenu = function(guid) {

    //  generate menu options
    var position = $('div.setuptools.menu');
    var options = [{
            option: 'skip',
            value: 'reposition'
        },
        {
            option: 'header',
            value: 'Copy Menu'
        },
        {
            option: 'hover',
            action: 'close',
            timer: 'mulemenu-copy'
        },
        {
            class: 'copySelection username',
            name: 'Username',
            callback: function(guid) {

                new ClipboardJS('div.setuptools.menu > div.link', {
                    text: function() {
                        return guid;
                    }
                });

            },
            callbackArg: guid
        }
    ];

    //  offer ign if known
    if ( setuptools.app.config.determineFormat(setuptools.data.accounts) === 1 &&
        typeof setuptools.data.accounts.accounts[guid].ign === 'string'
    ) options.push({
        class: 'copySelection ign',
        name: 'IGN',
        callback: function(guid) {

            new ClipboardJS('div.setuptools.menu > div.link', {
                text: function() {
                    return setuptools.data.accounts.accounts[guid].ign;
                }
            });

        },
        callbackArg: guid
    });

    //  offer password
    options.push({
        class: 'copySelection password',
        name: 'Password',
        callback: function(guid) {

            new ClipboardJS('div.setuptools.menu > div.link', {
                text: function() {
                    return ( setuptools.app.config.determineFormat(setuptools.data.accounts) === 1 ) ?
                        setuptools.data.accounts.accounts[guid].password :
                        window.accounts[guid];
                }
            });

        },
        callbackArg: guid
    });

    //  offer deep copy
    options.push({
        class: 'copySelection deepcopy',
        name: 'Deep Copy',
        callback: function(guid) {

            new ClipboardJS('div.setuptools.menu > div.link', {
                text: function() {
                    return setuptools.app.accounts.ExportDeepCopy(guid, true);
                }
            });

        },
        callbackArg: guid
    });

    //  offer account json
    /*  //  dsiabled until importing account json strings is fully supported
    var accountJson;
    if ( setuptools.app.config.determineFormat(setuptools.data.accounts) === 1 ) {

        var dataKeys = Object.keys(setuptools.data.accounts.accounts[data.mule.guid]).sort(function(a, b) {
            return (a > b);
        });
        var dataObject = {};
        for ( var i = 0; i < dataKeys.length; i++ )
                dataObject[dataKeys[i]] = setuptools.data.accounts.accounts[data.mule.guid][dataKeys[i]];

        accountJson = ('{"' + data.mule.guid + '": ' + JSON.stringify(dataObject, null, 5) + '}');

    } else accountJson = ('{"' + data.mule.guid + '": "' + window.accounts[data.mule.guid] + '"}');

    options.push({
        class: 'copySelection',
        name: 'Account JSON',
        attributes: {
            'data-clipboard-text': accountJson
        }
    });
    */

    setuptools.lightbox.menu.context.create('mulemenu-copy', true, position, options);

};

/*
//  White Bag Tracker
*/

setuptools.app.muledump.whitebag = {};

//  returns a list of all white bag items
setuptools.app.muledump.whitebag.items = function(full) {

    //  pull a list of whitebags from constants
    var whitebags = Object.filter(items, function(key, value) {
        if ( value[7] === 6 ) return true;
    });

    //  if full === true we will send the items and their data
    if ( full === true ) return whitebags;

    //  but typically we'll only need to send the item ids
    return Object.keys(whitebags);

};

setuptools.app.muledump.whitebag.tracker = function(guid) {

    //  it's so big!
    var config = setuptools.data.muledump.whitebagTracker;

    //  generate the base configuration for new accounts
    if ( typeof config.accounts[guid] === 'undefined' ) config.accounts[guid] = $.extend(true, {}, setuptools.objects.whitebagTrackerAccount);

    var displayName;
    if (
        setuptools.state.loaded === true &&
        setuptools.data.config.mqDisplayIgn === true &&
        typeof setuptools.data.accounts.accounts[guid] === 'object' &&
        typeof setuptools.data.accounts.accounts[guid].ign === 'string'
    ) displayName = setuptools.data.accounts.accounts[guid].ign;
    if ( displayName === undefined ) displayName = guid;

    //  build our ui
    var dom = $('#whitebagTracker');
    var html = ' \
        <div class="wbstage"> \
            <div class="header">White Bag Tracker</div> \
            ' + ( (mules[guid].opt('accountName') === true ) ? '<div class="header">' + displayName + '</div>' : '' ) + ' \
            <div class="items"></div> \
        </div> \
    ';

    //  display our ui
    dom.empty().append(html);

    //  populate the items
    var itemsDom = dom.find('div.items');
    var whitebags = {};
    (setuptools.app.muledump.whitebag.items()).filter(function(item) {
        whitebags[item] = 0;
    });
    whitebags = $.extend(true, whitebags, config.accounts[guid].items);
    Object.filter(whitebags, function(key) {
        var itemDom = window.item(key, 'wb', (config.accounts[guid].items[key] || 0));
        itemDom.appendTo(itemsDom);
    });

    console.log(itemsDom);


};
