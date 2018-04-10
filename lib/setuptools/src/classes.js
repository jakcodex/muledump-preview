//  lock an element to a position when scrolling
class Muledump_ElementScrollLock {

    constructor(track, hook, config) {

        if ( typeof track === 'undefined' ) throw 'Track selector is invalid';
        if ( typeof hook === 'undefined' ) throw 'Hook selector is invalid';

        //  build config
        this.config = {
            name: undefined,
            autoStart: true
        };
        if ( typeof config === 'object' ) $.extend(true, this.config, config);
        if ( typeof config === 'string' ) this.config.name = config;
        this.name = 'ScrollLock' + ( typeof this.config.name === 'string' ) ? '.' + this.config.name : '';

        this.track = track;
        this.hook = hook;
        if ( this.config.autoStart === true ) this.start();

    }

    start() {

        this.ScrollPos = 0;
        $(window).off('scroll.' + this.name).on('scroll.' + this.name, [this], function (e) {

            var self = e.data[0];
            this.trackDom = $(self.track);
            if ($(this).scrollTop() <= this.ScrollPos) {

                //Scrolling Up
                var pos = $(self.hook).offset();
                var domPos = this.trackDom.offset();
                if ( typeof domPos === 'undefined' ) {
                    return;
                }
                if ( (domPos.top-26) >= pos.top ) {

                    this.trackDom.css({
                        left: pos.left,
                        top: pos.top + 26,
                        visibility: 'visible',
                        'z-index': '1000'
                    });

                }

            } else {

                this.trackDom.css({"z-index": "475"});

            }

            this.ScrollPos = $(this).scrollTop();

        });

    };

    stop() {

        $(window).off('scroll.' + this.name);

    }

}

//  provide an interface for collecting totals data
class Muledump_TotalsCounter {

    constructor(guid, cache, callback) {

        this.state = true;
        this.busy = false;
        this.aggregate = false;
        this.sources = [];
        this.excluded = [];
        this.cache = cache;
        if ( guid === 'global' ) this.cache = false;
        if ( typeof callback === 'function' ) this.callback = callback;
        this.guid = guid;
        this.cache_key = 'cache:' + guid + ':totals';
        this.data = this.createDataObject();

        //  are we loading the cache?
        var json = this.read(this.cache_key);
        if ( cache === true && typeof json !== 'string' ) {
            this.cache = false;
        }
        if ( typeof cache === 'undefined' && typeof json === 'string' ) this.cache = true;
        if ( this.cache === false ) return;

        //  is there cache data available?
        var data;
        try {
            data = JSON.parse(json);
        } catch (e) {}
        if ( typeof data !== 'object' ) return;

        //  merge it
        $.extend(true, this.data, data);
        if ( typeof this.callback === 'function' ) this.callback(this);

    }

    read(key) {

        if ( typeof setuptools === 'object' ) return setuptools.storage.read(key);

        var response;
        try {
            response = localStorage[key];
        } catch(e) {
            return;
        }
        return response;

    }

    //  very simple storage function
    write(key, value) {

        //  making this friendly to non-muledump users
        if ( typeof setuptools === 'object' ) return setuptools.storage.write(key, value);

        try {
            localStorage[key] = value;
        } catch(e) {
            return false;
        }
        return true;

    }

    //  provide a clean, new copy of our default totals object
    createDataObject() {

        return $.extend(true, {}, {
            meta: {
                version: 0,
                created: Date.now()
            },
            types: {
                equipment: {},
                inv: {},
                backpack: {},
                vaults: {},
                gifts: {}
            },
            totals: {}
        });

    }

    //  count the provided item
    count(id, type, qty, force) {

        if ( typeof qty === 'boolean' ) {
            force = qty;
            qty = undefined;
        }
        if ( this.state === false ) return;
        if ( this.cache === true && force !== true ) {
            this.error = "Cannot count totals when using cached data";
        }

        if ( typeof setuptools === 'object' && setuptools.tmp.constantsRemovedItems.indexOf(Number(id)) > -1 ) id = '-1';
        if ( typeof qty !== 'number' ) qty = 1;
        if ( typeof this.data.types[type] === 'object' ) this.data.types[type][id] = ( typeof this.data.types[type][id] === 'number' ) ? this.data.types[type][id]+qty : qty;
        this.data.totals[id] = ( typeof this.data.totals[id] === 'number' ) ? this.data.totals[id]+qty : qty;
        this.data.meta.updated = Date.now();

    }

    //  aggregate data from multiple trackers
    import(tracker, excluded) {

        if ( this.busy === true ) return;
        var self = this;

        //  exclude or include guids from global totals when rebuilding
        if ( typeof window.accounts[tracker] === 'string' ) tracker = [tracker];
        if ( Array.isArray(tracker) === true ) {

            if ( excluded === true && this.excluded.indexOf(tracker) === -1 ) this.excluded = this.excluded.concat(tracker);
            if ( excluded === false )
                for ( var i = 0; i < tracker.length; i++ )
                    this.excluded.splice(this.excluded.indexOf(tracker[i]), 1);
            tracker = undefined;

        }

        //  clear all excluded items from the filter
        if ( tracker === 'clearExcluded' ) {
            this.excluded = [];
            tracker = undefined;
        }

        //  modify excluded accounts to include Account Filter
        if (
            Array.isArray(setuptools.app.muledump.totals.config.getKey('accountFilter')) === true &&
            setuptools.app.muledump.totals.config.getKey('accountFilter').length > 0
        ) {

            this.excluded = [];
            for ( var guid in window.mules )
                if ( window.mules.hasOwnProperty(guid) )
                    if (
                        this.excluded.indexOf(guid) === -1 &&
                        (
                            window.mules[guid].disabled === true ||
                            setuptools.app.muledump.totals.config.getKey('accountFilter').indexOf(guid) === -1
                    ) ) this.excluded.push(guid);

        }

        //  no tracker provided; load all mule trackers into aggregate data
        if ( !tracker ) {

            this.busy = true;
            this.aggregate = true;
            tracker = [];
            this.data = this.createDataObject();
            for (var guid in window.mules) {

                if (
                    window.mules.hasOwnProperty(guid) &&
                    this.excluded.indexOf(guid) === -1 &&
                    window.mules[guid].disabled !== true
                ) {

                    if ( !(window.mules[guid].totals instanceof Muledump_TotalsCounter) ) {
                        this.error = "Import only accepts instances of Muledump_TotalsCounter as its argument";
                        continue;
                    }

                    Object.filter(window.mules[guid].totals.data.types, function (type, data) {
                        for (var item in data)
                            if (data.hasOwnProperty(item))
                                self.count(item, type, data[item], true);
                    });

                    this.sources.push(guid);

                }

            }

            this.busy = false;
            return;

        }

        //  load provided tracker into aggregate data
        if ( tracker instanceof Muledump_TotalsCounter ) {

            this.busy = true;
            this.aggregate = true;
            Object.filter(tracker.data.types, function (type, data) {
                for (var item in data)
                    if (data.hasOwnProperty(item))
                        self.count(item, type, data[item], true);
            });
            this.busy = false;

        }

    }

    //  save data cache to local storage
    save() {

        if ( this.state === false ) return;
        this.data.meta.saved = Date.now();
        this.data.meta.version++;
        var saveObject;
        try {
            saveObject = JSON.stringify(this.data);
        } catch (e) {
            this.error = "Cannot save to local storage";
            return;
        }
        this.cache = true;
        this.write(this.cache_key, saveObject);
        if ( typeof this.callback === 'function' ) this.callback();

    }

    //  output the totals data for this tracker in json
    toString(pretty) {

        var json;
        try {
            json = ( pretty === true ) ? JSON.stringify(this.data, true, 5) : JSON.stringify(this.data);
        } catch (e) {}
        return json;

    }

    //  delete data cache
    clear() {

        return setuptools.storage.delete(this.cache_key);

    }

}
