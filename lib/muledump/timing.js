/*

    JTimer - Simple Event Timing

    Methods
    + JTimer(options)
    + JTimer.start(startCallback)
    + JTimer.stop(stopCallback)
    + JTimer.cancel()
    + JTimer.history(message, data)

    Properties
    + JTimer.error
    + JTimer.historyData
    + JTimer.options
    + JTimer.optionsTemplate
    + JTimer.runtime
    + JTimer.state
    + JTimer.track.start
    + JTimer.track.stop

    Configuration Options
    + name                  Custom name for the task [default=JTimerDefault]
    + autoStart             Start timer on creation [default=true]
    + verbose               Enable verbose logging [default=false]
    + startCallback         Callback to execute upon starting the timer [default=undefined]
    + stopCallback          Callback to execute upon stopping the timer [default=undefined]

    Basic usage:

        var timer = new JTimer;
        //  your task here
        timer.stop();
        //  timer.runtime is how long the task took in ms

    Advance usage:

        var timer = new JTimer({
            name: 'MyTimer',
            verbose: true,
            startCallback: function(self) {
                //  your task here
                self.stop();
            },
            stopCallback: function(self) {
                //  your stop code here
                console.log(self.runtime);
            }
        });

    Other Examples:

        //  let's say you're storing many timers
        var timer = {};
        timer.mytimer = new JTimer;

        //  some work is done here

        //  you decide to stop the timer and change the stopCallback
        timer.mytimer.stop(function(self) {

            //  let's delete the timer data
            delete timer.mytimer;

        });

*/

class JTimer {

    constructor(options) {

        //  set default properties
        this.state = 'init';
        this.options = {};
        this.historyData = [];
        this.track = {
            init: new Date,
            start: undefined,
            stop: undefined
        };

        //  options definition
        this.optionsTemplate = {
            name: {types: ['string'], required: true, default: 'JTimerDefault'},
            autoStart: {types: ['boolean'], default: true},
            verbose: {types: ['boolean']},
            startCallback: {types: ['function']},
            stopCallback: {types: ['function']},
            custom: {types: ['object']}
        };

        //  process options options
        try {

            if (typeof options !== 'object') options = {};

            //  specify default values
            var defaultValues = Object.keys(this.objFilter(this.optionsTemplate, function(key, value) {
                return ( typeof value.default !== 'undefined' );
            }));
            for ( var j = 0; j < defaultValues.length; j++ )
                if ( typeof options[defaultValues[j]] === 'undefined' )
                    options[defaultValues[j]] = this.optionsTemplate[defaultValues[j]].default;

            //  check for required options
            var requiredOptions = Object.keys(this.objFilter(this.optionsTemplate, function(key, value) {
                return ( value.required === true );
            }));
            for ( var x = 0; x < requiredOptions.length; x++ )
                if ( typeof options[requiredOptions[x]] === 'undefined' ) throw 'Option "' + x + '" is required and missing.';

            //  validate input options
            for (var i in options) {

                if (options.hasOwnProperty(i)) {

                    if (typeof this.optionsTemplate[i] === 'undefined') throw 'Option "' + i + '" is not recognized.';
                    if ( this.optionsTemplate[i].types.indexOf(typeof options[i]) === -1 ) throw 'Option "' + i + '" is not a valid type.';

                }

            }

        } catch(e) {
            this.catchError(e);
            return;
        }

        //  save our options
        this.options = options;

        //  start timer
        this.state = 'ready';
        if ( this.options.autoStart === true ) this.start();

    }

    //  filter provided object
    objFilter(object, expect, callback) {

        //  argument shortcut
        if ( typeof expect === 'function' ) {
            callback = expect;
            expect = true;
        }

        //  run the comparison
        var list = {};
        for ( var i in object )
            if ( object.hasOwnProperty(i) )
                if ( callback(i, object[i]) === expect )
                    list[i] = object[i];
        return list;

    }

    //  catch thrown errors and report them
    catchError(message) {

        this.state = 'error';
        this.error = message;
        if ( ['string', 'number', 'boolean', 'object'].indexOf(typeof message) === -1 ) throw 'JTimer/Error - ' + this.options.name + ' - invalid error message';
        console.error('JTimer/Error - ' + ( this.options.name || 'Unknown') + ' - ' + message);

    }

    //  record a history message for the timer
    history(message, data) {

        try {
            if (this.state === 'error') throw 'Timer is not eligible to start.';
        } catch(e) {
            this.catchError(e);
            return;
        }

        if ( this.options.verbose === true ) {

            var historyObject = {
                t: new Date,
                m: message,
                d: data || null
            };
            this.historyData.push(historyObject);

        }

    }

    //  start a timer and any startup callbacks
    start(callback) {

        try {
            if (['ready', 'done'].indexOf(this.state) === -1 ) throw 'Timer is not eligible to start.';
        } catch(e) {
            this.catchError(e);
            return;
        }

        if ( typeof callback === 'function' ) this.options.startCallback = callback;
        this.state = 'running';
        this.history('Timer is starting');
        this.track.stop = undefined;
        this.track.start = performance.now() || Date.now();
        if ( typeof this.options.startCallback === 'function' ) this.options.startCallback(this);

    }

    //  stop a timer and run any stop callbacks
    stop(callback) {

        try {
            if (this.state !== 'running') throw 'Timer is not running.';
        } catch(e) {
            this.catchError(e);
            return;
        }

        this.track.stop = performance.now() || Date.now();
        if ( typeof callback === 'function' ) this.options.stopCallback = callback;
        this.state = 'done';
        this.runtime = Math.round(this.track.stop-this.track.start);
        this.history('Timer is finished - ' + this.runtime);
        if ( typeof this.options.stopCallback === 'function' ) this.options.stopCallback(this);

    }

    //  stop a timer without performing any callbacks or runtime calculations
    cancel() {

        try {
            if ( ['init', 'running'].indexOf(this.state) === -1 ) throw 'Timer is not ready or running.';
        } catch(e) {
            this.catchError(e);
            return;
        }

        this.track.stop = performance.now() || Date.now();
        this.state = 'cancelled';
        this.history('Cancelled');

    }

}

//  initialize the timer tracking and start the script init timer
var timing = {};
timing.scriptInit = new JTimer({name: 'scriptInit'});