//  so it begins
setuptools.app.groups.manager = function(manual, group) {

    if ( typeof manual !== 'boolean' ) manual = false;
    if ( typeof group === 'string' ) group = [group];
    if ( typeof group !== 'object' ) group = [];

    setuptools.lightbox.build('groups-manager', ' \
        <h3>Available Actions</h3> \
        <a href="#" class="setuptools link groups add">Create Group</a> | \
        <a href="#" class="setuptools link groups enableAll noclose">Enable All</a> | \
        <a href="#" class="setuptools link groups disableAll noclose">Disable All</a> \
        <div class="setuptools div groups container"> \
        <br><strong>Existing Groups</strong> \
        <br> \
    ');

    //  display existing groups
    //
    if ( typeof setuptools.data.groups.format === 'undefined' ||  Object.keys(setuptools.data.groups.groupList).length === 0 ) {

        setuptools.lightbox.build('groups-manager', 'There are no groups.');

    } else {

        //  advanced manager
        if ( !manual ) {

            setuptools.lightbox.build('groups-manager', ' \
                <div class="setuptools div groupControls"> \
                    <div class="groupMenu" title="Group Menu">M</div> \
                    <div class="groupSelect" title="Select Menu">S</div> \
                </div> \
                <div class="setuptools div groupList"> \
                    <div class="dragbox"> \
            ');

            for ( i = 0; i < setuptools.data.groups.groupOrder.length; i++ ) {

                var selected = '';
                for ( x = 0; x < group.length; x++ ) {
                    if (group[x] === setuptools.data.groups.groupOrder[i]) {
                        selected = ' selected';
                        break;
                    }
                }

                setuptools.lightbox.build('groups-manager', ' \
                    <div class="setuptools groupMember cell' + selected + '" \
                    data-groupName="' + setuptools.data.groups.groupOrder[i] + '">' + setuptools.data.groups.groupOrder[i] + '</div> \
                ');

            }

            setuptools.lightbox.build('groups-manager', ' \
                    </div> \
                </div> \
            ');

        //  basic manager
        } else {

            setuptools.lightbox.build('groups-manager', ' \
                <select name="groupName" class="setuptools app">\
            ');

            for ( var i in setuptools.data.groups )
                setuptools.lightbox.build('groups-manager', '<option>' + i + '</option>');

            setuptools.lightbox.build('groups-manager', ' \
                </select> \
            ');

        }

    }

    setuptools.lightbox.build('groups-manager', ' \
        <div class="setuptools div groupEditor container noselect"> \
            <br><h3>Group Editor</h3> \
            <div class="setuptools div groups editor">Select a group or create a new one.</div> \
            </div> \
        </div>\
    ');

    setuptools.lightbox.settitle('groups-manager', 'Groups Manager');
    setuptools.lightbox.goback('groups-manager', setuptools.app.index);
    setuptools.lightbox.drawhelp('groups-manager', 'docs/setuptools/help/groups-manager/manager', 'Groups Manager Help');
    setuptools.lightbox.display('groups-manager', {variant: 'setuptools-tiles'});

    $('.setuptools.link.groups.add').click(setuptools.app.groups.add);

    $('.setuptools.link.groups.enableAll').click(function() {

        for ( var i in setuptools.data.groups.groupList )
            if ( setuptools.data.groups.groupList.hasOwnProperty(i) )
                setuptools.data.groups.groupList[i].enabled = true;

        setuptools.app.config.save();

    });

    $('.setuptools.link.groups.disableAll').click(function() {

        for ( var i in setuptools.data.groups.groupList )
            if ( setuptools.data.groups.groupList.hasOwnProperty(i) )
                setuptools.data.groups.groupList[i].enabled = false;

        setuptools.app.config.save();

    });

    //
    //  advanced editor
    //

    /* begin group list controls */

    if ( !manual ) {

        //  display the group editor
        function OpenEditor(groupName, self) {

            //  generate a list of account tiles and paginate
            var ListAccountTiles = function(groupName, page) {

                if ( page > setuptools.lightbox.menu.paginate.state.availableAccounts.lastPage ) page--;
                $('div.availableAccounts div.customPage input[name="customPage"]').val(page+1);
                if ( typeof groupName !== 'string' ) setuptools.lightbox.error('Supplied groupName was not a string.', 28);
                if ( typeof page !== 'number' ) page = 0;

                //  determine our boundary
                var minIndex = setuptools.data.config.accountsPerPage*page;
                var maxIndex = (setuptools.data.config.accountsPerPage*page)+setuptools.data.config.accountsPerPage;
                if ( maxIndex > availableAccountsList.length ) maxIndex = availableAccountsList.length;
                if ( availableAccountsList.length <= setuptools.data.config.accountsPerPage ) {
                    minIndex = 0;
                    maxIndex = availableAccountsList.length;
                }

                //  display the tiles
                var html = '';
                for ( i = minIndex; i < maxIndex; i++ )
                    html += '<div class="cell noselect">' + availableAccountsList[i] + '</div>'

                if ( html.length === 0 ) {
                    html += '<div class="cell noselect nocontext">No available accounts</div>';
                }

                return html;

            };

            //  generate a list of group members and paginate
            var ListGroupMembers = function(groupName, page) {

                if ( page > setuptools.lightbox.menu.paginate.state.groupMembers.lastPage ) page--;
                $('div.groupMembers div.customPage input[name="customPage"]').val(page+1);
                if ( typeof groupName !== 'string' ) setuptools.lightbox.error('Supplied groupName was not a string.', 28);
                if ( typeof page !== 'number' ) page = 0;

                //  determine our boundary
                var minIndex = setuptools.data.config.accountsPerPage*page;
                var maxIndex = (setuptools.data.config.accountsPerPage*page)+setuptools.data.config.accountsPerPage;
                if ( maxIndex > groupMembersList.length ) maxIndex = groupMembersList.length;
                if ( groupMembersList.length <= setuptools.data.config.accountsPerPage ) {
                    minIndex = 0;
                    maxIndex = groupMembersList.length;
                }

                //  display the tiles
                var html = '';
                for ( i = minIndex; i < maxIndex; i++ )
                    html += '<div class="cell noselect">' + groupMembersList[i] + '</div>'

                if ( html.length === 0 ) {
                    html += '<div class="cell noselect nocontext">No group members</div>';
                }

                return html;

            };

            function availableAccountsUpdate(direction, account) {

                if ( direction === 'add' && typeof account !== 'string' ) setuptools.lightbox.error('A valid account must be provided when adding', 30);
                if ( direction === 'add' ) setuptools.lightbox.menu.paginate.findPage(account, 'availableAccounts');
                var data = setuptools.lightbox.menu.paginate.state.availableAccounts;

                //  generate the pagination data
                var availableAccountsPaginate = setuptools.lightbox.menu.paginate.create(
                    data.PageList,
                    data.ActionItem,
                    'availableAccounts',
                    data.ActionSelector,
                    data.ActionCallback,
                    data.ActionContext
                );

                $('div.setuptools.groups.editor > div.availableAccounts.list').html(' \
                    <div><strong>Available Accounts</strong></div> \
                    ' + availableAccountsPaginate.html.menu + ' \
                    <div class="dragbox">' + data.ActionCallback(data.ActionItem, data.currentPage) + '</div> \
                ');

                availableAccountsPaginate.bind();

            }

            function groupMembersUpdate(direction, account) {

                if ( direction === 'add' && typeof account !== 'string' ) setuptools.lightbox.error('A valid account must be provided when adding', 30);
                if ( direction === 'add' ) setuptools.lightbox.menu.paginate.findPage(account, 'groupMembers');
                var data = setuptools.lightbox.menu.paginate.state.groupMembers;

                //  validate lastPage/currentPage boundary
                if ( direction === 'remove' ) {

                    var newLastPage = Math.ceil(data.PageList.length/setuptools.data.config.accountsPerPage);
                    if ( newLastPage > 0 ) newLastPage--;
                    if ( data.currentPage > newLastPage ) setuptools.lightbox.menu.paginate.findPage(data.PageList.length-1, 'groupMembers');

                }

                //  generate the pagination data
                var groupMembersPaginate = setuptools.lightbox.menu.paginate.create(
                    data.PageList,
                    data.ActionItem,
                    'groupMembers',
                    data.ActionSelector,
                    data.ActionCallback,
                    data.ActionContext
                );

                $('div.setuptools.groups.editor > div.groupMembers.list').html(' \
                    <div><strong>Group Members</strong></div> \
                    ' + groupMembersPaginate.html.menu + ' \
                    <div class="dragbox">' + data.ActionCallback(data.ActionItem, data.currentPage) + '</div> \
                ');

                groupMembersPaginate.bind();

            }

            //  bindings to execute when availableAccounts div is updated
            function availableAccountsContext() {

                function addToBottom(account) {

                    var state = setuptools.lightbox.menu.paginate.state;
                    state.groupMembers.PageList.push(account);
                    state.availableAccounts.PageList.splice(state.availableAccounts.PageList.indexOf(account), 1);
                    availableAccountsUpdate();
                    groupMembersUpdate('add', account);

                }

                function addToCurrent(account) {

                    var state = setuptools.lightbox.menu.paginate.state;
                    var index = state.groupMembers.currentPage*setuptools.data.config.accountsPerPage;
                    state.groupMembers.PageList.splice(index, 0, account);
                    state.availableAccounts.PageList.splice(state.availableAccounts.PageList.indexOf(account), 1);
                    availableAccountsUpdate();
                    groupMembersUpdate('add', account);

                }

                function addToTop(account) {

                    var state = setuptools.lightbox.menu.paginate.state;
                    state.groupMembers.PageList.unshift(account);
                    state.availableAccounts.PageList.splice(state.availableAccounts.PageList.indexOf(account), 1);
                    availableAccountsUpdate();
                    groupMembersUpdate('add', account);

                }

                //  select all accounts from the displayed list
                $('div.availableAccounts > div.dragbox > div.cell:not(.nocontext)').click(function() {

                    var self = this;

                    //  user is selecting this account
                    if ( $(this).hasClass('selected') === false ) {

                        //  deselect all other accounts and select this one
                        $(this).siblings().removeClass('selected');
                        $(this).addClass('selected');

                        //
                        //  context menu build and display
                        //

                        //  default position is inline with the next sibling
                        var position = $(this);

                        var callbackArg = $(this).text();
                        var options = [
                            {
                                option: 'header',
                                value: callbackArg
                            },
                            {
                                class: 'addToBottom',
                                name: 'Add',
                                callback: addToBottom,
                                callbackArg: callbackArg
                            },
                            {
                                class: 'addToCurrent',
                                name: 'Add to Current Page',
                                callback: addToCurrent,
                                callbackArg: callbackArg
                            },
                            {
                                class: 'addToTop',
                                name: 'Add to Top',
                                callback: addToTop,
                                callbackArg: callbackArg
                            },
                            {
                                option: 'input',
                                class: 'addToSpecified',
                                value: groupMembersPaginate.html.search.replace('Search by Name', 'Add After Account...'),
                                binding: function() {

                                    //  update search binding for custom usage of pagination tools
                                    var searchName = setuptools.lightbox.menu.search.bind(
                                        setuptools.lightbox.menu.paginate.state.groupMembers,
                                        true,
                                        'input',
                                        $('div.setuptools.menu > div.input > div.pageControls > div.searchName > input[name="searchName"]'),
                                        {
                                            h: 'right',
                                            v: 'bottom',
                                            hpx: -11,
                                            vpx: 25
                                        },
                                        addToSpecified,
                                        'availableAccountsAdd'
                                    );

                                    function addToSpecified(account) {

                                        var state = setuptools.lightbox.menu.paginate.state;

                                        //  find the index of the searched account
                                        var index = state.groupMembers.PageList.indexOf(account);
                                        if ( index === -1 ) return;

                                        //  move the account there
                                        state.groupMembers.PageList.splice(index+1, 0, callbackArg);
                                        state.availableAccounts.PageList.splice(state.availableAccounts.PageList.indexOf(callbackArg), 1);

                                        //  update page display
                                        availableAccountsUpdate();
                                        groupMembersUpdate('add', callbackArg);

                                    }

                                    $('div.input div.setuptools.div.pageControls div.search').click(function() {
                                        addToSpecified(searchName.val());
                                        setuptools.lightbox.menu.context.close();
                                    });

                                    searchName.keyup(function(e) {

                                        var value = $(this).val();
                                        if ( e.keyCode === 13 ) {
                                            addToSpecified(value);
                                            setuptools.lightbox.menu.context.close();
                                        }

                                    });

                                }
                            },
                            {
                                class: 'copySelection',
                                name: 'Copy to Clipboard',
                                attributes: {
                                    'data-clipboard-text': callbackArg
                                }
                            },
                            {
                                class: 'addCancel',
                                name: 'Cancel',
                                callback: function() {}
                            },
                            {
                                option: 'pos',
                                vpx: 41
                            }
                        ];

                        setuptools.lightbox.menu.context.create('availableAccountsAdd', false, position, options, self);

                    }
                    //  user is deselecting the account
                    else {

                        setuptools.lightbox.menu.context.close();
                        $(this).removeClass('selected');

                    }

                });

            }

            //  bindings to execute when groupMembers div is updated
            function groupMembersContext() {

                function MoveUp(account) {

                    var state = setuptools.lightbox.menu.paginate.state.groupMembers;
                    var index = state.PageList.indexOf(account);
                    if ( [-1,0].indexOf(index) > -1 ) return;
                    state.PageList.splice(index, 1);
                    state.PageList.splice(index-1, 0, account);
                    groupMembersUpdate('add', account);

                }

                function MoveDown(account) {

                    var state = setuptools.lightbox.menu.paginate.state.groupMembers;
                    var index = state.PageList.indexOf(account);
                    if ( index === -1 ) return;
                    if ( index+1 >= state.PageList.length ) return;
                    state.PageList.splice(index, 1);
                    state.PageList.splice(index+1, 0, account);
                    groupMembersUpdate('add', account);

                }

                function MoveToTop(account) {

                    var state = setuptools.lightbox.menu.paginate.state.groupMembers;
                    var index = state.PageList.indexOf(account);
                    console.log(account, index);
                    if ( [-1,0].indexOf(index) > -1 ) return;
                    state.PageList.splice(index, 1);
                    state.PageList.splice(0, 0, account);
                    groupMembersUpdate('add', account);

                }

                function MoveToBottom(account) {

                    var state = setuptools.lightbox.menu.paginate.state.groupMembers;
                    var index = state.PageList.indexOf(account);
                    if ( index === -1 ) return;
                    if ( index+1 >= state.PageList.length ) return;
                    state.PageList.splice(index, 1);
                    state.PageList.splice(state.PageList.length, 0, account);
                    groupMembersUpdate('add', account);

                }

                function RemoveAccount(account) {

                    var state = setuptools.lightbox.menu.paginate.state.groupMembers;
                    var index = state.PageList.indexOf(account);
                    if ( index === -1 ) return;
                    state.PageList.splice(index, 1);
                    setuptools.lightbox.menu.paginate.state.availableAccounts.PageList.push(account);
                    availableAccountsUpdate('add', account);
                    groupMembersUpdate('remove', account);

                }

                $('div.groupMembers > div.dragbox > div.cell:not(.nocontext)').click(function() {

                    var self = this;
                    if ( $(this).hasClass('selected') === false ) {

                        $(this).siblings().removeClass('selected');
                        $(this).addClass('selected');

                        //  default position is inline with the next sibling
                        var position = $(this);

                        //  if this is the last sibling then we anchor on the account search div
                        if ( position.length === 0 ) {
                            position = $('div.groupMembers div.pageControls > div.editor.control.searchName');
                        }

                        var callbackArg = $(this).text();
                        var options = [
                            {
                                option: 'header',
                                value: callbackArg
                            },
                            {
                                class: 'moveUp',
                                name: 'Move Up',
                                callback: MoveUp,
                                callbackArg: callbackArg
                            },
                            {
                                class: 'moveDown',
                                name: 'Move Down',
                                callback: MoveDown,
                                callbackArg: callbackArg
                            },
                            {
                                class: 'moveToTopGroup',
                                name: 'Move to Top of Group',
                                callback: MoveToTop,
                                callbackArg: callbackArg
                            },
                            {
                                class: 'moveToBottomGroup',
                                name: 'Move to Bottom of Group',
                                callback: MoveToBottom,
                                callbackArg: callbackArg
                            },
                            {
                                option: 'input',
                                class: 'addToSpecified',
                                value: groupMembersPaginate.html.search.replace('Search by Name', 'Move After Account...'),
                                binding: function() {

                                    //  update search binding for custom usage of pagination tools
                                    var searchName = setuptools.lightbox.menu.search.bind(
                                        setuptools.lightbox.menu.paginate.state.groupMembers,
                                        true,
                                        'input',
                                        $('div.setuptools.menu > div.input > div.pageControls > div.searchName > input[name="searchName"]'),
                                        {
                                            h: 'right',
                                            v: 'bottom',
                                            hpx: -11,
                                            vpx: 25
                                        },
                                        addToSpecified,
                                        'groupMembersAdd'
                                    );

                                    function addToSpecified(account) {

                                        var state = setuptools.lightbox.menu.paginate.state;

                                        //  find the index of the searched account
                                        var OldIndex = state.groupMembers.PageList.indexOf(callbackArg);
                                        if ( state.groupMembers.PageList.indexOf(account) === -1 ) return;

                                        //  move the account there
                                        state.groupMembers.PageList.splice(OldIndex, 0, callbackArg);
                                        state.groupMembers.PageList.splice(state.groupMembers.PageList.indexOf(account)+1, 0, callbackArg);

                                        //  update page display
                                        groupMembersUpdate('add', callbackArg);

                                    }

                                    $('div.input div.setuptools.div.pageControls div.search').click(function() {
                                        addToSpecified(searchName.val());
                                        setuptools.lightbox.menu.context.close();
                                    });

                                    searchName.keyup(function(e) {

                                        var value = $(this).val();
                                        if ( e.keyCode === 13 ) {
                                            addToSpecified(value);
                                            setuptools.lightbox.menu.context.close();
                                        }

                                    });

                                }
                            },
                            {
                                class: 'removeAccount',
                                name: 'Remove from Group',
                                callback: RemoveAccount,
                                callbackArg: callbackArg
                            },
                            {
                                class: 'copySelection',
                                name: 'Copy to Clipboard',
                                attributes: {
                                    'data-clipboard-text': callbackArg
                                }
                            },
                            {
                                class: 'addCancel',
                                name: 'Cancel',
                                callback: function() {}
                            },
                            {
                                option: 'pos',
                                vpx: 41
                            }
                        ];

                        setuptools.lightbox.menu.context.create('groupMembersAdd', false, position, options, self);

                    } else {

                        setuptools.lightbox.menu.context.close();
                        $(this).removeClass('selected');

                    }

                });

            }

            //  we need an array of accounts for pagination (non-members only)
            var availableAccountsList = [];
            var groupMembersList = [];
            for ( var i in setuptools.data.accounts.accounts )
                if ( setuptools.data.accounts.accounts.hasOwnProperty(i) )
                    if ( setuptools.data.groups.groupList[groupName].members.indexOf(i) === -1 ) {
                        availableAccountsList.push(i);
                    } else {
                        groupMembersList.push(i);
                    }

            //  clean up any old pagination data
            setuptools.lightbox.menu.paginate.clear();

            //  generate the pagination data
            var availableAccountsPaginate = setuptools.lightbox.menu.paginate.create(
                availableAccountsList,
                groupName,
                'availableAccounts',
                'div.availableAccounts div.dragbox',
                ListAccountTiles,
                availableAccountsContext
            );

            var groupMembersPaginate = setuptools.lightbox.menu.paginate.create(
                groupMembersList,
                groupName,
                'groupMembers',
                'div.groupMembers div.dragbox',
                ListGroupMembers,
                groupMembersContext
            );

            if ( self ) $(self).addClass('selected');
            var editor = $('.setuptools.div.groups.editor');
            editor.addClass('active');
            $('.setuptools.groupMember.cell[data-groupName!="' + groupName + '"]').removeClass('selected');
            $('.setuptools.div.groupEditor.container > h3').text('Group Editor - ' + groupName);

            //  build the editor
            var editorHeight = (setuptools.data.config.accountsPerPage+1)*41;
            //if ( availableAccountsList.length < setuptools.data.config.accountsPerPage ) editorHeight = (availableAccountsList.length+1)*41;

            //  display the editor
            editor.html(' \
                <br>\
                <div class="availableAccounts list" style="height: ' + editorHeight + 'px;">\
                    <div><strong>Available Accounts</strong></div> \
                    ' + availableAccountsPaginate.html.menu + ' \
                    <div class="dragbox">' + ListAccountTiles(groupName) + '</div> \
                </div> \
                <div class="groupMembers list" style="height: \' + editorHeight + \'px;">\
                    <div><strong>Group Members</strong></div> \
                    ' + groupMembersPaginate.html.menu + ' \
                    <div class="dragbox">' + ListGroupMembers(groupName) + '</div> \
                </div> \
                \
                <div class="availableAccounts">\
                    ' + availableAccountsPaginate.html.search + ' \
                </div>\
                \
                <div class="groupMembers">\
                    ' + groupMembersPaginate.html.search + ' \
                </div>\
                \
                <br><div class="setuptools groupSaveControls"> \
                    <div class="setuptools save group"> \
                        <a href="#" class="setuptools link save noclose">Save Changes</a> \
                    </div> \
                    <div class="save result"></div>\
            ');

            //  bind editor buttons
            availableAccountsPaginate.bind();
            groupMembersPaginate.bind();

            $('.setuptools.save.group').click(function() {

                setuptools.data.groups.groupList[groupName].members = setuptools.lightbox.menu.paginate.state.groupMembers.PageList;
                if ( setuptools.app.config.save() === true ) {

                    $('div.save.result').html('<div>Saved!</div>');
                    $('div.save.result > div').fadeOut(2500, function () {
                        $(this).remove();
                    });

                } else {

                    $('div.save.result').html('<div class="error">Error!</div>');
                    $('div.save.result > div').fadeOut(2500, function() {
                        $(this).remove();
                    });

                }

            });

        }

        //  close the group editor
        function CloseEditor() {

            $('.setuptools.div.groups.editor').removeClass('active');
            $('.setuptools.div.groupEditor.container > h3').text('Group Editor');
            $('.setuptools.div.groups.editor').text('Select a group or create a new one.');

        }

        //  select all groups
        function SelectAll() {

            $('.setuptools.groupMember.cell').addClass('selected');

        }

        //  deselect all groups
        function SelectNone() {

            $('.setuptools.groupMember.cell').removeClass('selected');

        }

        //  select all enabled groups
        function SelectAllEnabled() {

            SelectNone();
            for ( var i in setuptools.data.groups.groupList )
                if ( setuptools.data.groups.groupList.hasOwnProperty(i) )
                    if ( setuptools.data.groups.groupList[i].enabled === true )
                        $('.setuptools.groupMember.cell[data-groupName="' + i + '"]').addClass('selected');

        }

        //  select all disabled groups
        function SelectAllDisabled() {

            SelectNone();
            for ( var i in setuptools.data.groups.groupList )
                if ( setuptools.data.groups.groupList.hasOwnProperty(i) )
                    if ( setuptools.data.groups.groupList[i].enabled === false )
                        $('.setuptools.groupMember.cell[data-groupName="' + i + '"]').addClass('selected');

        }

        //  enable selected groups
        function EnableSelected() {

            $('.setuptools.groupMember.cell.selected').each(function(index, element) {

                var groupName = $(element).text();
                if ( setuptools.data.groups.groupList[groupName] ) setuptools.data.groups.groupList[groupName].enabled = true;
                setuptools.app.config.save();

            });

        }

        //  disable selected groups
        function DisableSelected() {

            $('.setuptools.groupMember.cell.selected').each(function(index, element) {

                var groupName = $(element).text();
                if ( setuptools.data.groups.groupList[groupName] ) setuptools.data.groups.groupList[groupName].enabled = false;
                setuptools.app.config.save();

            });

        }

        //  display group menu
        $('.setuptools.div.groupControls div.groupMenu').unbind('click').click(function (e) {

            //  move selected groups to start of list
            function MoveToStart() {

                //  rearrange the selected classes to the front of the list
                var groupList = [];
                for ( i = 0; i < selectedClass.length; i++ ) {

                    setuptools.data.groups.groupOrder.splice(setuptools.data.groups.groupOrder.indexOf($(selectedClass[i]).text()), 1);
                    setuptools.data.groups.groupOrder.splice(i, 0, $(selectedClass[i]).text());
                    groupList.push($(selectedClass[i]).text());

                }

                setuptools.app.config.save();
                setuptools.lightbox.close('groups-manager');
                setuptools.app.groups.manager(false, groupList);

            }

            //  move selected groups to end of list
            function MoveToEnd() {

                //  rearrange the selected classes to the front of the list
                var groupList = [];
                for ( i = 0; i < selectedClass.length; i++ ) {

                    setuptools.data.groups.groupOrder.splice(setuptools.data.groups.groupOrder.indexOf($(selectedClass[i]).text()), 1);
                    setuptools.data.groups.groupOrder.push($(selectedClass[i]).text());
                    groupList.push($(selectedClass[i]).text());

                }

                setuptools.app.config.save();
                setuptools.lightbox.close('groups-manager');
                setuptools.app.groups.manager(false, groupList);

            }

            //  move selected groups one spot to the left of the first selected group
            function MoveLeft() {

                //  rearrange the selected classes to the front of the list
                var groupList = [];
                var index = setuptools.data.groups.groupOrder.indexOf($(selectedClass[0]).text())-1;
                if ( index < 0 ) index = 0;
                for ( i = 0; i < selectedClass.length; i++ ) {

                    setuptools.data.groups.groupOrder.splice(setuptools.data.groups.groupOrder.indexOf($(selectedClass[i]).text()), 1);
                    setuptools.data.groups.groupOrder.splice(index+i, 0, $(selectedClass[i]).text());
                    groupList.push($(selectedClass[i]).text());

                }

                setuptools.app.config.save();
                setuptools.lightbox.close('groups-manager');
                setuptools.app.groups.manager(false, groupList);

            }

            //  move selected groups one spot to the right of the last selected group
            function MoveRight() {

                //  rearrange the selected classes to the front of the list
                var groupList = [];
                var index = setuptools.data.groups.groupOrder.indexOf($(selectedClass[$(selectedClass).length-1]).text())+1;
                if ( index > setuptools.data.groups.groupOrder.length ) index = setuptools.data.groups.groupOrder;
                for ( i = 0; i < selectedClass.length; i++ ) {

                    setuptools.data.groups.groupOrder.splice(setuptools.data.groups.groupOrder.indexOf($(selectedClass[i]).text()), 1);
                    setuptools.data.groups.groupOrder.splice(index+i, 0, $(selectedClass[i]).text());
                    groupList.push($(selectedClass[i]).text());

                }

                setuptools.app.config.save();
                setuptools.lightbox.close('groups-manager');
                setuptools.app.groups.manager(false, groupList);

            }

            //  deselect other menu options
            $('.setuptools.div.groupControls div:not(.groupMenu)').each(function(index, element) {
                $(element).removeClass('selected');
            });

            var selectedClass = $('.setuptools.div.groupList div.dragbox div.cell.selected');
            var selectedCount = selectedClass.length;
            var self = this;

            //  nothing selected so we should close the menu to reset it
            if ( selectedCount === 0 ) {

                setuptools.lightbox.menu.context.close();

            }
            //  single group menu
            else if (selectedCount === 1) {

                //  enable/disable, edit, delete

                if ( $('.setuptools.div.groupControls div.groupMenu').hasClass('selected') === false ) {

                    //  base info
                    $(self).addClass('selected');
                    var groupName = selectedClass.text();
                    var position = $('.setuptools.div.groupList div.dragbox div.cell:first-child');
                    var options = [
                        {
                            option: 'header',
                            value: groupName
                        },
                        {
                            class: 'edit',
                            name: 'Edit',
                            callback: function() {
                                OpenEditor(groupName);
                            }
                        },
                        {
                            class: 'copy',
                            name: 'Copy',
                            callback: function() {
                                setuptools.lightbox.close('groups-manager');
                                setuptools.app.groups.copy(groupName);
                            }
                        },
                        {
                            class: 'rename',
                            name: 'Rename',
                            callback: function() {
                                setuptools.lightbox.close('groups-manager');
                                setuptools.app.groups.rename(groupName);
                            }
                        }
                    ];

                    if ( setuptools.data.groups.groupList[groupName].enabled === false ) {

                        options.push({
                            class: 'enable',
                            name: 'Enable',
                            callback: EnableSelected
                        });

                    } else {

                        options.push({
                            class: 'disable',
                            name: 'Disable',
                            callback: DisableSelected
                        });

                    }

                    //  group ordering options if at least one unselected group remains
                    if ( $('.setuptools.div.groupList div.dragbox div.cell:not(.selected)').length > 0 ) {

                        options.push({
                            class: 'moveToStart',
                            name: 'Move to Start',
                            callback: MoveToStart
                        });

                        options.push({
                            class: 'moveToEnd',
                            name: 'Move to End',
                            callback: MoveToEnd
                        });

                        options.push({
                            class: 'moveLeft',
                            name: 'Move Left',
                            callback: MoveLeft
                        });

                        options.push({
                            class: 'moveRight',
                            name: 'Move Right',
                            callback: MoveRight
                        });

                    }

                    options.push({
                        class: 'delete',
                        name: 'Delete',
                        callback: function() {
                            setuptools.lightbox.close('groups-manager');
                            setuptools.app.groups.delete(groupName);
                        }
                    });

                    setuptools.lightbox.menu.context.create('groupMenu', false, position, options, self);

                } else {

                    setuptools.lightbox.menu.context.close();

                }

            }
            //  multi group menu
            else if ( selectedCount > 1 ) {

                //  enable/disable all, delete, add/remove specific account
                if ( $('.setuptools.div.groupControls div.groupMenu').hasClass('selected') === false ) {

                    //  base info
                    $(self).addClass('selected');
                    var position = $('.setuptools.div.groupList div.dragbox div.cell:first-child');
                    var options = [
                        {
                            option: 'header',
                            value: 'Groups Menu '
                        },
                        {
                            class: 'enable',
                            name: 'Enable Selected',
                            callback: EnableSelected
                        },
                        {
                            class: 'disable',
                            name: 'Disable Selected',
                            callback: DisableSelected
                        }
                    ];

                    //  group ordering options if at least one unselected group remains
                    if ( $('.setuptools.div.groupList div.dragbox div.cell:not(.selected)').length > 0 ) {

                        options.push({
                            class: 'moveToStart',
                            name: 'Move to Start',
                            callback: MoveToStart
                        });

                        options.push({
                            class: 'moveLeft',
                            name: 'Move Left',
                            callback: MoveLeft
                        });

                        options.push({
                            class: 'moveRight',
                            name: 'Move Right',
                            callback: MoveRight
                        });

                        options.push({
                            class: 'moveToEnd',
                            name: 'Move to End',
                            callback: MoveToEnd
                        });

                    }

                    options.push({
                        class: 'mergeSelected',
                        name: 'Merge',
                        callback: function() {
                            setuptools.lightbox.close('groups-manager');
                            setuptools.app.groups.merge(selectedClass);
                        }
                    });

                    options.push({
                        class: 'delete',
                        name: 'Delete',
                        callback: function() {
                            setuptools.lightbox.close('groups-manager');
                            setuptools.app.groups.delete(selectedClass);
                        }
                    });

                    setuptools.lightbox.menu.context.create('groupMenu', false, position, options, self);

                } else {

                    setuptools.lightbox.menu.context.close();

                }

            }

        });

        //  selection menu
        $('.setuptools.div.groupControls div.groupSelect').click(function (e) {

            var self = this;

            //  deselect other menu options
            $('.setuptools.div.groupControls div:not(.groupSelect)').each(function(index, element) {
               $(element).removeClass('selected');
            });

            //  display the menu
            if ( $('.setuptools.div.groupControls div.groupSelect').hasClass('selected') === false ) {

                //  base info
                $(self).addClass('selected');
                var position = $('.setuptools.div.groupList div.dragbox div.cell:first-child');
                var options = [
                    {
                        option: 'header',
                        value: 'Select Menu'
                    },
                    {
                        class: 'selectAll',
                        name: 'Select All',
                        callback: SelectAll
                    },
                    {
                        class: 'selectNone',
                        name: 'Deselect All',
                        callback: SelectNone
                    },
                    {
                        class: 'selectEnabled',
                        name: 'Select Enabled Groups',
                        callback: SelectAllEnabled
                    },
                    {
                        class: 'selectDisabled',
                        name: 'Select Disabled Groups',
                        callback: SelectAllDisabled
                    }
                ];

                setuptools.lightbox.menu.context.create('groupSelect', false, position, options, self);

            } else {

                setuptools.lightbox.menu.context.close();

            }

        });

    }

    /* end group list controls */

    //  group selection
    var start;
    var finish;
    var timer;
    var triggered;
    var firstSelected;
    var lastSelected = false;
    var mouseDown = false;
    var mouseOver = false;
    var mouseLeave = false;
    var mouseUp = false;
    var direction = false;
    var touched = [];

    //  single click - toggle selection
    //  long click - open group in editor
    $('.setuptools.groupMember.cell').on('mousedown', function() {

        setuptools.lightbox.menu.context.close();

        mouseDown = true;
        mouseOver = false;
        mouseLeave = false;
        mouseUp = false;

        var self = this;
        finish = undefined;

        direction = $(this).hasClass('selected');
        $(this).addClass('selected');
        if ( setuptools.state.ctrlKey === false ) $(this).siblings().removeClass('selected');
        firstSelected = $(self).text();
        lastSelected = false;
        triggered = false;
        start = new Date().getTime();
        timer = setTimeout(function() {

            OpenEditor($(self).text(), self);
            triggered = true;

        }, setuptools.data.config.longpress);

    }).on('mouseleave', function() {

        mouseOver = false;
        mouseLeave = true;

        if ( mouseDown === false ) return;
        start = 0;
        clearTimeout(timer);

    }).on('mouseup', function() {

        mouseOver = false;
        mouseLeave = false;
        mouseUp = true;

        if ( mouseDown === false ) return;
        var self = this;
        finish = new Date().getTime();
        lastSelected = $(self).text();
        clearTimeout(timer);
        if ( triggered === true ) return;

        //  select everything in between
        if ( firstSelected !== lastSelected ) {

            var cells = $('.setuptools.groupMember.cell');
            var firstIndex = setuptools.data.groups.groupOrder.indexOf(firstSelected);
            var lastIndex = setuptools.data.groups.groupOrder.indexOf(lastSelected);
            if ( setuptools.state.ctrlKey === false ) $(this).siblings().removeClass('selected');

            //  ascending selection
            if ( firstIndex < lastIndex )
                for ( i = firstIndex; i <= lastIndex; i++ )
                    $(cells.get(i)).addClass('selected');

            //  descending selection
            if ( firstIndex > lastIndex )
                for ( i = lastIndex; i <= firstIndex; i++ )
                    $(cells.get(i)).addClass('selected');

        } else {

            if ( direction === true ) {
                $(this).removeClass('selected');
                return;
            }

            $(this).addClass('selected');
            if ( setuptools.state.ctrlKey === false ) $(this).siblings().removeClass('selected');

        }

        mouseDown = false;
        touched = [];

    });

    /* begin group accounts management */

    if ( !manual ) {



    }

    /* end group accounts management */

    //  provide switch for basic/advanced modes
    $('.setuptools.bottom.container').append(' \
        <div style="clear: right; float: right; height: 100%;"> \
            <br>Switch to <a href="#" class="setuptools link groups manager switchModes">' + ( (manual === true) ? 'Advanced' : 'Basic' ) + ' Mode</a> \
            <span style="font-weight: bold;">&#10095;</span> \
        </div> \
    ');

    $('.setuptools.link.groups.manager.switchModes').click(function() {
        var mode = ( manual != true );
        var groupName = $('input[name="groupName"]').val();
        setuptools.lightbox.menu.context.close();
        setuptools.app.groups.manager(mode, groupName);
    });

};

//  facilitate deletion of the specified group or groups
setuptools.app.groups.delete = function(groupName) {

    //  this should be a jquery object
    if ( typeof groupName === 'object' ) {

        if ( groupName.length > 0 ) {

            newGroupName = [];
            for ( i = 0; i < groupName.length; i++ )
                if ( groupName.hasOwnProperty(i) )
                    newGroupName.push($(groupName[i]).text());

            setuptools.app.groups.delete(newGroupName.join(','));
            return;

        }

    } else {

        var groupNames = groupName.split(',');
        if ( groupNames.length === 0 && typeof groupName !== 'string') setuptools.lightbox.error('Either groupName was not a string or was not provided', 27);

    }

    if ( groupNames.length < 2 ) setuptools.lightbox.build('groups-delete', 'Are you sure you wish to delete the following group?');
    if ( groupNames.length > 1 ) setuptools.lightbox.build('groups-delete', 'Are you sure you wish to delete the following groups?');

    var groupList = groupName;
    if ( groupNames.length > 0 ) groupList = groupNames.join(', ');

    setuptools.lightbox.build('groups-delete', ' \
        <br><br>' + groupList + ' \
        <br><br><a href="#" class="setuptools link confirm">Yes, delete</a> or <a href="#" class="setuptools link cancel">No, cancel</a>\
    ');

    setuptools.lightbox.settitle('groups-delete', 'Delete Group');
    setuptools.lightbox.goback('groups-delete', setuptools.app.groups.manager);
    setuptools.lightbox.drawhelp('groups-delete', 'docs/setuptools/help/groups-manager/delete', 'Delete Group Help');
    setuptools.lightbox.display('groups-delete');

    $('.setuptools.link.confirm').click(function() {

        //  parse the provided group list
        groupList = groupList.split(', ');
        for ( i = 0; i < groupList.length; i++ ) {

            delete setuptools.data.groups.groupList[groupList[i]];
            setuptools.data.groups.groupOrder.splice(setuptools.data.groups.groupOrder.indexOf(groupList[i]), 1);

        }

        setuptools.app.config.save();
        setuptools.app.groups.manager();

    });

    $('.setuptools.link.cancel').click(setuptools.app.groups.manager);

};

//  copy specified group
setuptools.app.groups.copy = function(groupName, newGroupName) {

    if ( typeof setuptools.data.groups.groupList[groupName] === 'undefined' ) {

        setuptools.lightbox.build('groups-copy', 'The specified group "' + groupName + '" does not exist.');

    } else {

        if (newGroupName) setuptools.lightbox.build('groups-copy', ' \
            The new group name provided already exists.<br><br> \
        ');

        if (!newGroupName) newGroupName = '';

        setuptools.lightbox.build('groups-copy', ' \
            Provide a name for the new group. <br><br> \
            <div class="setuptools div app groups">\
                <div><strong>Group Name</strong></div> \
                <input name="groupName" value="' + newGroupName + '"> \
            </div> \
            <div style="float: left; width: 100%;"> \
                <br><a href="#" class="setuptools app save">Create Group</a> \
            </div> \
        ');

    }

    setuptools.lightbox.settitle('groups-copy', 'Create Group Copy');
    setuptools.lightbox.goback('groups-copy', setuptools.app.groups.manager);
    setuptools.lightbox.drawhelp('groups-copy', 'docs/setuptools/help/groups-manager/copy', 'Create Group Copy Help');
    setuptools.lightbox.display('groups-copy', {variant: 'setuptools-medium'});

    $('input[name="groupName"]').focus();

    function Process() {

        var newGroupName = $('input[name="groupName"]').val();
        if ( typeof setuptools.data.groups.groupList[newGroupName] === 'object' ) {
            setuptools.lightbox.close('groups-copy');
            setuptools.app.groups.copy(groupName, newGroupName);
            return;
        }

        setuptools.data.groups.groupList[newGroupName] = $.extend(true, {}, setuptools.data.groups.groupList[groupName]);
        setuptools.data.groups.groupOrder.push(newGroupName);

        setuptools.app.config.save();
        setuptools.lightbox.close('groups-copy');
        setuptools.app.groups.manager();

    }

    $('input[name="groupName"]').keyup(function(e) {
        if ( e.keyCode === 13 ) Process();
    });

    $('.setuptools.app.save').click(Process);

};

//  rename specified group (copy+delete)
setuptools.app.groups.rename = function(groupName, newGroupName) {

    if ( typeof setuptools.data.groups.groupList[groupName] === 'undefined' ) {

        setuptools.lightbox.build('groups-rename', 'The specified group "' + groupName + '" does not exist.');

    } else {

        if ( typeof newGroupName === 'string' ) {

            if ( newGroupName.length < 1 ) {
                setuptools.lightbox.build('groups-rename', ' \
                    Group names cannot be empty.<br><br> \
                ');
            } else {
                setuptools.lightbox.build('groups-rename', ' \
                    The new group name provided already exists.<br><br> \
                ');
            }
        }

        if ( !newGroupName ) newGroupName = '';

        setuptools.lightbox.build('groups-rename', ' \
            Provide the name you wish to rename group "' + groupName + '" as. <br><br> \
            <div class="setuptools div app groups">\
                <div><strong>New Group Name</strong></div> \
                <input name="groupName" value="' + newGroupName + '"> \
            </div> \
            <div style="float: left; width: 100%;"> \
                <br><a href="#" class="setuptools app save">Rename Group</a> \
            </div> \
        ');


    }

    setuptools.lightbox.settitle('groups-rename', 'Rename Group');
    setuptools.lightbox.goback('groups-rename', setuptools.app.groups.manager);
    setuptools.lightbox.drawhelp('groups-rename', 'docs/setuptools/help/groups-manager/rename', 'Rename Group Help');
    setuptools.lightbox.display('groups-rename', {variant: 'setuptools-medium'});

    $('input[name="groupName"]').focus();

    function Process() {

        var newGroupName = $('input[name="groupName"]').val();

        if ( typeof setuptools.data.groups.groupList[newGroupName] === 'object' || newGroupName.length < 1 ) {
            console.log(newGroupName, newGroupName.length);
            setuptools.lightbox.close('groups-rename');
            setuptools.app.groups.rename(groupName, newGroupName);
            return;
        }

        //  create copy
        var index = setuptools.data.groups.groupOrder.indexOf(groupName);
        setuptools.data.groups.groupList[newGroupName] = $.extend(true, {}, setuptools.data.groups.groupList[groupName]);

        //  delete old group
        delete setuptools.data.groups.groupList[groupName];

        //  update groupOrder
        setuptools.data.groups.groupOrder.splice(index, 1, newGroupName);

        setuptools.app.config.save();
        setuptools.lightbox.close('groups-rename');
        setuptools.app.groups.manager();

    }

    $('input[name="groupName"]').keyup(function(e) {
        if ( e.keyCode === 13 ) Process();
    });

    $('.setuptools.app.save').click(Process);

};

//  merge selected groups
setuptools.app.groups.merge = function(selectedClass, newGroupName) {

    if ( selectedClass.length === 0 ) {

        setuptools.lightbox.build('groups-merge', 'No selected groups were included to be merged.');

    } else {

        if (newGroupName) setuptools.lightbox.build('groups-merge', ' \
            The new group name provided already exists.<br><br> \
        ');

        if (!newGroupName) newGroupName = '';

        setuptools.lightbox.build('groups-merge', ' \
            <div class="setuptools div app groups">\
                <div><strong>Merged Group Name</strong></div> \
                <input name="groupName" value="' + newGroupName + '"> \
            </div> \
            <div class="setuptools div app groups"> \
                <div><strong>Keep Old Groups</strong></div> \
                <select name="keepGroups"> \
                    <option value="0">No</option> \
                    <option value="1">Yes</option> \
                </select>\
            </div> \
            <div style="float: left; width: 100%;"> \
                <br><a href="#" class="setuptools app save">Merge Groups</a> \
            </div> \
        ');

    }

    setuptools.lightbox.settitle('groups-merge', 'Merge Groups');
    setuptools.lightbox.goback('groups-merge', setuptools.app.groups.manager);
    setuptools.lightbox.drawhelp('groups-merge', 'docs/setuptools/help/groups-manager/merge', 'Merge Groups Help');
    setuptools.lightbox.display('groups-merge', {variant: 'setuptools-medium'});

    $('input[name="groupName"]').focus();

    function Process() {

        var newGroupName = $('input[name="groupName"]').val();
        var keepGroups = ( $('select[name="keepGroups"]').val() === "1" );
        var nameAsExisting = false;

        for ( i = selectedClass.length-1; i >= 0; i-- )
            if ( $(selectedClass[i]).text() === newGroupName )
                nameAsExisting = true;

        if ( typeof setuptools.data.groups.groupList[newGroupName] === 'object' && nameAsExisting === false ) {
            setuptools.lightbox.close('groups-merge');
            setuptools.app.groups.merge(selectedClass, newGroupName);
            return;
        }

        //  process merger in order of least priority
        setuptools.data.groups.groupList[newGroupName] = {};
        var newMemberList = [];
        for ( i = selectedClass.length-1; i >= 0; i-- ) {

            var currentGroup = $(selectedClass[i]).text();
            var lastIndex = setuptools.data.groups.groupOrder.indexOf(currentGroup);

            //  merge currentGroup into new group
            newMemberList = newMemberList.concat(setuptools.data.groups.groupList[currentGroup].members);

            //  delete old groups after merger unless specified
            if ( keepGroups === false ) {

                delete setuptools.data.groups.groupList[currentGroup];
                setuptools.data.groups.groupOrder.splice(lastIndex, 1);

            }

        }

        //  create the new group
        setuptools.data.groups.groupList[newGroupName] = $.extend(
            true,
            {},
            setuptools.data.groups.groupList[$(selectedClass[lastIndex]).text()]
        );
        setuptools.data.groups.groupList[newGroupName].members = newMemberList;

        //  update groupOrder and place it at the position of the highest priority merge member
        setuptools.data.groups.groupOrder.splice(lastIndex, 0, newGroupName);

        setuptools.app.config.save();
        setuptools.lightbox.close('groups-merge');
        setuptools.app.groups.manager();

    }

    $('input[name="groupName"]').keyup(function(e) {
        if ( e.keyCode === 13 ) Process();
    });

    $('.setuptools.app.save').click(Process);

};

//  assist user in creating a new group
setuptools.app.groups.add = function(manual) {

    //  check if groups have been initialized
    if ( typeof setuptools.data.groups.format === 'undefined' ) {

        setuptools.data.groups.format = 1;
        setuptools.data.groups.groupList = {};
        setuptools.data.groups.groupOrder = [];

    }

    setuptools.lightbox.build('groups-add', ' \
        <div class="setuptools div groups error"></div> \
        <div class="setuptools div app groups">\
            <div><strong>Group Name</strong></div> \
            <input name="groupName"> \
        </div> \
        <div class="setuptools div app groups">\
            <div><strong>Enabled</strong></div> \
            <select name="enabled"> \
                <option value="0">No</option> \
                <option value="1" selected>Yes</option> \
            </select> \
        </div> \
        <div class="setuptools div app groups">\
            <div><strong>Group Order Position</strong></div> \
            <select name="position"> \
                <option>1</option>\
    ');

    for ( i = 1; i <= setuptools.data.groups.groupOrder.length; i++ ) {

        setuptools.lightbox.build('groups-add', ' \
            <option ' + ( (i === (setuptools.data.groups.groupOrder.length)) ? 'selected' : '' ) + '>' + Number(i+1) + '</option> \
        ');

    }

    setuptools.lightbox.build('groups-add', ' \
            </select> \
        </div> \
        <div style="float: left; width: 100%;"> \
            <br><a href="#" class="setuptools app save">Create Group</a> \
        </div> \
    ');

    setuptools.lightbox.settitle('groups-add', 'Create New Group');
    setuptools.lightbox.goback('groups-add', setuptools.app.groups.manager);
    setuptools.lightbox.drawhelp('groups-add', 'docs/setuptools/help/groups-manager/add', 'New Group Help');
    setuptools.lightbox.display('groups-add', {variant: 'setuptools-medium'});

    //  take focus on display
    $('input[name="groupName"]').focus();

    //  handle saving
    function GroupSave(doClose) {

        var groupName = $('input[name="groupName"]').val();
        var enabled = ( $('select[name="enabled"]').val() === "1" );
        var position = Number($('select[name="position"]').val())-1;

        //  create the default group object if none exists
        if ( !setuptools.data.groups.groupList[groupName] ) setuptools.data.groups.groupList[groupName] = $.extend(true, {}, setuptools.objects.group, {enabled: enabled});

        //  add to groupOrder
        setuptools.data.groups.groupOrder.splice(position, 0, groupName);

        //  manually close the old lightbox
        if ( doClose === true ) setuptools.lightbox.close('groups-add');

        //  back to groups manager
        setuptools.app.config.save();
        setuptools.app.groups.manager(manual, groupName);

    }

    $('.setuptools.div.app select, .setuptools.div.app input').keyup(function(e) {
        if ( e.keyCode === 13 ) GroupSave(true);
    });

    $('.setuptools.app.save').click(GroupSave);


};

//  generate an accounts variable from enabled groups
setuptools.app.groups.load = function(accounts) {

    var AccountList = [];
    var groupAccounts = {};

    //  loop through groups in reverse order and generate our ordered list
    for ( i = 0; i < setuptools.data.groups.groupOrder.length; i++ ) {

        //  check if this group is enabled
        var groupData = setuptools.data.groups.groupList[setuptools.data.groups.groupOrder[i]];
        if ( groupData.enabled === true ) {

            //  merge it into the accounts variable
            AccountList = AccountList.concat(groupData.members);

        }

    }

    //  build the accounts object
    for ( x = 0; x < AccountList.length; x++ ) {

        var AccountName = AccountList[x];
        if ( typeof accounts[AccountName] === 'string' ) groupAccounts[AccountName] = accounts[AccountName];

    }

    return groupAccounts;

};