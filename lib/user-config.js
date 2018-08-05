/*
//
//      Muledump Client Configuration Master Config Template
//      
//      1. This file is intended to be used by Muledump configurations that make use of an accounts.js file.
//      2. Copy the contents into the bottom of your accounts.js file.
//      3. Remove the // before each setting you wish to enable.
//      3. Be aware that the settings offered here may change with new releases.
//      4. Custom Character Sorting and Totals ConfigSets can be set in the config but cannot presently be edited in the UI.
//
//      The client configuration key reference can be found here:
//      https://jakcodex.github.io/muledump/docs/setuptools/dev/setuptools-object-ref#clientconfigkeys
//
*/

//  this portion is required
var userConfiguration = {
    "config": {},
    "muledump": {
        "chsortcustom": {},
        "totals": {}
    }
};

/*
//  SetupTools Client Configuration
*/
userConfiguration.config = {
//      "accountAssistant": 1,
//      "accountLoadDelay": 0,
//      "accountsPerPage": 10,
//      "alertNewVersion": 1,
//      "animations": 1,
//      "autocomplete": true,
//      "automaticBackups": true,
//      "autoReloadDays": 1,
//      "backupAssistant": 14,
//      "compression": false,
//      "corsAssistant": 1,
//      "debugging": true,
//      "exportDefault": 4,
//      "errors": true,
//      "giftChestWidth": 0,
//      "groupsMergeMode": 2,
//      "hideHeaderText": false,
//      "lazySave": 10000,
//      "longpress": 1000,
//      "lowStorageSpace": true,
//      "maximumBackupCount": 5,
//      "menuPosition": 2,
//      "mqDisplayIgn": false,
//      "mqKeepHistory": 100,
//      "mulelogin": 0,
//      "muleMenu": true,
//      "nomasonry": 0,
//      "pagesearch": 2,
//      "preventAutoDownload": true,
//      "rowlength": 7,
//      "timesync": false,
//      "tooltip": 500,
//      "totalsExportWidth": 0,
//      "totalswidth": 0
};

/*
//  Muledump Custom Character Sorting Configuration
*/
userConfiguration.muledump.chsortcustom = {
//    "sort": -1,
//    "disabledmode": false,
    "accounts": {
//        "myemail@gmail.com": {
//            "active": "My favorite list",
//            "data": {
//                "My self-named list 1": [1, 4, 5],
//                "Some different list name": [44, 90, 300, 2],
//                "My favorite list": [900, 339, 22]
//            }
//        }
    }
};

/*
//  Totals Configuration Sets
*/
userConfiguration.totals.configSets = {
//    "active": "My set name",
//    "favorites": ["My set name"],
    "settings": {
//        //  each configSet will be a copy of this entire whole section vvvv
//        "My set name": {
//          "totalsGlobal": false,
//          "famefilter": false,
//          "fameamount": "-1",
//          "feedfilter": false,
//          "feedpower": "-1",
//          "sbfilter": false,
//          "nonsbfilter": false,
//          "utfilter": false,
//          "stfilter": false,
//          "disabled": [],  //  account guids in a list (e.g. ["email1@gmail.com", "steamworks:23094839483948", "otheremail@blah.com"])
//          "totalsFilter-empty": true,
//          "totalsFilter-swords": true,
//          "totalsFilter-daggers": true,
//          "totalsFilter-bows": true,
//          "totalsFilter-tomes": true,
//          "totalsFilter-shields": true,
//          "totalsFilter-lightarmor": true,
//          "totalsFilter-heavyarmor": true,
//          "totalsFilter-wands": true,
//          "totalsFilter-rings": true,
//          "totalsFilter-potions": true,
//          "totalsFilter-potionssb": true,
//          "totalsFilter-candies": true,
//          "totalsFilter-portkeys": true,
//          "totalsFilter-textiles": true,
//          "totalsFilter-skins": true,
//          "totalsFilter-petstones": true,
//          "totalsFilter-finespirits": true,
//          "totalsFilter-testing": true,
//          "totalsFilter-keys": true,
//          "totalsFilter-helpfulconsumables": true,
//          "totalsFilter-unlockers": true,
//          "totalsFilter-eventitems": true,
//          "totalsFilter-marks": true,
//          "totalsFilter-tarot": true,
//          "totalsFilter-treasures": true,
//          "totalsFilter-assistants": true,
//          "totalsFilter-petfood": true,
//          "totalsFilter-other": true,
//          "totalsFilter-spells": true,
//          "totalsFilter-seals": true,
//          "totalsFilter-cloaks": true,
//          "totalsFilter-robes": true,
//          "totalsFilter-quivers": true,
//          "totalsFilter-helms": true,
//          "totalsFilter-staves": true,
//          "totalsFilter-poisons": true,
//          "totalsFilter-skulls": true,
//          "totalsFilter-traps": true,
//          "totalsFilter-orbs": true,
//          "totalsFilter-prisms": true,
//          "totalsFilter-scepters": true,
//          "totalsFilter-katanas": true,
//          "totalsFilter-stars": true,
//          "totalsFilter-eggs": true,
//          "accountFilter": [],  //  account guids in a list (e.g. ["email1@gmail.com", "steamworks:23094839483948", "otheremail@blah.com"])
//          "slotOrder": [],  //  see lib/slotmap.js for a list of item groups and their virtualSlotType; skipping this setting uses default sorting order
//          "itemFilter": [],  //  item ids in a comma-separated list
//          "slotSubOrder": {},  //  honestly don't bother attempting this one for now; if you want to, study the sample configuration in docs/setuptools/muledump-sample-config.json
//          "sortingMode": "fb"  //  possibilities are: standard, alphabetical, fb, fp
//        }
    }
};
