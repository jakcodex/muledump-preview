//  muledump setup tools - ui-based accounts.js management

/**
 * Setuptools Base Object
 * @namespace
 */
var setuptools = {
    version: {
        major: 9,
        minor: 4,
        patch: 2
    },
    state: {
        error: false,
        loaded: false,
        firsttime: false,
        hosted: false,
        preview: false,
        ctrlKey: false,
        notifier: false,
        encryption: {
            sodium: false,
            storage: false
        },
        extension: undefined,
        assistant: {
            cors: false,
            ageVerify: false,
            tos: false,
            migration: false,
            backup: false,
            muledumperror: false
        }
    },
    browser: 'other',
    originalAccountsJS: false,
    objects: {
        dataGroup: {
            format: 1,
            groupList: {},
            groupOrder: []
        },
        group: {
            enabled: true,
            members: [] //  guids in an array; active groups will get merged into a deduped runtime accounts variable
        },
        account: {
            banned: false,
            enabled: true,
            loginOnly: false,
            autoReload: false,
            cacheEnabled: true,
            giftsBugAck: false,
            testing: false
        },
        whitebagTrackerAccount: {
            items: {},
            totals: []
        }
    },
    tmp: {},
    config: {},
    data: {
        config: {},
        version: {},
        accounts: {},
        groups: {},
        options: {}
    },
    copy: {
        config: {}
    },
    storage: {
        compression: {}
    },
    lightbox: {
        active: {},
        builds: {},
        overrides: {},
        menu: {
            paginate: {
                state: {}
            },
            context: {},
            search: {}
        }
    },
    init: {},
    app: {
        accounts: {},
        assistants: {},
        groups: {},
        config: {},
        backups: {},
        upgrade: {},
        muledump: {
            notices: {
                queue: []
            },
            realmeye: {},
            exporter: {
                ui: {}
            }
        },
        mulequeue: {}
    }
};

//  muledump setuptools server configuration
setuptools.config.actoken = 'jcmd';
setuptools.config.appspotProd = 'https://realmofthemadgodhrd.appspot.com/';
setuptools.config.appspotTesting = 'https://rotmgtesting.appspot.com/';
setuptools.config.backupAssistantDelay = 30000;
setuptools.config.compressionMinimum = 1000;
setuptools.config.compressionFormat = 0;
setuptools.config.compressionLibraries = {snappy: {}};
setuptools.config.defaultSlotOrder = [42010, 42011, 42012, 1, 2, 3, 17, 8, 24, 5, 16, 12, 13, 18, 22, 15, 20, 11, 19, 21, 4, 23, 25, 7, 6, 14, 9, 42013, 42014, 42015, 42016, 42017, 42018, 42019, 42020, 42021, 42022, 42023, 42024, 42025, 42026, 42027, 42028, 42029, 50000, 10, 26, 0];
setuptools.config.devForcePoint = '';
setuptools.config.disqualifiedItemIds = [587, 2505, 2503, 2509, 2320, 2496, 2501, 2499, 2512];
setuptools.config.encryption = false;
setuptools.config.errorColor = '#ae0000';
setuptools.config.ga = 'UA-111254659-2';
setuptools.config.gaFuncName = 'analytics';
setuptools.config.gaInterval = 300000;
setuptools.config.giftsWarningThreshold = 6500;
setuptools.config.giftChestsBugHelp = 'https://github.com/jakcodex/muledump/wiki/Gift+Chests+Bug';
setuptools.config.githubArchive = 'https://github.com/jakcodex/muledump/archive/';
setuptools.config.githubRawUrl = 'https://raw.githubusercontent.com/jakcodex/muledump';
setuptools.config.goHomeSkip = ['drawhelp', 'main', 'accounts-deepcopy-download', 'settings-eraseAll-complete', 'settings-erase-completed', 'browser-assistant', 'settings-viewSystemsReport'];
setuptools.config.hostedDomain = 'jakcodex.github.io';
setuptools.config.httpErrorHelp = 'https://github.com/jakcodex/muledump/wiki/Frequently+Asked+Questions#http-error-was-returned-by-rotmg-servers';
setuptools.config.keyPrefix = 'muledump:setuptools:';
setuptools.config.masonryOptions = {
    itemSelector: '.mule',
    columnWidth: 5,
    gutter: 10,
    transitionDuration: '0.5s',
    fitWidth: true,
    horizontalOrder: true,
    resize: true
};
setuptools.config.mcMinimumEntropy = 6;
setuptools.config.mcMinimumKeyLength = 12;
setuptools.config.mcMinimumKeyStrength = 2;
setuptools.config.muledump = {corsMaxAttempts: 3};
setuptools.config.mqBGDelay = 1000;
setuptools.config.mqBGHealthDelay = 5000;
setuptools.config.mqDefaultConfig = {
    action: 'query',
    ignore_cache: false,
    cache_only: false
};
setuptools.config.mqRateLimitExpiration = 300000;
setuptools.config.mqStaleCache = 86400000;
setuptools.config.noEncryptKeys = ['mulecrypt:keychain'];
setuptools.config.noticesMonitorMaxAge = 300;
setuptools.config.oneclickHelp = 'https://github.com/jakcodex/muledump/wiki/One-Click-Login';
setuptools.config.perfLoadTime = 3000;
setuptools.config.perfMinCPUs = 4;
setuptools.config.ratelimitHelp = 'https://github.com/jakcodex/muledump/wiki/Rate-Limiting';
setuptools.config.realmApiParams = {
    muleDump: true,
    __source: 'jakcodex-v' + setuptools.version.major + setuptools.version.minor + setuptools.version.patch
};
setuptools.config.realmeyeUrl = 'https://www.realmeye.com';
setuptools.config.realmeyeOfferIds = [1793, 1803, 1808, 1826, 1932, 25630, 25631, 25632, 25633, 25634, 25635, 25636, 25637, 25638, 25639, 2571, 2572, 2579, 2591, 2592, 2593, 2608, 2611, 2612, 2613, 2629, 2630, 2631, 2636, 2640, 2641, 2644, 2645, 2649, 2651, 2656, 2659, 2660, 2661, 2666, 2667, 2691, 2692, 2693, 2694, 2695, 2696, 2697, 2698, 2699, 2700, 2701, 2702, 2703, 2704, 2705, 2706, 2707, 2708, 2709, 2710, 2720, 2721, 2722, 2727, 2728, 2734, 2735, 2736, 2741, 2742, 2744, 2749, 2751, 2752, 2753, 2754, 2755, 2756, 2757, 2758, 2759, 2760, 2761, 2762, 2763, 2764, 2765, 2766, 2771, 2774, 2785, 2793, 2794, 2799, 2800, 2801, 2806, 2809, 2812, 2815, 2818, 2821, 2824, 2827, 283, 2847, 2848, 2850, 2851, 2852, 2853, 2854, 2855, 2856, 2857, 2858, 2859, 2860, 2861, 2865, 2866, 2867, 2868, 29769, 29772, 2979, 2980, 29804, 2981, 29819, 2982, 29820, 29821, 29822, 29823, 29824, 29825, 29826, 29827, 29828, 29829, 2983, 29830, 29831, 29832, 29836, 2984, 2985, 2986, 2990, 2991, 303, 308, 3089, 3090, 3105, 3107, 3118, 3129, 3130, 3131, 3132, 3137, 3149, 3150, 3151, 3152, 3159, 3160, 3161, 3163, 3164, 3165, 3170, 3183, 3184, 3185, 3186, 3187, 3188, 3189, 3190, 3191, 3192, 3193, 3194, 3195, 3196, 3197, 3198, 3199, 3200, 3205, 3206, 3209, 3210, 3213, 3214, 3217, 3218, 3221, 3222, 3225, 3226, 3229, 3230, 3233, 3234, 3237, 3238, 3241, 3242, 3245, 3246, 3249, 3250, 3253, 3254, 3257, 3258, 3261, 3262, 3267, 32695, 3278, 3279, 3284, 3290, 3293, 3311, 3312, 3313, 3320, 3856, 3857, 3858, 3859, 3860, 3861, 4252, 5407, 573, 8333, 8334, 8335, 8336, 8337, 8338, 8339, 8340, 8341, 8342, 8343, 8344, 8345, 8346, 8608, 8609, 8610, 8611, 8615, 8616, 8617, 8618, 8732, 8781, 8783, 8796, 8812, 8814, 8815, 8827, 8828, 8829, 8830, 8831, 8842, 8843, 8844, 8845, 8846, 8847, 8848, 8850, 8851, 8852, 8856, 8857, 8858, 8859, 8860, 8861, 8862, 8863, 8960, 8962, 8980, 8981, 8982, 8983, 8984, 8985, 8993, 8995, 8996, 8997, 8998, 8999, 9000, 9011, 9015, 9016, 9017, 9018, 9019, 9020, 9021, 9022, 9023, 9024, 9025, 9033, 9034, 9035, 9036, 9037, 9038, 9039, 9040, 9041, 9042, 9052, 9053, 9054, 9055, 9056, 9057, 9058, 9059, 9060, 9061, 9062, 9063, 9068, 9069, 9074, 9075, 9076, 9077, 9084, 9085, 9086, 9087, 9610, 9612, 9615, 1802, 3133, 284, 10245, 2787, 2782, 12290, 3109, 10243, 584, 2802, 3174, 10244, 3119, 2781, 3098, 3168, 4253, 2733, 2788, 3393];
setuptools.config.reloadDelay = 3;
setuptools.config.timesyncTtl = 2500;
setuptools.config.timesyncUrl = 'https://time.jakcodex.io/api/time';
setuptools.config.totalsDefaultIcon = [880, 40];
setuptools.config.totalsItemWidth = 44;
setuptools.config.totalsFilterKeysIndex = 10;
setuptools.config.totalsSaveKeys = ['totalsGlobal', 'famefilter', 'fameamount', 'feedfilter', 'feedpower', 'sbfilter', 'nonsbfilter', 'utfilter', 'stfilter', 'disabled'];
setuptools.config.totalsKeyObjects = {
    accountFilter: [],
    itemFilter: [],
    slotOrder: [],
    slotSubOrder: {},
    disabled: [],
    sortingMode: 'standard'
};
setuptools.config.updatecheckTTL = 30000;
setuptools.config.updatecheckURL = 'https://api.github.com/repos/jakcodex/muledump/tags';
setuptools.config.url = 'https://jakcodex.github.io/muledump';
setuptools.config.vstIndex = 10;
setuptools.config.wikiUrl = 'https://github.com/jakcodex/muledump/wiki';

//  update server config for muledump online preview
if ( window.location && window.location.pathname.match(/^\/muledump-preview/) ) {

    setuptools.state.preview = true;
    setuptools.config.keyPrefix += 'preview:';
    setuptools.config.url += '-preview';
    setuptools.config.ga = 'UA-111254659-3';
    setuptools.config.githubArchive = setuptools.config.githubArchive.replace('muledump', 'muledump-preview');
    setuptools.config.githubRawUrl = setuptools.config.githubRawUrl.replace('muledump', 'muledump-preview');
    setuptools.config.updatecheckURL = setuptools.config.updatecheckURL.replace('muledump', 'muledump-preview');

}

//  regex patterns
setuptools.config.regex = {
    email: new RegExp(/^.*?@.*?\..*$/),
    guid: new RegExp(/^((steamworks|kongregate|kabam):[a-zA-Z0-9]*)$/i),
    accountsJS: new RegExp(/^(?:(rowlength|testing|prices|mulelogin|nomasonry|debugging) ?= ?([a-z0-9]*).*?|.*?(?:'|")((?:(?:[^<>()\[\]\\.,;:\s@"]+(?:\.[^<>()\[\]\\.,;:\s@"]+)*)|(?:".+"))@(?:(?:\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(?:(?:[a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))|(?:(?:steamworks|kongregate|kabam):[a-zA-Z0-9]*))(?:'|"): ?(?:'|")(.*?)(?:'|").*?)$/i),
    helpdocsBaseHref: new RegExp(/<!-- ([a-zA-Z]*) (.*?) -->/m),
    backupId: new RegExp(/^muledump-backup-.*$/),
    hashnav: new RegExp(/([a-z0-9_]+)/ig),
    renderscheck: new RegExp(/^renders-(?:([0-9]{4})([0-3]{1}[0-9]{1})([0-3]{1}[0-9]{1})-([0-2]{1}[0-9]{1})([0-5]{1}[0-9]{1})([0-5]{1}[0-9]{1}))-(.*)$/),
    backupKey: new RegExp('^' + setuptools.config.keyPrefix + '(muledump-backup-([0-9]*))$'),
    storageKeys: new RegExp('^' + setuptools.config.keyPrefix + '.*$'),
    gaUserId: new RegExp(/^([a-f0-9]{20})$/i),
    slotTypeMapConfigKey: new RegExp(/^([><])?([=])?([0-9]*)$/)
};

//  muledump setuptools client configuration defaults
setuptools.data.config.accountAssistant = 1;
setuptools.data.config.accountLoadDelay = 0;
setuptools.data.config.accountsPerPage = 10;
setuptools.data.config.alertNewVersion = 1;
setuptools.data.config.animations = 1;
setuptools.data.config.autocomplete = true;
setuptools.data.config.automaticBackups = true;
setuptools.data.config.autoReloadDays = 1;
setuptools.data.config.backupAssistant = 14;
setuptools.data.config.compression = false;
setuptools.data.config.corsAssistant = 1;
setuptools.data.config.debugging = true;
setuptools.data.config.enabled = false;
setuptools.data.config.encryption = false;
setuptools.data.config.errors = true;
setuptools.data.config.ga = false;
setuptools.data.config.gaErrors = true;
setuptools.data.config.gaOptions = true;
setuptools.data.config.gaPing = true;
setuptools.data.config.gaTotals = true;
setuptools.data.config.giftChestWidth = 0;
setuptools.data.config.groupsMergeMode = 2;
setuptools.data.config.hideHeaderText = false;
setuptools.data.config.lazySave = 10000;
setuptools.data.config.longpress = 1000;
setuptools.data.config.lowStorageSpace = true;
setuptools.data.config.maximumBackupCount = 5;
setuptools.data.config.menuPosition = 2;
setuptools.data.config.mqBGTimeout = 180;
setuptools.data.config.mqConcurrent = 1;
setuptools.data.config.mqDisplayIgn = false;
setuptools.data.config.mqKeepHistory = 100;
setuptools.data.config.mulelogin = 0;
setuptools.data.config.muleMenu = true;
setuptools.data.config.nomasonry = 0;
setuptools.data.config.pagesearch = 2;
setuptools.data.config.preventAutoDownload = true;
setuptools.data.config.rowlength = 7;
setuptools.data.config.timesync = true;
setuptools.data.config.tooltip = 500;
setuptools.data.config.totalsExportWidth = 0;
setuptools.data.config.totalswidth = 0;
setuptools.data.exporter = {
    remote: {
        pastebin: '',
        imgur: 'd1697f30e7e4c5c'
    },
    pastebin: {
        username: undefined,
        password: undefined
    }
};
setuptools.data.muledump = {
    chsortcustom: {
        format: 1,
        accounts: {}
    },
    whitebagTracker: {
        accounts: {},
        totals: []
    },
    totals: {
        configSets: {
            active: 'Default',
            favorites: ['Default'],
            settings: {}
        }
    }
};

//  by default the userid is false as it will be generated after the first page load
setuptools.data.userid = false;

//  various notices and prompts can be acknowledged and we need to track that in a permanent way
setuptools.data.acknowledge = {
    assistants: {}
};

//  determine if muledump online or local
if ( window.location && window.location.hostname === setuptools.config.hostedDomain ) {

    setuptools.state.hosted = true;

    //  switch default value for online users
    setuptools.data.config.ga = true;

}

//  Array.prototype.filter() but for any object
if ( !Object.filter ) {

    Object.filter = function(object, expect, callback) {

        //  argument shortcut
        if ( typeof expect === 'function' ) {
            callback = expect;
            expect = true;
        }

        //  run the comparison
        var list = {};
        for ( var i in object )
            if ( object.hasOwnProperty(i) ) {
                var result = callback(i, object[i]);
                if ( expect && result === expect ) {
                    list[i] = object[i];
                } else if ( typeof expect === 'undefined' && typeof result !== 'undefined' ) {
                    list[i] = result;
                }
            }
        return list;

    }

}

//  randomize the characters of an input string
if ( !String.prototype.shuffle ) {

    String.prototype.shuffle = function() {
        var a = this.split(""),
            n = a.length;

        for(var i = n - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var tmp = a[i];
            a[i] = a[j];
            a[j] = tmp;
        }
        return a.join("");
    }

}

//  decimal rounding
if ( !Math.precisionRound ) {

    Math.precisionRound = function(number, precision) {
        var factor = Math.pow(10, precision || 2);
        return Math.round(number * factor) / factor;
    }

}

//  create a date string (yyyymmdd-hhmmss)
if ( !Date.prototype.dateString ) {

    Date.prototype.dateString = function() {

        return this.getFullYear() +
            ('0' + (Number(this.getMonth())+1)).slice(-2) +
            ('0' + this.getDate()).slice(-2) + '-' +
            ('0' + this.getHours()).slice(-2) +
            ('0' + this.getMinutes()).slice(-2) +
            ('0' + this.getSeconds()).slice(-2);

    }

}

//  create a time string (hh:mm:ss am/pm 12hr format or hh:mm:ss 24hr format [format=true])
if ( !Date.prototype.timeString ) {

    Date.prototype.timeString = function(format) {

        var hour = this.getHours();
        var ampm = 'am';
        if ( format !== true && hour > 12 ) {
            hour = hour-12;
            ampm = 'pm';
        }
        if ( typeof format === 'boolean' ) ampm = '';
        return ('0' + hour).slice(-2) + ':' +
            ('0' + this.getMinutes()).slice(-2) + ':' +
            ('0' + this.getSeconds()).slice(-2) + ampm;

    }

}

//  copy the default client configuration settings (for settings reset) [deprecated]
setuptools.copy.config = $.extend(true, {}, setuptools.data.config);
setuptools.copy.config.enabled = true;

//  copy the default client configuration
setuptools.copy.data = $.extend(true, {}, setuptools.data);

//  link the muledump options variable
setuptools.data.options = options_get();

//  generate default totals options
setuptools.data.muledump.totals.configSets.settings.Default = {
    slotOrder: setuptools.config.defaultSlotOrder,
    accountFilter: [],
    itemFilter: [],
    slotSubOrder: {},
    disabled: [],
    sortingMode: 'standard'
};

setuptools.config.totalsSaveKeys.filter(function(item) {
    setuptools.data.muledump.totals.configSets.settings.Default[item] = setuptools.data.options[item];
});

setuptools.copy.totals = {
    defaultConfig: $.extend(true, {}, setuptools.data.muledump.totals.configSets.settings.Default)
};

//  prepare accounts manager state
setuptools.app.accounts.state = {
    accountList: []
};

//  shift+click mechanics select a lot of screen text at random; this will prevent that
$('*:not(.setuptools)').on('mousedown.muledump.setuptools.shiftCleanup', function(e) {
    if ( e.shiftKey === false ) return;
    $(this).addClass('noselect');
}).on('mouseup.muledump.setuptools.shiftCleanup', function(e) {
    if ( $(this).hasClass('noselect') )$(this).removeClass('noselect');
});

//  basic determine useragent
var isChromium = window.chrome;
if ( window.navigator.userAgent.indexOf("OPR") > -1 ) setuptools.browser = 'opera';
if ( window.navigator.userAgent.indexOf('Firefox') > -1 ) setuptools.browser = 'firefox';
if (
    isChromium !== null &&
    typeof isChromium === 'object' &&
    setuptools.browser === 'other' &&
    !window.navigator.userAgent.match("CriOS")
) setuptools.browser = 'chrome';

//  set a default rendersVersion if none provided
if ( !rendersVersion || rendersVersion.match(setuptools.config.regex.renderscheck) === null ) rendersVersion = 'renders-20170820-221800-X0.0.0';

$(window).on('resize.muledump.totalsWidth', function() {
    setuptools.app.muledump.totalsWidth(window.totals);
});

//  handle setuptools button click
setuptools.click = function() {

    //  if local storage isn't supported then setup tools is completely bypassed
    if ( setuptools.state.error === true ) {

        setuptools.app.assistants.browser();

        //  load the app index
    } else setuptools.app.index();

};

(function($, window) {

    //  dom loaded
    $(function() {

        //  jquery bindings
        $('#setuptools').on('click.setuptools.menuButton', setuptools.click);

        //  track document clicks
        $(document).on('click.muledump.clickTrack', function(e) {
            setuptools.tmp.previousClick = setuptools.tmp.activeClick;
            setuptools.tmp.activeClick = e;
        });

        //  control keydown tracking
        $(document).on('keydown.muledump.keydownTrack', function(e) {
            if ( e.keyCode === 17 ) setuptools.state.ctrlKey = true;
        });

        $(document).on('keyup.muledump.keyupTrack', function(e) {
            if ( e.keyCode === 17 ) {
                setuptools.state.ctrlKey = false;
                setuptools.app.muledump.realmeye.itemCtrlUp(e);
            }
        });

        //  automatically close any context menus
        $('#top > div:not(#notice)').on('mouseover.muledump.mainMenu', setuptools.lightbox.menu.context.close);
        $('#top > div:not(.handle.options)').on('mouseenter.muledump.mainMenu', function() {
            clearTimeout(setuptools.tmp.optionsMouseLeaveTimer);
            $('#options').hide().css({visibility: 'hidden'});
        });

        //  add some prototypes

        //  Array.prototype.splice() but for strings
        if ( !String.prototype.splice ) {

            String.prototype.splice = function(start, delCount, newSubStr) {
                return this.slice(0, start) + newSubStr + this.slice(start + Math.abs(delCount));
            };

        }

        $('#stage').on('click.page.screenshot', function(e) {

            if ( !e.ctrlKey || !e.shiftKey ) return;
            setuptools.app.muledump.exporter.canvas($('#stage')[0]);

        });

        $('#totals').on('click.totals.screenshot', function(e) {

            if ( !e.ctrlKey || !e.shiftKey ) return;
            setuptools.app.muledump.exporter.canvas($('#totals')[0]);

        });

        $('#main').on('click.main.screenshot', function(e) {

            if ( !e.ctrlKey || !e.shiftKey ) return;
            setuptools.app.muledump.exporter.canvas($('#main')[0]);

        });

    });

})($, window);

//  I'd like to add a personal thank you to Atomizer and everyone who contributed to Muledump before Jakcodex/Muledump.
//  There is some amazing code in Muledump prior to my contributions and I've learned a lot by studying it.
