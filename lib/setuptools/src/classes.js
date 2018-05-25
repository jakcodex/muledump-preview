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
        this.excluded = [];
        for ( var guid in window.mules )
            if ( window.mules.hasOwnProperty(guid) )
                if (
                    this.excluded.indexOf(guid) === -1 &&
                    (
                        (window.mules[guid].loaded === false && window.mules[guid].loginOnly !== true) ||
                        window.mules[guid].disabled === true ||
                        (
                            Array.isArray(setuptools.app.muledump.totals.config.getKey('accountFilter')) === true &&
                            setuptools.app.muledump.totals.config.getKey('accountFilter').length > 0 &&
                            setuptools.app.muledump.totals.config.getKey('accountFilter').indexOf(guid) === -1
                        )
                ) ) this.excluded.push(guid);

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
                    window.mules[guid].disabled !== true &&
                    (window.mules[guid].loaded === true || window.mules[guid].loginOnly === true)
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

class Muledump_MouseDirection {

    constructor(config) {

        this.config = $.extend(true, {
            debug: false,
            name: 'muledump.mousedirection',
            variance: 5,
            approach: 0.3,
            target: {}
        }, config);

        this.state = 'init';
        this.track = {
            mouse: {x: 0, y: 0},
            offset: {x: 0, y: 0},
            target: {width: 0, height: 0}
        };

        //  positioning relative to the target
        this.rel = {
            v: false,
            h: false
        };

        //  direction the mouse is moving relative to the window
        this.travel = {
            v: false,
            h: false
        };

        //  approach detection of the mouse on a target
        this.approach = {
            v: false,
            h: false
        };

        this.runtimeId = (setuptools.seasalt.hash.sha256(Date.now().toString())).substr(56, 64);
        this.namespace = this.config.name + '.' + this.runtimeId;
        if ( typeof config === 'undefined' ) config = {};
        if ( typeof config !== 'object' ) {
            this.state = 'error';
            this.error = true;
            this.errorMessage = 'Supplied configuration is not valid.';
            return;
        }

        this.state = 'ready';
        this.restart();

    }

    restart() {
        this.off();
        this.on();
    }

    off() {

        if ( this.state !== 'running' ) return;
        $(window).off('mousemove.' + this.namespace);
        this.state = 'ready';

    }

    on() {

        if ( this.state !== 'ready' ) return;
        var self = this;
        $(window).on('mousemove.' + this.namespace, function(e) {

            //  where are we located relative to the target we are over?
            self.rel.target = $(e.target);
            var matches = 0;
            var required = 0;

            //  target validation if provided

            //  are required classes provided?
            if ( self.config.target.class ) {

                if ( typeof self.config.target.class === 'string' ) self.config.target.class = [self.config.target.class];
                if ( Array.isArray(self.config.target.class) === false ) return;
                required += self.config.target.class.length;
                for ( var i = 0; i < self.config.target.class.length; i++ )
                    if ( self.rel.target.hasClass(self.config.target.class[i]) === true )
                        matches++;

            }

            //  are required attributes provided?
            if ( self.config.target.attr ) {

                if ( typeof self.config.target.attr !== 'object' ) return;
                required += Object.keys(self.config.target.attr).length;
                for ( var attr in self.config.target.attr )
                    if ( self.config.target.attr.hasOwnProperty(attr) )
                        if ( self.rel.target.attr(attr) === self.config.target.attr[attr] )
                            matches++;

            }

            //  if required number of matches are not met we will not calculate this event
            if ( matches !== required ) return;

            //  horizontal page positioning
            if ( Math.abs(e.pageX-self.track.mouse.x) > self.config.variance ) {
                self.travel.h = ( self.track.mouse.x < e.pageX );
                self.track.mouse.x = e.pageX;
            } else self.travel.h = undefined;

            //  vertical page positioning
            if ( Math.abs(e.pageY-self.track.mouse.y) > self.config.variance ) {
                self.travel.v = ( self.track.mouse.y < e.pageY );
                self.track.mouse.y = e.pageY;
            } else self.travel.v = undefined;

            //  target positioning
            self.rel.h = ( (e.offsetX/$(e.target).outerWidth()) > 0.5 );
            self.rel.v = ( (e.offsetY/$(e.target).outerHeight()) > 0.5 );

            //  target approach calculations
            var avariance = 0.5-self.config.approach;
            if ( self.travel.h === true ) {
                self.approach.h = ( (e.offsetX/$(e.target).outerWidth()) >= (0.5-avariance) );
            } else {
                self.approach.h = ( (e.offsetX/$(e.target).outerWidth()) <= (0.5+avariance) );
            }

            if ( self.travel.v === true ) {
                self.approach.v = ( (e.offsetY/$(e.target).outerHeight()) >= (0.5-avariance) );
            } else {
                self.approach.v = ( (e.offsetY/$(e.target).outerHeight()) <= (0.5+avariance) );
            }

        });

    }

}

//  drag target divs around a container and react to changes
class Muledump_Dragging {

    constructor(config) {

        if ( typeof config === 'undefined' ) config = {};
        if ( typeof config !== 'object' ) {
            this.state = 'error';
            this.error = true;
            this.errorMessage = 'Invalid configuration provided';
            return;
        }
        this.config = $.extend(true, {
            name: 'draggable',
            target: [],
            approach: 0.2,
            variance: 5,
            dragclass: 'dragging',
            targetattr: undefined,
            callbacks: {
                before: undefined,
                after: undefined,
                finished: undefined
            }
        }, config);

        //  this must be a string or empty
        if ( ['string', 'undefined'].indexOf(typeof this.config.targetattr) === -1 ) {
            this.state = 'error';
            this.error = true;
            this.errorMessage = 'Invalid target attribute specified';
            return;
        }

        this.targetName = '.' + this.config.target.join('.');
        this.namespace = 'muledump.dragging.' + this.config.name + Date.now().toString();
        this.MouseDirection = new Muledump_MouseDirection({
            target: {
                class: this.config.target
            },
            approach: this.config.approach,
            variance: this.config.variance
        });

        this.on();

    }

    off() {

        if ( this.error === true ) return;
        $(this.targetName).off('mousedown.' + this.namespace);
        this.MouseDirection.off();
        $(window)
            .off('mousemove.' + this.namespace)
            .off('mouseup.' + this.namespace);
    }

    on() {

        if ( this.error === true ) return;
        var parent = this;
        $(this.targetName).on('mousedown.' + this.namespace, function(e) {

            //  cell has been selected
            var self = $(this);
            self.addClass(parent.config.dragclass);
            parent.lastIndex = 0;
            parent.clickIndexDown = self.index();
            $(window)
            //  move the cell with the mouse
                .off('mousemove.' + parent.namespace)
                .on('mousemove.' + parent.namespace, function(e) {

                    //  valid elements to consider have data-type attributes
                    if ( typeof parent.config.targetattr === 'string' ) {

                        parent.target = $(e.target).attr(parent.config.targetattr);
                        if (parent.target === undefined) return;

                    }

                    //  it flickers light a back alley lamp if you don't exclude itself from the moving
                    if ( parent.MouseDirection.approach.h === false && parent.MouseDirection.approach.v === false && parent.lastIndex === $(e.target).index() ) return;
                    parent.lastIndex = $(e.target).index();

                    //  run any before move callback (expects a return of true)
                    if ( typeof parent.config.callbacks.before === 'function' )
                        if ( parent.config.callbacks.before(parent, self) !== true )
                            return;

                    //  default action is to insert the div before the target
                    parent.indexModifier = 0;

                    //  if we are traveling to the right or down then we'll insert after the target
                    if (
                        (parent.MouseDirection.approach.h === true && parent.MouseDirection.travel.h === true) ||
                        (parent.MouseDirection.rel.v === false && parent.MouseDirection.travel.v === true)
                    ) parent.indexModifier = 1;

                    /*
                    //  this is a neat idea but with the divs moving so much it won't work like this
                    //  could just light up the various elements by index, but the animations get messy
                    tailIndex -= indexModifier;
                    var siblings = self.siblings().eq(tailIndex);
                    siblings.addClass('draggingtail');
                    setTimeout(function(self) {
                        self.removeClass('draggingtail');
                    }, 2500, siblings);
                    */

                    //  move div
                    if ( parent.indexModifier === 0 ) {
                        self.insertBefore($(e.target));
                    } else {
                        self.insertAfter($(e.target));
                    }

                    //  run after move callback
                    if ( typeof parent.config.callbacks.after === 'function' )
                        parent.config.callbacks.after(parent, self);

                })
                //  react to the mouse being released
                .off('mouseup.' + parent.namespace)
                .on('mouseup.' + parent.namespace, function(e) {

                    parent.clickIndexUp = self.index();
                    self.removeClass(parent.config.dragclass);
                    $(window)
                        .off('mousemove.' + parent.namespace)
                        .off('mouseup.' + parent.namespace);

                    //  run finish callback
                    if ( typeof parent.config.callbacks.finish === 'function' )
                        parent.config.callbacks.finish(parent, self);

                });

        });

    }

}
