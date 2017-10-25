//  so it begins
setuptools.app.groups.manager = function(manual, group) {

    /*setuptools.lightbox.build('groups-manager', 'Feature coming soon!');
    setuptools.lightbox.settitle('groups-manager', 'Groups Manager');
    setuptools.lightbox.goback('groups-manager', setuptools.app.index);
    setuptools.lightbox.drawhelp('groups-manager', 'docs/setuptools/help/accounts-manager/groups', 'Groups Manager Help');
    setuptools.lightbox.display('groups-manager', {variant: 'setuptools-tiles'});*/

    if ( typeof manual != 'boolean' ) manual = false;
    if ( typeof group != 'string' ) group = '';
    var draggable = false;
    setuptools.lightbox.build('groups-manager', ' \
        <h3>Available Actions</h3> \
        <a href="#" class="setuptools link groups add">Create Group</a> | \
        <a href="#" class="setuptools link groups enableAll">Enable All</a> | \
        <a href="#" class="setuptools link groups disableAll">Disable All</a> \
        <div class="setuptools div groups container"> \
        <br><strong>Existing Groups</strong> \
        <br> \
    ');

    //  display existing groups
    //
    if ( Object.keys(setuptools.data.groups).length === 0 ) {

        setuptools.lightbox.build('groups-manager', 'There are no groups.');

    } else {

        //  advanced manager
        if ( !manual ) {

            setuptools.lightbox.build('groups-manager', ' \
                <div class="setuptools div groupControls"> \
                    <div class="groupMenu" title="Group Menu">M</div> \
                    <div class="groupSort" title="Enable Group Sorting">C</div> \
                    <div class="groupSelect" title="Select Menu">S</div> \
                </div> \
                <div class="setuptools div groupList"> \
                    <div class="dragbox"> \
            ');

            for ( var i in setuptools.data.groups )
                setuptools.lightbox.build('groups-manager', '<div class="setuptools groupMember cell" data-groupName="' + i + '">' + i + '</div>');

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
        <div class="setuptools div groupEditor container"> \
            <br><strong>Group Editor</strong> \
            <div class="setuptools div groups editor">Select a group or create a new one.</div> \
            </div> \
        </div>\
    ');

    setuptools.lightbox.settitle('groups-manager', 'Groups Manager');
    setuptools.lightbox.goback('groups-manager', setuptools.app.index);
    setuptools.lightbox.drawhelp('groups-manager', 'docs/setuptools/help/groups-manager/manager', 'Groups Manager Help');
    setuptools.lightbox.display('groups-manager', {variant: 'setuptools-tiles'});

    $('.setuptools.link.groups.add').click(setuptools.app.groups.add);

    /* begin group controls */

    if ( !manual ) {

        //  display the group editor
        function OpenEditor(groupName, self) {

            console.log('Opening editor', groupName);
            if ( self ) $(self).addClass('selected');
            $('.setuptools.groupMember.cell[data-groupName!="' + groupName + '"]').removeClass('selected');
            $('.setuptools.div.groups.editor').text(groupName);

        }

        //  close the group editor
        function CloseEditor() {

            $('.setuptools.div.groups.editor').text('Select a group or create a new one.');

        }

        //  display group menu
        $('.setuptools.div.groupControls div.groupMenu').click(function (e) {

            //  deselect other menu options
            $('.setuptools.div.groupControls div:not(.groupMenu)').each(function(index, element) {
                $(element).removeClass('selected');
            });

            var selectedClass = $('.setuptools.div.groupList div.dragbox div.cell.selected');
            var selectedCount = selectedClass.length;
            var self = this;

            //  single group menu
            if (selectedCount === 1) {

                //  enable/disable, edit, delete

                if ( $('.setuptools.div.groupControls div.groupMenu').hasClass('selected') === false ) {

                    //  base info
                    $(self).addClass('selected');
                    var groupName = selectedClass.text();
                    var position = $('.setuptools.div.groupList div.dragbox div.cell:first-child').offset();
                    var options = [
                        {
                            class: 'edit',
                            name: 'Edit',
                            callback: function() {
                                OpenEditor(groupName);
                            }
                        },
                        {
                            class: 'disable',
                            name: 'Disable',
                            callback: function() {
                                console.log('Disable', groupName);
                            }
                        },
                        {
                            class: 'delete',
                            name: 'Delete',
                            callback: function() {
                                setuptools.lightbox.close('groups-manager');
                                setuptools.app.groups.delete(groupName);
                            }
                        }
                    ];

                    setuptools.lightbox.menu('Group - ' + groupName, position, options, self);

                } else {

                    setuptools.lightbox.menuClose(self);

                }

                //  multi group menu
            } else {

                //  enable/disable all, delete, add/remove specific account

            }

        });

        //  toggle group sorting
        $('.setuptools.div.groupControls div.groupSort').click(function () {

            //  deselect other menu options
            $('.setuptools.div.groupControls div:not(.groupSort)').each(function(index, element) {
                $(element).removeClass('selected');
            });

            //  remove any existing context menu
            $('.setuptools.div.menu').remove();

            //  mark this menu option as selected
            $(this).toggleClass('selected');

            //  enable dragging
            if (draggable === false) {

                $(this).attr('title', 'Disable Group Sorting');
                draggable = new Draggable.Sortable(document.querySelectorAll('.setuptools.div.groupList div.dragbox'), {
                    draggable: '.setuptools.div.groupList div.cell',
                    classes: {
                        'source:dragging': 'dragging'
                    }
                });

                //  disable dragging
            } else {

                draggable.destroy();
                draggable = false;
                $(this).attr('title', 'Enable Group Sorting');

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
                var position = $('.setuptools.div.groupList div.dragbox div.cell:first-child').offset();
                var options = [
                    {
                        class: 'selectAll',
                        name: 'Select All',
                        callback: function() {
                            console.log('Select all');
                        }
                    },
                    {
                        class: 'selectNone',
                        name: 'Deselect All',
                        callback: function() {
                            console.log('Deselect All');
                        }
                    },
                    {
                        class: 'selectEnabled',
                        name: 'Select Enabled Groups',
                        callback: function() {
                            console.log('Select Enabled');
                        }
                    },
                    {
                        class: 'selectDisabled',
                        name: 'Select Disabled Groups',
                        callback: function() {
                            console.log('Select Disabled');
                        }
                    }
                ];

                setuptools.lightbox.menu('Select Menu', position, options, self);

            } else {

                setuptools.lightbox.menuClose(self);

            }

        });

    }

    /* end group controls */

    //  group selection
    var start;
    var timer;
    var triggered;

    //  single click - toggle selection
    //  long click - open group in editor
    $('.setuptools.groupMember.cell').on('mousedown', function() {

        var self = this;
        triggered = false;
        start = new Date().getTime();
        timer = setTimeout(function() {

            OpenEditor($(self).text(), self);
            triggered = true;

        }, setuptools.data.config.longpress);

    }).on('mouseleave', function() {

        start = 0;
        clearTimeout(timer);

    }).on('mouseup', function() {

        clearTimeout(timer);
        if ( triggered === true ) return;
        if ( new Date().getTime() >= ( start + setuptools.data.config.longpress )  ) {
            OpenEditor($(this).text(), this);
        } else {
            if ( $(this).hasClass('selected') === true ) CloseEditor();
            $(this).toggleClass('selected');
        }

    });

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
        setuptools.app.groups.manager(mode, groupName);
    });

};

//  facilitate deletion of the specified group
setuptools.app.groups.delete = function(groupName) {

    if ( typeof groupName !== 'string' ) setuptools.lightbox.error('Either groupName was not a string or was not provided', 27);
    if ( typeof setuptools.data.groups[groupName] === 'undefined' ) setuptools.lightbox.error('Group ' + groupName + ' does not exist', 28);
    setuptools.lightbox.build('groups-delete', ' \
        Are you sure you wish to delete the following group?\
        <br><br>' + groupName + ' \
        <br><br><a href="#" class="setuptools link confirm">Yes, delete</a> or <a href="#" class="setuptools link cancel">No, cancel</a>\
    ');

    setuptools.lightbox.settitle('groups-delete', 'Delete Group');
    setuptools.lightbox.goback('groups-delete', setuptools.app.groups.manager);
    setuptools.lightbox.drawhelp('groups-delete', 'docs/setuptools/help/groups-manager/delete', 'Delete Group Help');
    setuptools.lightbox.display('groups-delete');

    $('.setuptools.link.confirm').click(function() {

        delete setuptools.data.groups[groupName];
        setuptools.app.groups.manager();

    });

    $('.setuptools.link.cancel').click(setuptools.app.groups.manager);

};

//  assist user in creating a new group
setuptools.app.groups.add = function(manual) {

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
            <div><strong>Priority</strong></div> \
            <select name="priority"> \
    ');

    for ( i = 20; i > 0; i-- ) {

        setuptools.lightbox.build('groups-add', ' \
            <option ' + ( (i === 10) ? 'selected' : '' ) + '>' + i + '</option> \
        ');

    }

    setuptools.lightbox.build('groups-add', ' \
            </select> \
        </div> \
        <div style="float: left; width: 100%;"> \
            <br><a href="#" class="setuptools app save">Create Group</a> \
        </div> \
    ');

    setuptools.lightbox.tiles('groups-add');

    setuptools.lightbox.settitle('groups-add', 'Create New Group');
    setuptools.lightbox.goback('groups-add', setuptools.app.groups.manager);
    setuptools.lightbox.drawhelp('groups-add', 'docs/setuptools/help/groups-manager/add', 'New Group Help');
    setuptools.lightbox.display('groups-add');

    //  take focus on display
    $('input[name="groupName"]').focus();

    //  handle saving
    function GroupSave(doClose) {

        var groupName = $('input[name="groupName"]').val();
        var enabled = ( $('input[name="enabled"]').val() === "1" );
        var priority = Number($('select[name="priority"]').val());

        //  create the default group object if none exists
        if ( !setuptools.data.groups[groupName] ) setuptools.data.groups[groupName] = $.extend(true, {}, setuptools.objects.group);

        //  merge into existing config
        $.extend(true, setuptools.data.groups[groupName], {enabled: enabled, priority: priority});

        //  manually close the old lightbox
        if ( doClose === true ) setuptools.lightbox.close('groups-add');

        //  back to groups manager
        setuptools.app.groups.manager(manual, groupName);

    }

    $('.setuptools.div.app select, .setuptools.div.app input').keyup(function(e) {
        if ( e.keyCode === 13 ) GroupSave(true);
    });

    $('.setuptools.app.save').click(GroupSave);


};
