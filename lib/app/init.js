const ELocalStorage = nodeRequire('./lib/app/ELocalStorage');
if ( setuptools.browser === 'electron' ) {

    setuptools.app.techlog('Electron/Init beginning', 'force');

    delete window.localStorage;
    window.localStorage = new ELocalStorage();
    localStorage = window.localStorage;

}
