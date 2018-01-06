/*/ concepts
//
//  Mules should be returned to their original state with most of the MuleQueue code stripped from them.
//  If Mule.query() is called, it should always run its intended task instead of enforcing the queue upon itself.
//
//  On startup, a Mule will go through several steps taking one of multiple possible paths.
//  The first order of business is to display the Mule as soon as possible. If there is data cache available for the Mule, it should be rendered.
//  The second order of business is to check for cache freshness and send the request to the reload queue if necessary.
//
//  While the queue is running, it should be possible to add to, rearrange, and modify the queue as desired.
//  It should also be possible for an instant reload request to be sent (completely bypassing MuleQueue).
//
//  Calling queue on a GUID will push it to the queue with any supplied config. This does not actually run the request.
//  Calling queue multiple times on a GUID in the queue will result in the task configuration being updated if it isn't already running.
//  All queue items are processed by the MuleQueue background task. This task runs inside a timer generally every second and checks the queue for new object.
//  The background task will run up to mqConcurrent queue tasks at the same time until the queue is finished.
/*/

//  define this block
setuptools.app.mulequeue = {
    task: {},
    state: {
        active: false,                      //  whether or not the background task is actively doing something
        running: false,                     //  whether or not a queue or task is running
        paused: false,                      //  whether or not a queue is paused
        busy: 0,                            //  number of running tasks (caps at mqConcurrent)
        bgTask: undefined,                  //  interval reference for background task
        bgPing: false,                      //  last ping from the background task at its start
        bgHealth: false,                    //  health state of background task
        rateLimited: false,                 //  whether or not we are rate limited (Date.now() of rate limit detection)
        lastTaskFinished: new Date(2017, 0, 1), //  most recently finished tasks's timestamp
    },
    queue: [],              //  list of guids in queue (corresponds to tasks)
    tasks: {},              //  task configuration data
    history: [],            //  history of queue tasks
};

//  initialize mulequeue
setuptools.app.mulequeue.main = function() {

    //  some config sanity
    if ( $.isNumeric(setuptools.data.config.mqConcurrent) === false || setuptools.data.config.mqConcurrent > 30 ) setuptools.data.config.mqConcurrent = 1;

    //  check if we're already rate limited
    setuptools.app.mulequeue.state.rateLimitExpiration = setuptools.storage.read('ratelimitexpiration');
    if ( setuptools.app.mulequeue.state.rateLimitExpiration > new Date ) setuptools.app.mulequeue.task.rateLimit(true);

    //  start the background task
    setuptools.app.mulequeue.task.background();

    //  start the background task health checker
    setInterval(setuptools.app.mulequeue.task.bgHealth, setuptools.config.mqBGHealthDelay);

};

//  mulequeue menu
setuptools.app.mulequeue.menu = function(e) {

    //  close the menu if it is already open
    if ( setuptools.lightbox.menu.context.isOpen('mulequeue-menu') === true ) {
        setuptools.lightbox.menu.context.close();
        return;
    }

    setuptools.lightbox.menu.context.close();

    var MuleQueueButton = $('#mulequeue');
    var options = [
        {
            option: 'keyup',
            value: false
        },
        {
            option: 'hover',
            action: 'close'
        },
        {
            option: 'pos',
            vpx: MuleQueueButton.outerHeight(true) + 4
        }
    ];

    if ( setuptools.app.mulequeue.state.rateLimited === true ) {

        options.push(
            {
                option: 'class',
                value: 'rateLimitMenu'
            },
            {
                option: 'link',
                class: 'rateLimitHelp',
                name: 'What is rate limiting?',
                href: setuptools.config.ratelimitHelp,
                target: '_blank'
            }
        );

    } else {

        if ( setuptools.app.mulequeue.state.running === true ) {

            if ( setuptools.app.mulequeue.state.paused === false ) {

                options.push({
                    class: 'pauseQueue',
                    name: 'Pause',
                    callback: function () {
                        setuptools.app.mulequeue.task.pause();
                    }
                });

            } else {

                options.push({
                    class: 'resumeQueue',
                    name: 'Resume',
                    callback: function () {
                        setuptools.app.mulequeue.task.resume();
                    }
                });

            }

            options.push({
                class: 'cancelQueue',
                name: 'Cancel',
                callback: function() {
                    setuptools.app.mulequeue.task.cancel();
                }
            });

        } else {

            options.push({
                class: 'startQueue',
                name: 'Reload Accounts',
                callback: function () {
                    setuptools.app.mulequeue.task.reload();
                }
            });

        }

    }

    setuptools.lightbox.menu.context.create('mulequeue-menu', false, MuleQueueButton, options);

};

/*/
// mulequeue background tasks
/*/

//  background tasks health checker
setuptools.app.mulequeue.task.bgHealth = function() {

    //  check how long it has been since the background task last ran
    if ( (setuptools.app.mulequeue.state.rateLimited === false && setuptools.app.mulequeue.state.paused === false) && new Date > (Number(setuptools.app.mulequeue.state.bgPing)+(setuptools.data.config.mqBGTimeout*1000)) ) {

        window.techlog('MuleQueue/bgHealth starting background task', 'force');
        setuptools.app.mulequeue.state.active = false;
        setuptools.app.mulequeue.state.bgHealth = false;
        clearInterval(setuptools.app.mulequeue.state.bgTask);
        setuptools.app.mulequeue.state.bgTask = undefined;
        setuptools.app.mulequeue.task.background();

    }

};

//  update the background health state
setuptools.app.mulequeue.task.ping = function() {

    setuptools.app.mulequeue.state.bgPing = new Date;
    setuptools.app.mulequeue.state.bgHealth = true;

};

//  create a task promise and run the task
setuptools.app.mulequeue.task.createPromise = function(guid) {

    return new Promise(function (MuleQueue) {

        var task = setuptools.app.mulequeue.tasks[guid];
        window.techlog('MuleQueue/TaskStart - ' + guid, 'force');
        mules[guid].query(task.ignore_cache, task.cache_only, false, MuleQueue);

    });

};

//  background tasks processes queue items
setuptools.app.mulequeue.task.background = function() {

    //  start the background task if it isn't already running
    if ( !setuptools.app.mulequeue.state.bgTask ) {

        setuptools.app.mulequeue.state.bgTask = setInterval(
            setuptools.app.mulequeue.task.background,
            (setuptools.config.mqBGDelay*1000)
        );

    }

    //  don't run if background task is already active or paused
    if ( setuptools.app.mulequeue.state.active === true ) return;

    //  ping
    setuptools.app.mulequeue.task.ping();

    //  check if the queue is paused
    if ( setuptools.app.mulequeue.state.paused === true ) return;

    //  check for rate limiting
    if ( setuptools.app.mulequeue.state.rateLimited === true ) return;

    //  check for queue items
    if (
        setuptools.app.mulequeue.state.rateLimited === false &&
        setuptools.app.mulequeue.queue.length > 0 &&
        setuptools.app.mulequeue.state.busy < setuptools.data.config.mqConcurrent &&
        setuptools.app.mulequeue.state.busy < setuptools.app.mulequeue.queue.length
    ) {

        //  if this is the top of a cycle, check if the minimum cycle delay has passed
        var lastRunDifference = ((new Date)-setuptools.app.mulequeue.state.lastTaskFinished)/1000;
        if (
            setuptools.app.mulequeue.state.busy === 0 &&
            lastRunDifference < setuptools.data.config.accountLoadDelay
        ) {

            window.techlog('MuleQueue/TaskWait - ' + Math.ceil(setuptools.data.config.accountLoadDelay-lastRunDifference) + ' seconds until next cycle');
            return;

        }

        //  run up to mqConcurrent tasks
        setuptools.app.mulequeue.state.active = true;
        setuptools.app.mulequeue.state.running = true;

        //  run tasks
        while ( setuptools.app.mulequeue.state.busy < setuptools.data.config.mqConcurrent )
            setuptools.app.mulequeue.task.start(setuptools.app.mulequeue.queue[setuptools.app.mulequeue.state.busy]);

    }

};

/*/
// mulequeue mule tasks
/*/

//  rate limit all tasks
setuptools.app.mulequeue.task.rateLimit = function(soft) {

    function RateLimitTimer() {

        var RateLimitRemaining = ((setuptools.app.mulequeue.state.rateLimitExpiration - Date.now()) / 1000 / 60).toFixed(2);
        if (RateLimitRemaining <= 0) {

            clearInterval(setuptools.app.mulequeue.state.rateLimitTimer);
            setuptools.app.mulequeue.state.rateLimitTimer = false;
            setuptools.app.mulequeue.state.rateLimited = false;
            $('#stickynotice').empty();
            $('#mulequeue').removeClass('rateLimited');
            window.techlog('MuleQueue/RateLimit expired', 'force');

        } else {

            var Time = RateLimitRemaining.match(/^([0-9]*?)\.([0-9]*?)$/);
            var Minutes = '00';
            var Seconds = 0;
            if ( typeof Time === 'object' ) {
                Minutes = Time[1];
                Seconds = (Number('0.'+Time[2])*60).toFixed(0);
            }
            if ( Seconds < 10 ) Seconds = '0' + Seconds;
            var RateLimitTime = Minutes + ':' + Seconds;
            $('#mulequeue').addClass('rateLimited').removeClass('running');
            $('#stickynotice').html("<div>Warning: Your account is rate limited by Deca. Please wait " + RateLimitTime + " before trying to reload accounts.</div>");

        }

    }

    //  prepare the rate limit
    window.techlog('MuleQueue/RateLimit detected', 'force');
    setuptools.app.mulequeue.state.rateLimited = true;
    if ( soft !== true ) {

        setuptools.app.mulequeue.state.rateLimitExpiration = Date.now()+300000;

        //  write it to storage
        setuptools.storage.write('ratelimitexpiration', setuptools.app.mulequeue.state.rateLimitExpiration);

    }

    //  reset state for any tasks that encountered rate limiting
    if ( setuptools.app.mulequeue.queue.length > 0 )
        for ( var index = (setuptools.app.mulequeue.state.busy-1); index >= 0; index-- )
            setuptools.app.mulequeue.tasks[setuptools.app.mulequeue.queue[index]].state = 'queue';

    //  reset the busy counter to 0
    setuptools.app.mulequeue.state.busy = 0;

    //  start the rate limit timer
    setuptools.app.mulequeue.state.rateLimitTimer = setInterval(RateLimitTimer, 1000);

};

//  parse provided guids list into correct format
setuptools.app.mulequeue.task.guidsCheck = function(guids) {

    if ( !guids ) guids = [];
    if ( typeof guids === 'string' ) guids = [guids];
    if ( Array.isArray(guids) === false ) setuptools.lightbox.error('Data type for argument "guids" not valid.', 1000);
    return guids;

};

//  queue task on all or specified guids
setuptools.app.mulequeue.task.queue = function(guids, config) {

    //  parse guids
    guids = setuptools.app.mulequeue.task.guidsCheck(guids);

    //  set a default config object if none provided or invalid
    if ( typeof config === 'function' ) {
        callback = config;
        config = {};
    } else if ( typeof config !== 'object' || Array.isArray(config) === true ) config = {};

    //  merge supplied config into default config
    config = $.extend(true, {}, setuptools.data.config.mqDefaultConfig, config);

    //  remove reserved config keys
    delete config.state;
    delete config.creation;

    //  add guid to the queue
    for ( var i = 0; i < guids.length; i++ ) {

        //  check if guid is already in the queue
        if ( typeof setuptools.app.mulequeue.tasks[guids[i]] === 'object' ) {

            //  do not interfere if the queue item is already running
            if ( setuptools.app.mulequeue.tasks[guids[i]].state === 'running' ) continue;

            //  update the queue item's configuration
            $.extend(true, setuptools.app.mulequeue.tasks[guids[i]], config);
            continue;

        }

        //  apply madatory config keys
        config.state = 'queue';
        config.creation = new Date;

        setuptools.app.mulequeue.queue.push(guids[i]);                          //  sets queue order
        setuptools.app.mulequeue.tasks[guids[i]] = $.extend(true, {}, config);  //  sets queue config data
        window.techlog('MuleQueue/AddTask queuing ' + guids[i], 'force');

    }

};



//  reload (ignore_cache) task on all or specified guids
setuptools.app.mulequeue.task.reload = function(guids) {

    //  parse guids
    if ( !guids ) guids = Object.keys(window.accounts);
    guids = setuptools.app.mulequeue.task.guidsCheck(guids);

    //  force account data reload
    setuptools.app.mulequeue.task.queue(guids, {
        action: 'reload',
        ignore_cache: true,
        cache_only: false
    });

};

//  refresh (cache_only) task on all or specified guids
setuptools.app.mulequeue.task.refresh = function(guids) {

    //  parse guids
    guids = setuptools.app.mulequeue.task.guidsCheck(guids);

    for ( var x = 0; x < guids.length; x++ ) mules[guids[x]].query(false, true, true);
    return true;

};

//  attempt a cache_only load of guids and send stale guids to reload
setuptools.app.mulequeue.task.load = function(guids, callback) {

    //  parse guids
    guids = setuptools.app.mulequeue.task.guidsCheck(guids);
    if ( guids.length === 0 ) guids = Object.keys(window.accounts);

    //  first loop: cache_only load on all provided guids
    if ( setuptools.app.mulequeue.task.refresh(guids) ) {

        //  second loop: check for freshness and queue stale mules
        for (var y = 0; y < guids.length; y++)
            if (mules[guids[y]].fresh === false)
                setuptools.app.mulequeue.task.reload(guids[y]);

        if (typeof callback === 'function') callback();

    }

};

//  start task on all or specified guids
setuptools.app.mulequeue.task.start = function(guid) {

    //  check if a task exists and make sure it is in the proper state
    if ( typeof setuptools.app.mulequeue.tasks[guid] === 'object' && setuptools.app.mulequeue.tasks[guid].state !== 'queue' ) return;

    //  check if a task exists and queue a reload if not
    if ( typeof setuptools.app.mulequeue.tasks[guid] === 'undefined' ) setuptools.app.mulequeue.task.reload(guid);

    //  reorder the queue if this item isn't in its position
    var taskIndex = setuptools.app.mulequeue.queue.indexOf(guid);
    if ( taskIndex !== setuptools.app.mulequeue.state.busy ) {

        window.techlog('MuleQueue/Start pushing ' + guid + ' to position ' + setuptools.app.mulequeue.state.busy, 'force');
        setuptools.app.mulequeue.queue.splice(taskIndex, 1);
        setuptools.app.mulequeue.queue.splice(setuptools.app.mulequeue.state.busy, 0, guid);
        setuptools.app.mulequeue.queue.filter(function (item) {
            return item !== undefined
        }).join();

    }

    //  we won't run the request if we're rate limited
    if ( setuptools.app.mulequeue.state.rateLimited === true ) return;

    //  run the task
    setuptools.app.mulequeue.state.busy++;
    $('#mulequeue').addClass('running');

    //  update task state
    setuptools.app.mulequeue.tasks[guid].state = 'running';
    setuptools.app.mulequeue.tasks[guid].runtime = new Date;
    setuptools.app.mulequeue.tasks[guid].promise = setuptools.app.mulequeue.task.createPromise(guid).then(function(response) {

        //  handle responses from the task
        var task = setuptools.app.mulequeue.tasks[response.guid];
        if (response.state === 'finished' && task.state === 'running' ) {

            //  handle rate limit detection
            if ( response.status === 'rateLimited' ) {

                setuptools.app.mulequeue.task.rateLimit();
                return;

            }

            //  update the task data for task history
            task.state = 'finished';
            task.finish = new Date;
            task.response = response;
            setuptools.app.mulequeue.state.lastTaskFinished = task.finish;
            setuptools.app.mulequeue.history.push(setuptools.app.mulequeue.tasks[response.guid]);

            window.techlog(
                'MuleQueue/TaskFinish ' +
                '- ' + response.guid +
                ' \'' + response.status + '\'' + ((response.errorMessage) ?
                ' - \'' + response.errorMessage + '\'' :
                ' - runtime ' + ((task.finish-task.runtime)/1000).toFixed(2) + ' seconds') +
                ' - waited ' + Math.floor((task.finish-task.creation)/1000) + ' seconds' +
                ' - remaining tasks ' + (setuptools.app.mulequeue.queue.length-1),
                'force'
            );

            //  clean up the task and remove it from the queue list
            setuptools.app.mulequeue.state.busy--;
            delete setuptools.app.mulequeue.tasks[response.guid];
            setuptools.app.mulequeue.queue.splice(setuptools.app.mulequeue.queue.indexOf(response.guid), 1);
            setuptools.app.mulequeue.queue.filter(function (item) {
                return item !== undefined
            }).join();

            //  no tasks are active anymore
            if ( setuptools.app.mulequeue.state.busy === 0 ) setuptools.app.mulequeue.state.active = false;

            //  if the queue is now empty we can switch the running state to false
            if ( setuptools.app.mulequeue.queue.length === 0 ) {

                $('#mulequeue').removeClass('running');
                setuptools.app.mulequeue.state.running = false;

            }

        }

    });

};

//  pause task on all or specified guids
setuptools.app.mulequeue.task.pause = function(guids) {

    //  parse guids
    if ( !guids ) guids = [];
    guids = setuptools.app.mulequeue.task.guidsCheck(guids);
    if ( guids.length === 0 ) setuptools.app.mulequeue.state.paused = true;

};

//  return task on all or specified guids
setuptools.app.mulequeue.task.resume = function(guids) {

    //  parse guids
    if ( !guids ) guids = [];
    guids = setuptools.app.mulequeue.task.guidsCheck(guids);
    if ( guids.length === 0 ) setuptools.app.mulequeue.state.paused = false;

};

//  cancel task on all or specified guids
setuptools.app.mulequeue.task.cancel = function(guids) {

    //  parse guids
    if ( !guids ) guids = [];
    guids = setuptools.app.mulequeue.task.guidsCheck(guids);
    if ( guids.length === 0 ) guids = setuptools.app.mulequeue.queue;
    window.techlog('MuleQueue/TaskCancel clearing ' + guids.length + ' tasks', 'force');

    //  cancel and remove all queued tasks
    for ( var i = (guids.length-1); i >= 0; i-- ) {

        var guid = guids[i];
        var task = setuptools.app.mulequeue.tasks[guid];
        if ( task.state === 'queue' ) {

            delete setuptools.app.mulequeue.tasks[guid];
            setuptools.app.mulequeue.queue.splice(setuptools.app.mulequeue.queue.indexOf(guid), 1);
            setuptools.app.mulequeue.queue.filter(function (item) {
                return item !== undefined
            }).join();

        }

    }

    setuptools.app.mulequeue.state.running = false;
    setuptools.app.mulequeue.state.active = false;
    setuptools.app.mulequeue.state.busy = 0;
    $('#mulequeue').removeClass('running');

};

//  reorder task position specified guids
setuptools.app.mulequeue.task.reorder = function(guids, callback) {

    if ( typeof guids === 'undefined' ) setuptools.lightbox.error('Argument "guids" is required.', 1000);

    //  parse guids
    guids = setuptools.app.mulequeue.task.guidsCheck(guids);

    if ( typeof callback === 'function' ) callback();

};
