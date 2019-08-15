/**
 * @class
 * @type {Electron}
 */

const electron = require('electron');
const fs = require('fs');
let compress = false;
let debugging = false;
let pretty = true;
let limited = false;
let hard = false;
let string;
let path;

/**
 * @classdesc localStorage-compatible replacement for Electron.
 *
 * Stores data in JSON files to user's PC.
 */
class ELocalStorage {

    constructor(opts) {

        this.reserved = Object.getOwnPropertyNames(this.__proto__).concat(['reserved', 'length', '__proto__']);
        if ( !(opts instanceof Object) ) opts = {};
        compress = opts.compress || compress;
        debugging = opts.debugging || debugging;
        hard = opts.hard || hard;
        limited = opts.limited || limited;
        pretty = opts.pretty || true;
        path = ( opts.path ) ? opts.path + '/ELocalStorage' : ((electron.app || electron.remote.app).getPath('userData') + "/ELocalStorage");
        string = opts.string;
        this.length = 0;
        if ( !fs.existsSync(path) ) fs.mkdirSync(path);
        this.importLocal(string);

    }

    /**
     * @function
     * @param {string} [string] - String or regex pattern to import only matching files
     * @description Imports all storage keys from local files into memory
     */
    importLocal(string) {

        let self = this;
        if ( string ) string = this.keySanity(string);  //  since filenames will be encoded
        fs.readdirSync(path).forEach(function(file) {

            if (
                typeof file !== 'string' ||
                file.match(/.json$/) === null ||
                (typeof string === 'string' && file.match(string) === null)
            ) return;
            try {
                self[self.keySanity(file.replace('.json', ''))] = fs.readFileSync(path + '/' + file).toString();
            } catch(e) {
                console.log('Read error: ' + path + '/' + file + ' ', e);
                return;
            }

            self.length++;

        });

    }

    /**
     * @function
     * @param {string} key - Key to process for sanity and encoding
     * @returns {string} - Returns the reserve encoded format of the inputted key.
     *
     * If key is provided with filesystem-reserved characters, it will be encoded; otherwise, it will be decoded.
     * @description Validates the contents of the provided key.
     */
    keySanity(key) {

        if (
            typeof key === 'string' &&
            this.reserved.indexOf(key) === -1 &&
            key.match(/^([a-zA-Z0-9-_:@\.]*?)$/) !== null
        ) return ( key.indexOf(':') > -1 ) ?
            key.replace(/:/g, '----') :
            key.replace(/----/g, ':');
        throw new Error('Invalid storage key provided: ' + key);

    }

    /**
     * @function
     * @param {string} key - Storage key to read
     * @returns {string | undefined} - Returns the key contents or undefined
     * @description Reads the contents of the specified key from memory or from disk
     */
    getItem(key) {

        this.keySanity(key);

        if ( this[key] ) {
            if ( debugging === true ) console.log('Reading: ' + key + ' from: memory');
            let result;
            try {
                result = JSON.parse(this[key])
            } catch(e) {
                delete this[key];
            }
            if ( result ) return result;
        }

        if ( debugging === true ) console.log('Reading: ' + key + ' from: file (' + path + '/' + this.keySanity(key) + '.json)');

        let data;
        try {
            data = JSON.parse(fs.readFileSync(path + '/' + this.keySanity(key) + '.json'));
        } catch(e) {}

        if ( !data ) return;
        if ( !this[key] ) this.length++;
        this[key] = data;
        return data;

    }

    /**
     * @function
     * @param {string} key - Storage key name
     * @param val - Value to store
     * @returns {boolean}
     * @description Stores a JSON-encoded object of the input value to a file on-disk
     */
    setItem(key, val) {

        this.keySanity(key);
        let data = JSON.stringify(val, null, ( (pretty === true) ? 5 : undefined ));

        if ( debugging === true ) console.log('Writing: ' + key + ' to: file (' + path + '/' + this.keySanity(key) + '.json)');
        try {
            fs.writeFileSync(path + '/' + this.keySanity(key) + '.json', data);
        } catch(e) {
            if ( debugging === true ) console.log('Write error: ' + key + ' on: file (' + path + '/' + this.keySanity(key) + '.json' + ') ', e);
            return false;
        }

        if ( debugging === true ) console.log('Writing: ' + key + ' to: memory');
        if ( !this[key] ) this.length++;
        this[key] = data;
        return true;

    }

    /**
     * @function
     * @param {string} key - Storage key name
     * @returns {boolean}
     * @description Deletes the specified storage key from storage and memory
     */
    removeItem(key) {

        this.keySanity(key);

        if ( fs.existsSync(path + '/' + this.keySanity(key) + '.json') ) {

            if ( debugging === true ) console.log('Deleting: ' + key + ' from: file (' + path + '/' + this.keySanity(key) + '.json' + ')');
            try {
                fs.unlinkSync(path + '/' + this.keySanity(key) + '.json');
            } catch(e) {
                if ( debugging === true ) console.log('Delete error: ' + key + ' on: file (' + path + '/' + this.keySanity(key) + '.json' + ') ', e);
                return false;
            }

            this.length--;
            return true;

        } else if ( debugging === true ) console.log('Key not found: ' + key);
        return false;

    }

}

// expose the class
module.exports = ELocalStorage;
