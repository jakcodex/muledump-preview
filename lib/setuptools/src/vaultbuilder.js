setuptools.app.muledump.vaultbuilder = {
    menu: {},
    tasks: {}
};

setuptools.app.muledump.vaultbuilder.vaultChangeTimer = function(ttl) {

    $(this).parent().parent().attr('data-valutId', $(this).attr('data-vaultId'));
    if ( ttl !== 0 && typeof ttl !== 'number' ) ttl = 2000;
    if ( setuptools.tmp.vaulteditoridchangetimer ) clearTimeout(setuptools.tmp.vaulteditoridchangetimer);
    setuptools.tmp.vaulteditoridchangetimer = setTimeout(setuptools.app.muledump.vaultbuilder.pushChanges, ttl);

};

setuptools.app.muledump.vaultbuilder.drawVaultLayout = function(layout, guid) {

    if ( typeof layout !== 'number' && typeof layout !== 'string' ) layout = setuptools.data.muledump.vaultbuilder.config.layout;
    if ( typeof guid !== 'string' ) guid = setuptools.data.muledump.vaultbuilder.config.guid;
    if ( typeof guid === 'string' ) setuptools.data.muledump.vaultbuilder.config.guid = guid;
    if ( typeof layout === 'string' ) layout = +layout;
    if ( typeof layout !== 'number' ) layout = setuptools.data.options.vaultlayout;
    if ( typeof layout === 'number' ) setuptools.data.muledump.vaultbuilder.config.layout = layout;
    if ( guid === 'default' ) guid = undefined;

    setuptools.tmp.vaultbuilderState = {
        data: $.extend(true, {}, setuptools.data.muledump.vaultbuilder.layouts[layout])
    };
    var state = setuptools.tmp.vaultbuilderState;

    var html = '';
    state.data.vaultorder.filter(function(vaultid) {

        var state = 'closed';
        if ( vaultid === 0 ) state = 'blank';
        if (
            typeof guid === 'string' &&
            vaultid > 0 &&
            typeof mules[guid].data.query.results.Chars.Account.Vault === 'object' &&
            Array.isArray(mules[guid].data.query.results.Chars.Account.Vault.Chest) &&
            mules[guid].data.query.results.Chars.Account.Vault.Chest.length >= vaultid ) state = 'opened';

        if (
            typeof guid === 'string' &&
            vaultid === 1 &&
            typeof mules[guid].data.query.results.Chars.Account.Vault === 'object' &&
            typeof mules[guid].data.query.results.Chars.Account.Vault.Chest === 'string' ) state = 'opened';

        if ( typeof guid !== 'string' && vaultid > 0 ) state = 'opened';

        html += '<div class="vault drag ' + state + '" data-vaultId="' + vaultid + '"><span><input name="vaultid" data-originalValue="' + vaultid + '" value="' + vaultid + '"></span></div>';

    });

    $('#vaultbuilder').css({width: (setuptools.data.muledump.vaultbuilder.layouts[layout].vaultwidth * 56)+112});
    $('#vaultbuilder > div.manager')
        .css({width: (setuptools.data.muledump.vaultbuilder.layouts[layout].vaultwidth * 56)})
        .html(html);

    $('div.layoutInfo div.layoutname').text(setuptools.data.muledump.vaultbuilder.layouts[layout].layoutname);
    $('div.layoutInfo div.layout').text(layout);
    $('div.layoutInfo div.width').html(' \
        ' + setuptools.data.muledump.vaultbuilder.layouts[layout].vaultwidth + ' rows wide \
        <br>' + Math.ceil(setuptools.data.muledump.vaultbuilder.layouts[layout].vaultorder.length/setuptools.data.muledump.vaultbuilder.layouts[layout].vaultwidth) + ' rows tall \
    ');
    $('div.setuptools.link.vaultorder > div:last-child').each(function() {
        $(this).text((setuptools.data.muledump.vaultbuilder.layouts[layout][$(this).parent().attr('data-key')] === true) ? 'On' : 'Off');
    });

    //  input interactive bindings
    $('input[name="vaultid"]')
        .off('keyup keydown focus change blur')
        //  validate vaultid input
        .on('keydown.vaultidvalidation', setuptools.app.muledump.vaultbuilder.validateInput)
        //  automatically remove 0 when editing vaultid
        .on('keydown.vaultidmodifier', function(e) {
            if ( $(this).val() === '0' ) $(this).val('');
        })
        //  select input when div is clicked and restore original value on blur if no change
        .on('click.selectinput focus.selectinput', function() {
            if ( $(this).val() === '0' ) $(this).val('');
            $(this).on('blur', function() {
                if ( $(this).val() === '' ) {
                    $(this).val($(this).attr('data-originalValue'));
                    $(this).parent().parent().attr('data-vaultId', $(this).attr('data-originalValue')).removeClass('conflict');
                    if ( $(this).val() !== '0' ) {
                        $(this).parent().parent().addClass('opened').removeClass('blank closed');
                    } else $(this).parent().parent().addClass('blank').removeClass('opened closed');
                }
            });
        })
        //  lazy save changes
        .on('change.updatetimer keyup.updatetimer', setuptools.app.muledump.vaultbuilder.vaultChangeTimer)
        //  force save or reset changes
        .on('blur.updatetimer', function() {
            if ( $(this).val() !== $(this).attr('data-originalValue') && $(this).val() !== '' ) {
                $('div.vault.drag').removeClass('conflict');
                $(this).parent().parent().attr('data-vaultId', $(this).val());
                if ( $(this).val() !== '0' ) {
                    $(this).parent().parent().addClass('opened').removeClass('blank closed');
                } else $(this).parent().parent().addClass('blank').removeClass('opened closed');
                setuptools.app.muledump.vaultbuilder.vaultChangeTimer(0);
            } else clearTimeout(setuptools.tmp.vaulteditoridchangetimer);
            //  blur or reset vaultid
        }).on('keyup.blur', function(e) {
        if ( e.key === 'Escape' ) $(this).blur();
        if ( e.key === 'z' && e.ctrlKey === true ) {
            $(this).val($(this).attr('data-originalValue'));
            $(this).parent().parent().attr('data-vaultId', $(this).attr('data-originalValue')).removeClass('conflict');
            if ( +$(this).val() > 0 ) {
                $(this).parent().parent().removeClass('blank').addClass('opened');
            } else $(this).parent().parent().removeClass('opened closed').addClass('blank');
        }
        if ( e.key === 'Delete' ) {
            $(this).val('0');
            $(this).parent().parent().attr('data-vaultId', 0).removeClass('conflict opened closec').addClass('blank');
        }
    });

    //  div clicks focuses child input
    $('#vaultbuilder > div.manager > div')
        .off('click blur')
        .on('click.selectinput', function() {
            if ( $(this).find('input').val() === '0' ) $(this).find('input').val('');
            $(this).find('input').focus().on('blur', function() {
                if ( $(this).val() === '' ) {
                    $(this)
                        .val($(this).attr('data-originalValue'))
                        .attr('data-vaultId', $(this).attr('data-originalValue'))
                        .removeClass('conflict');
                }
            });
        });

    //  vault swapping
    setuptools.tmp.vaultEditorDragging = new Muledump_Dragging({
        target: ['vault', 'drag'],
        targetattr: 'data-vaultId',
        activeclass: 'bright',
        mode: 'swap',
        callbacks: {
            target: function(parent, self, e, target) {
                if ( $(e.target)[0].localName === 'input' ) target = target.parent().parent();
                if ( $(e.target)[0].localName === 'span' ) target = target.parent();
                return target;
            },
            finish: setuptools.app.muledump.vaultbuilder.pushChanges
        }
    });

};

setuptools.app.muledump.vaultbuilder.findByName = function(name) {

    var result;

    //  seek layouts matching the provided name
    Object.keys(setuptools.data.muledump.vaultbuilder.layouts).filter(function(index) {

        var data = setuptools.data.muledump.vaultbuilder.layouts[index];
        if (
            data.layoutname.match(
                new RegExp(
                    '^(' + name + ')$',
                    'i'
                )
            ) !== null
        ) {
            if ( Array.isArray(result) ) result.push(+index);
            if ( typeof result === 'string' ) result = [result, +index];
            if ( result === undefined ) result = +index;
        }

    });

    return result;

};

setuptools.app.muledump.vaultbuilder.findNewId = function() {

    //  find the next id on the array
    var newId = Math.max.apply(null, Object.keys(setuptools.data.muledump.vaultbuilder.layouts))+1;

    //  return it if it meets the minimum requirements or send the smallest allowed id
    return ( newId >= setuptools.config.vaultbuilderMinimumId ) ? newId : setuptools.config.vaultbuilderMinimumId;

};

setuptools.app.muledump.vaultbuilder.pushChanges = function() {

    var siblings = $('div.vault.drag');
    var layout = [];
    var matches = {};
    siblings.each(function(index, element) {
        var vaultid = +$(element).attr('data-vaultId');
        if ( !Array.isArray(matches[vaultid]) ) matches[vaultid] = [];
        matches[vaultid].push(index);
        layout.push(vaultid);
    });

    var dupes = [];
    Object.keys(matches).filter(function(vaultid) {
        if ( vaultid === '0' ) return;
        if ( matches[vaultid].length > 1 ) dupes.push(vaultid);
    });

    siblings.removeClass('conflict');
    if ( dupes.length > 0 ) {

        dupes.filter(function(vaultid) {
            $('div.vault.drag[data-vaultId="' + vaultid + '"]').addClass('conflict');
        });
        return;

    }

    setuptools.tmp.vaultbuilderState.data.vaultorder = layout;

};

setuptools.app.muledump.vaultbuilder.validateInput = function(e) {

    if (
        (e.key === 'r' && setuptools.app.muledump.keys('ctrl', e) === true) ||
        (e.key === 'a' && setuptools.app.muledump.keys('ctrl', e) === true)
    ) return;

    if (
        e.key.match(/^([0-9]*?)$/) === null &&
        e.key.match(/^(Backspace|Tab|Enter|Shift|Control|Escape|Delete)$/i) === null
    ) e.preventDefault();

};

setuptools.app.muledump.vaultbuilder.ui = function(layout, guid) {

    setuptools.lightbox.close();
    if ( typeof layout !== 'number' && typeof layout !== 'string' ) layout = setuptools.data.muledump.vaultbuilder.config.layout;
    if ( typeof setuptools.data.muledump.vaultbuilder.layouts[layout] !== 'object' ) layout = setuptools.data.options.vaultlayout;
    if ( typeof layout === 'string' ) layout = +layout;
    if ( typeof layout !== 'number' ) layout = setuptools.data.options.vaultlayout;
    if ( typeof layout === 'number' ) setuptools.data.muledump.vaultbuilder.config.layout = layout;
    if ( typeof setuptools.data.muledump.vaultbuilder.layouts[layout] !== 'object' ) {
        layout = 0;
        setuptools.data.muledump.vaultbuilder.config.layout = 0;
    }
    if ( typeof guid !== 'string' ) guid = setuptools.data.muledump.vaultbuilder.config.guid;
    if ( typeof guid === 'string' ) setuptools.data.muledump.vaultbuilder.config.guid = guid;

    var width = (setuptools.data.muledump.vaultbuilder.layouts[layout].vaultwidth * 56);
    setuptools.lightbox.build('vaultbuilder', ' \
        <div class="flex-container">\
            <div id="vaultbuilder" class="flex-container noFlexAutoWidth" style="flex-wrap: wrap; width: ' + (width+112) + 'px; min-width: 560px;"> \
                <div class="flex-container"><h1>Vault Builder</h1></div>\
                <div class="flex-container">\
                    <div class="flex-container" style="justify-content: space-evenly; width: 560px; height: 120px; background-color: #333; border: #555 solid 2px; padding: 10px; flex-wrap: wrap;">\
                        \
                        <div class="flex-container" style="height: 100%; justify-content: space-evenly; align-items: flex-start;">\
                            <div class="flex-container mr5" style="width: 33%; flex-flow: column; justify-content: flex-start;">\
                                <div class="flex-container setuptools link vaultbuilder createNew menuStyle menuSmall notice textCenter noclose mb5 mr0">Create Layout</div> \
                                <div class="flex-container mb5">Loaded Layout</div>\
                                <div class="flex-container mb5">Layout ID</div>\
                                <div class="flex-container">Loaded Size</div>\
                            </div>\
                            <div class="flex-container layoutInfo mr5" style="width: 33%; flex-flow: column; justify-content: flex-start;">\
                                <div class="flex-container setuptools link vaultbuilder loadExisting menuStyle menuSmall notice textCenter noclose mb5 mr0">Load Layout</div>\
                                <div class="flex-container layoutname mb5" style="text-align: center;"></div>\
                                <div class="flex-container layout mb5" style="text-align: center;"></div>\
                                <div class="flex-container width" style="text-align: center;"></div>\
                            </div>\
                            <div class="flex-container" style="width: 33%; flex-flow: column; justify-content: space-between; height: 100%;">\
                                <div class="flex-container setuptools link vaultbuilder options menuStyle menuSmall notice textCenter noclose mr0 mb5">Options</div>\
                                <div class="flex-container setuptools link vaultorder menuStyle menuSmall textcenter mr0 mb5 bright noclose" data-key="vaultshowempty" style="justify-content: space-between;">\
                                    <div>Display Closed Vaults</div>\
                                    <div></div>\
                                </div>\
                                <div class="flex-container setuptools link vaultorder menuStyle menuSmall textcenter mr0 mb5 bright noclose" data-key="vaultcompressed" style="justify-content: space-between;">\
                                    <div>Width Compression</div>\
                                    <div></div>\
                                </div>\
                            </div>\
                        </div>\
                    </div>\
                </div>\
                <div class="flex-container manager" style="width: ' + width + 'px; flex-wrap: wrap; justify-content: space-between;"></div>\
            </div>\
        </div>\
    ');
    setuptools.lightbox.settitle('vaultbuilder', false);
    setuptools.lightbox.display('vaultbuilder', {variant: 'fl-VaultBuilder'});
    setuptools.app.muledump.vaultbuilder.drawVaultLayout(layout, guid);

    $('div.setuptools.link.vaultorder').off('click.vaultorder.options').on('click.vaultorder.options', function(e) {

        var key = $(this).attr('data-key');
        setuptools.data.muledump.vaultbuilder.layouts[layout][key] = !(setuptools.data.muledump.vaultbuilder.layouts[layout][key]);
        setuptools.tmp.vaultbuilderState.data[key] = setuptools.data.muledump.vaultbuilder.layouts[layout][key];
        $(this).find('div:last-child').text((setuptools.data.muledump.vaultbuilder.layouts[layout][key] === true) ? 'On' : 'Off');

    });

    //  only allow numbers and certain keys
    $('input[name="existingVaultWidth"]').off('keydown.inputvalidation').on('keydown.inputvalidation', setuptools.app.muledump.vaultbuilder.validateInput);

    $('div.setuptools.link.vaultbuilder.createNew')
        .off('click.createNew mouseover.createNew')
        .on('click.createNew', setuptools.app.muledump.vaultbuilder.menu.create)
        .on('mouseover.createNew', setuptools.lightbox.menu.context.close);

    $('div.setuptools.link.vaultbuilder.loadExisting')
        .off('click.loadExisting mouseover.loadExisting')
        .on('click.loadExisting mouseover.loadExisting', setuptools.app.muledump.vaultbuilder.menu.load);

    $('div.setuptools.link.vaultbuilder.options')
        .off('click.options mouseover.options')
        .on('click.options mouseover.options', setuptools.app.muledump.vaultbuilder.menu.options);

};

setuptools.app.muledump.vaultbuilder.tasks.create = function(name, width, height) {

    var layout;
    if ( typeof layout !== 'number' ) layout = setuptools.app.muledump.vaultbuilder.findByName(name);
    if ( typeof layout === 'number' ) return false;
    layout = setuptools.app.muledump.vaultbuilder.findNewId();

    if ( layout >= setuptools.config.vaultbuilderMinimumId ) {

        var vaultorder = [];
        for ( var i = 0; i < (width*height); i++ ) vaultorder.push(0);
        setuptools.data.muledump.vaultbuilder.config.layout = layout;
        setuptools.data.muledump.vaultbuilder.layouts[layout] = $.extend(true, {}, vaultorders[0], {
            layoutname: name,
            vaultwidth: width
        });
        setuptools.data.muledump.vaultbuilder.layouts[layout].vaultorder = vaultorder;

        if ( setuptools.app.config.save('Muledump/VaultBuilder created new layout') !== true ) return false;
        setuptools.app.muledump.vaultbuilder.ui();
        return true;

    }
    return false;

};

setuptools.app.muledump.vaultbuilder.tasks.saveAs = function(name, layout) {

    if ( typeof layout !== 'number' ) layout = setuptools.app.muledump.vaultbuilder.findByName(name);
    if ( typeof layout !== 'number' ) layout = setuptools.app.muledump.vaultbuilder.findNewId();
    if ( layout >= setuptools.config.vaultbuilderMinimumId ) {

        setuptools.data.muledump.vaultbuilder.config.layout = layout;
        setuptools.tmp.vaultbuilderState.data.layoutname = name;
        return setuptools.app.muledump.vaultbuilder.tasks.save();

    }
    return false;

};

setuptools.app.muledump.vaultbuilder.tasks.upgrade = function() {

    //  create the layouts array if it is missing
    if ( typeof setuptools.data.muledump.vaultbuilder.layouts !== 'object' ) setuptools.data.muledump.vaultbuilder.layouts = {};

    //  reset predefined configurations
    vaultorders.filter(function(layout, index) {
        setuptools.data.muledump.vaultbuilder.layouts[index] = vaultorders[index];
    });

    //  update all configurations with new keys
    var layoutkeys = Object.keys(vaultorders[0]);
    Object.keys(setuptools.data.muledump.vaultbuilder.layouts).map(function(layout) {
        var data = setuptools.data.muledump.vaultbuilder.layouts[layout];
        layoutkeys.map(function(key) {
            if ( typeof data[key] === 'undefined' ) setuptools.data.muledump.vaultbuilder.layouts[layout][key] = vaultorders[0][key];
        });
    });

    //  update the available vault layouts for options menu
    var AvailableVaultLayouts = {};
    Object.keys(setuptools.data.muledump.vaultbuilder.layouts).filter(function(index) {

        var data = setuptools.data.muledump.vaultbuilder.layouts[index];
        AvailableVaultLayouts[index] = data.layoutname;

    });
    window.options_layout.vaults.radio = ['vaultlayout', AvailableVaultLayouts];

};

setuptools.app.muledump.vaultbuilder.tasks.save = function() {

    var state = setuptools.data.muledump.vaultbuilder.config;
    var rename = false;

    if ( typeof state.layout !== 'number' ) state.layout = setuptools.app.muledump.vaultbuilder.findNewId();
    if (
        state.layout < setuptools.config.vaultbuilderMinimumId
    ) return setuptools.app.muledump.vaultbuilder.tasks.saveAs(
        setuptools.tmp.vaultbuilderState.data.layoutname + ' (custom)'
    );

    setuptools.data.muledump.vaultbuilder.layouts[state.layout] = $.extend(true, {}, vaultorders[0], {
        layoutname: setuptools.tmp.vaultbuilderState.data.layoutname + (rename ? ' (custom)' : ''),
        vaultwidth: setuptools.tmp.vaultbuilderState.data.vaultwidth,
        vaultshowempty: setuptools.tmp.vaultbuilderState.data.vaultshowempty,
        vaultcompressed: setuptools.tmp.vaultbuilderState.data.vaultcompressed
    });
    setuptools.data.muledump.vaultbuilder.layouts[state.layout].vaultorder = setuptools.tmp.vaultbuilderState.data.vaultorder;

    setuptools.app.config.save('Muledump/VaultBuilder saving changes');

    return true;

};

setuptools.app.muledump.vaultbuilder.tasks.load = function(layout) {

    setuptools.data.muledump.vaultbuilder.config.layout = layout;
    setuptools.app.config.save('Muledump/VaultBuilder created duplicate', true);
    setuptools.app.muledump.vaultbuilder.drawVaultLayout(layout, setuptools.data.muledump.vaultbuilder.config.guid);

};

setuptools.app.muledump.vaultbuilder.tasks.accountView = function(guid) {

    setuptools.data.muledump.vaultbuilder.config.guid = guid;
    setuptools.app.config.save('Muledump/VaultBuilder changed account view', true);
    setuptools.app.muledump.vaultbuilder.ui(
        setuptools.data.muledump.vaultbuilder.config.layout || setuptools.data.options.vaultlayout,
        guid
    );

};

setuptools.app.muledump.vaultbuilder.menu.import = function(manual) {

    setuptools.lightbox.build('muledump-vaultbuilder-import', ' \
        Coming soon\
    ');
    setuptools.lightbox.settitle('muledump-vaultbuilder-import', 'Import / Export Layouts');
    setuptools.lightbox.display('muledump-vaultbuilder-import');

};

setuptools.app.muledump.vaultbuilder.menu.duplicate = function() {

    var state = setuptools.tmp.vaultbuilderState;

    var position = $('div.setuptools.link.vaultbuilder.options');
    var options = [
        {
            option: 'pos',
            vpx: position.outerHeight(),
            hpx: position.innerWidth()+2,
            h: 'right'
        },
        {
            option: 'css',
            css: {width: 'auto'}
        },
        {
            option: 'class',
            value: 'bright'
        }
    ];

    var layoutOptions = '';
    Object.keys(setuptools.data.muledump.vaultbuilder.layouts).filter(function(index) {

        var data = setuptools.data.muledump.vaultbuilder.layouts[index];
        layoutOptions += ' \
            <option style="background-color: #3f3f3f; outline: 0;" value="' + index + '">' + data.layoutname + '</option>\
        ';

    });

    options.push({
        option: 'input',
        class: 'createVaultName',
        value: ' \
            <div class="flex-container" style="flex-wrap: wrap; width: 136px; justify-content: space-between;">\
                <select name="duplicateFrom" class="mb5" style="width: 100%; background-color: #3f3f3f; outline: 0; border: solid 2px #707070; padding: 4px; color: #ffffff;">\
                    ' + layoutOptions + '\
                </select>\
                <input name="duplicateNewName" placeholder="New Name" class="mb5" style="width: 100%; background-color: transparent; outline: 0; border: solid 2px #707070; padding: 4px; color: #ffffff;"> \
                <div class="setuptools link vaultbuilder duplicateNew confirm menuStyle buttonStyle menuSmall mr0" style="width: 55px; height: 17px;">Duplicate</div>\
                <div class="setuptools link vaultbuilder cancel confirm menuStyle buttonStyle menuSmall mr0" style="width: 55px; height: 17px;">Cancel</div>\
            </div>\
        ',
        binding: function() {

            $('div.setuptools.menu input[name="createNewWidth"]').on('keydown.validateinput', setuptools.app.muledump.vaultbuilder.validateInput);
            $('div.setuptools.menu input[name="createNewHeight"]').on('keydown.validateinput', setuptools.app.muledump.vaultbuilder.validateInput);
            $('div.setuptools.link.vaultbuilder.cancel').on('click.createCancel', function() {
                setuptools.lightbox.menu.context.close();
            });

        }
    });

    setuptools.lightbox.menu.context.create('mulemenu-vaultbuilderMenuDuplicate', false, position, options);

};

setuptools.app.muledump.vaultbuilder.menu.create = function() {

    if ( setuptools.lightbox.menu.context.isOpen('mulemenu-vaultbuilderMenuCreate') === true ) {
        setuptools.lightbox.menu.context.close();
        return;
    };

    var position = $('div.setuptools.link.vaultbuilder.createNew');
    var options = [
        {
            option: 'class',
            value: 'bright simpleForm'
        },
        {
            option: 'pos',
            vpx: position.outerHeight(),
            hpx: 2
        },
        {
            option: 'css',
            css: {width: 'auto'}
        }
    ];

    options.push({
        option: 'input',
        class: 'createVaultName',
        value: ' \
            <div style="width: 136px; justify-content: space-between;">\
                <input name="createNewName" placeholder="Name" class="mb5" style="width: 100%; text-align: center;"> \
                <input name="createNewWidth" placeholder="Width" class="mb5" style="width: 53px; text-align: center;">\
                <input name="createNewHeight" placeholder="Rows" class="mb5" style="width: 53px; text-align: center;">\
                <div class="setuptools link vaultbuilder createNew confirm menuStyle buttonStyle menuSmall mr0" style="width: 55px; height: 17px;">Create</div>\
                <div class="setuptools link vaultbuilder cancel confirm menuStyle buttonStyle menuSmall mr0" style="width: 55px; height: 17px;">Cancel</div>\
            </div>\
        ',
        binding: function() {

            $('div.setuptools.menu input[name="createNewWidth"]').on('keydown.validateinput', setuptools.app.muledump.vaultbuilder.validateInput);
            $('div.setuptools.menu input[name="createNewHeight"]').on('keydown.validateinput', setuptools.app.muledump.vaultbuilder.validateInput);

            $('div.setuptools.menu div.setuptools.link.vaultbuilder.createNew.confirm').on('click.createNew', function() {

                $('div.setuptools.menu .conflict').removeClass('conflict');
                var name = $('input[name="createNewName"]').val() || '';
                var width = $('input[name="createNewWidth"]').val() || '';
                var height = $('input[name="createNewHeight"]').val() || '';

                if ( typeof name !== 'string' || name.length === 0 ) {
                    $('input[name="createNewName"]').addClass('conflict');
                    return;
                }

                if ( width.match(/^([0-9]+)$/) === null ) {
                    $('input[name="createNewWidth"]').addClass('conflict');
                    return;
                }

                if ( height.match(/^([0-9]+)$/) === null ) {
                    $('input[name="createNewHeight"]').addClass('conflict');
                    return;
                }

                if ( setuptools.app.muledump.vaultbuilder.tasks.create(name, width, height) === true ) {
                    setuptools.app.muledump.vaultbuilder.ui();
                    return;
                }

                //  cannot overwrite predefined layouts
                $('input[name="createNewName"]').addClass('conflict').val('').attr('placeholder', 'Choose another');

            });

            $('div.setuptools.link.vaultbuilder.cancel').on('click.saveAsCancel', function() {
                setuptools.lightbox.menu.context.close();
            });

        }
    });

    setuptools.lightbox.menu.context.create('mulemenu-vaultbuilderMenuCreate', false, position, options);

};

setuptools.app.muledump.vaultbuilder.menu.saveAs = function() {

    if ( setuptools.lightbox.menu.context.isOpen('mulemenu-vaultbuilderMenuSaveAs') === true ) {
        setuptools.lightbox.menu.context.close();
        return;
    };

    var position = $('div.setuptools.link.vaultbuilder.options');
    var options = [
        {
            option: 'class',
            value: 'bright'
        },
        {
            option: 'pos',
            vpx: position.outerHeight(),
            hpx: position.innerWidth()+2,
            h: 'right'
        },
        {
            option: 'css',
            css: {width: 'auto'}
        }
    ];

    options.push({
        option: 'input',
        class: 'saveAsName',
        value: ' \
            <div class="flex-container" style="flex-wrap: wrap; width: 136px; justify-content: space-between;">\
                <input name="saveAsName" placeholder="New Name" class="mb5" style="width: 100%; text-align: center; background-color: transparent; outline: 0; border: solid 2px #707070; padding: 4px; color: #ffffff;"> \
                <div class="setuptools link vaultbuilder saveAs confirm menuStyle buttonStyle menuSmall mr0" style="width: 55px; height: 17px;">Save</div>\
                <div class="setuptools link vaultbuilder cancel confirm menuStyle buttonStyle menuSmall mr0" style="width: 55px; height: 17px;">Cancel</div>\
            </div>\
        ',
        binding: function() {

            $('div.setuptools.link.vaultbuilder.saveAs').on('click.saveAsConfirm', function() {

                var input = $('input[name="saveAsName"]');
                if ( setuptools.app.muledump.vaultbuilder.tasks.saveAs(input.val()) === true ) {
                    setuptools.app.muledump.vaultbuilder.ui();
                    return;
                }

                //  cannot overwrite predefined layouts
                input.addClass('conflict').val('').attr('placeholder', 'Cannot use that name');

            });

            $('div.setuptools.link.vaultbuilder.cancel').on('click.saveAsCancel', function() {
                setuptools.lightbox.menu.context.close();
            });

        }
    });

    setuptools.lightbox.menu.context.create('mulemenu-vaultbuilderMenuCreate', false, position, options);

};

/**
 * @function
 * Displays the vaultbuilder main menu
 */
setuptools.app.muledump.vaultbuilder.menu.load = function() {

    var position = $('div.setuptools.link.vaultbuilder.loadExisting');
    var options = [{
        option: 'skip',
        value: 'reposition'
    },
        {
            option: 'hover',
            action: 'close',
            timer: 'vaultbuilderMenuMain'
        },
        {
            option: 'class',
            value: 'bright'
        },
        {
            option: 'pos',
            vpx: position.outerHeight(),
            hpx: 2
        },
        {
            option: 'css',
            css: {width: position.innerWidth()}
        }
    ];

    Object.keys(setuptools.data.muledump.vaultbuilder.layouts).filter(function(index) {

        var data = setuptools.data.muledump.vaultbuilder.layouts[index];
        var rows = Math.ceil(data.vaultorder.length/data.vaultwidth);
        options.push({
            class: 'vaultbuilderChoice' + index.toString(),
            name: ' \
                <div class="flex-container" style="justify-content: space-between;">\
                    <div>' + data.layoutname + '</div>\
                    <div>' + data.vaultwidth + ' x ' + rows + '</div>\
                </div>\
            ',
            callback: setuptools.app.muledump.vaultbuilder.tasks.load,
            callbackArg: index
        });

    });

    setuptools.lightbox.menu.context.create('mulemenu-vaultbuilderMenuMain', false, position, options);

};

setuptools.app.muledump.vaultbuilder.menu.accountView = function() {

    var position = $('div.setuptools.link.vaultbuilder.options');
    var options = [
        {
            option: 'hover',
            action: 'close',
            timer: 'vaultbuilderAccountView'
        },{
            option: 'css',
            css: {
                width: position.innerWidth() + 'px',
                'overflow-x': 'hidden',
                'overflow-y': ( (Object.keys(mules).length > 10 && setuptools.data.config.vaultbuilderAccountViewLimit > 10 ) ? 'scroll' : '' ),
                'max-height': '324px'
            }
        },
        {
            option: 'pos',
            vpx: position.outerHeight(),
            hpx: 2
        },
        {
            option: 'class',
            value: 'scrollbar bright'
        },
        {
            class: 'accountViewBack',
            name: 'Back ...',
            callback: setuptools.app.muledump.vaultbuilder.menu.options
        }
    ];

    var limited = false;
    Object.keys(mules).filter(function(guid, index) {

        if ( index > (setuptools.data.config.vaultbuilderAccountViewLimit-1) ) {
            if ( limited === false ) {
                limited = true;
                options.push({
                    class: 'accountViewLimit',
                    name: 'Show More ...',
                    callback: function () {
                        setuptools.app.config.settings('vaultbuilderAccountViewLimit', 'advanced');
                    }
                });
            }
            return;
        }

        options.push({
            class: 'accountView ' + guid.replace('@', '-----'),
            name: setuptools.app.muledump.getName(guid),
            callback: setuptools.app.muledump.vaultbuilder.tasks.accountView,
            callbackArg: guid
        });

    });

    setuptools.lightbox.menu.context.create('mulemenu-vaultbuilderAccountView', false, position, options);

};

/**
 * @function
 * Displays the vaultbuilder options menu
 */
setuptools.app.muledump.vaultbuilder.menu.options = function() {

    var position = $('div.setuptools.link.vaultbuilder.options');
    var options = [{
        option: 'skip',
        value: 'reposition'
    },
        {
            option: 'hover',
            action: 'close',
            timer: 'vaultbuilderMenuOptions'
        },
        {
            option: 'class',
            value: 'bright'
        },
        {
            option: 'pos',
            vpx: position.outerHeight(),
            hpx: 2
        },
        {
            option: 'css',
            css: {width: position.innerWidth()}
        }
    ];

    var accountView = {default: 'No Account'};
    Object.keys(mules).filter(function(guid) {
        if ( Object.keys(accountView).length > (setuptools.data.config.vaultbuilderAccountViewLimit+1) ) return;
        accountView[guid] = setuptools.app.muledump.getName(guid);
    });

    if ( setuptools.data.muledump.vaultbuilder.config.layout >= setuptools.config.vaultbuilderMinimumId ) options.push({
        class: 'vaultbuilderSave',
        name: 'Save',
        callback: setuptools.app.muledump.vaultbuilder.tasks.save
    });

    options.push(
        {
            class: 'vaultbuilderSave',
            name: 'Save as ...',
            callback: setuptools.app.muledump.vaultbuilder.menu.saveAs
        },
        {
            class: 'vaultbuilderReset',
            name: 'Reset',
            callback: setuptools.app.muledump.vaultbuilder.ui
        }
    );

    if ( setuptools.data.muledump.vaultbuilder.config.layout >= setuptools.config.vaultbuilderMinimumId ) options.push({
        class: 'vaultbuilderRename',
        name: 'Rename ...',
        callback: setuptools.app.muledump.vaultbuilder.menu.rename
    });

    options.push(
        {
            class: 'vaultbuilderAccount',
            name: 'Account View ...',
            callback: setuptools.app.muledump.vaultbuilder.menu.accountView
        },
        {
            class: 'vaultbuilderDuplicate',
            name: 'Duplicate ...',
            callback: setuptools.app.muledump.vaultbuilder.menu.duplicate,
        },
        {
            class: 'vaultbuilderImport',
            name: 'Import / Export ...',
            callback: setuptools.app.muledump.vaultbuilder.menu.import
        }
    );

    setuptools.lightbox.menu.context.create('mulemenu-vaultbuilderMenuOptions', false, position, options);

};
