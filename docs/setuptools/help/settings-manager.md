# Settings Manager

### Muledump Settings

#### ```Account Load Delay in Seconds```
Delay between account load times when contacting Deca servers.

#### ```Characters Displayed per Row```
The maximum numbers of characters to be displayed in on the webpage per row.

#### ```Display Errors```
Display error messages when encountered.

#### ```Enable One-click Login```
Whether or not to enable the support of muledump:// links.

#### ```Gift Chests Width```
Numbers of gift chests to display per row.

#### ```Page Search```
Format to display page search: Full width, shortened, or off.

#### ```Totals Width```
Number of items to display per row in totals. Whole screen automatically adjusts to current size of the browser window.

#### ```Use Smart Layout```
Whether or not to use Masonry to generate the page layout.

### SetupTools Settings

#### ```SetupTools Enabled```
Whether or not to utilize SetupTools features or fallback on the traditional accounts.js format.

Setting this to Automatic will determine the value based on number of enabled accounts.

Muledump Local only

#### ```Accounts Displayed per Page```
Number of accounts to display per page in UI managers.

#### ```Alert on New Version```
Whether or not to display a notice on a new version or patch release.

Muledump Online only

#### ```Animations```
Whether or not to display all animations, reduced animations, or minimal animations.

#### ```Auto Complete for Password Managers```
When disabled this prevents passwords managers from interfering with username and password fields.

Warning: This setting might get ignored by your browser making the setting useless.

#### ```Automatic Backups```
Automatically create daily backups of your configuration stored in browser local storage.

#### ```Debug Logging```
Whether or not to output the debug logs to the browser console.

#### ```Groups Manager Mode```
Which mode Groups Manager is running in. Possible modes are:

##### Off
Groups Manager configuration is not loaded.

##### On, Parallel
Groups Manager accounts are merged with their order preserved 

Example: [a, b, c] + [d, e, f] + [g, h, i] = [a, d, g, b, e, h, c, f, i]

##### On, Serial
Groups Manager accounts are merged with their order arranged by overall order 

Example: [a, b, c] + [d, e, f] + [g, h, i] = [a, b, c, d, e, f, g, h, i]

#### ```Longpress Length in Seconds```
Length of time that a long left click takes to activate.

#### ```Maximum Backups in Local Storage```
SetupTools stores backups in your browser's local storage. This utilizes disk space on your computer. This feature limits the maximum number of exposed backups to keep before auto-deleting the oldest.

#### ```Menu Position```
Position of the Muledump menu.

#### ```Prevent Auto Download```
When downloading data from SetupTools, this feature prevents you from accidentally downloading a backup of sensitive account information to your Downloads folder.

### Assistants Settings

#### ```Account Assistant```
Displays an assistant when account issues are detected (TOS, migration, age verification).

#### ```Backup Assistant```
Displays a reminder to download a backup if a certain period of time has gone by since last download.

#### ```CORS Assistant```
Displays an assistant to help resolve CORS problems when they are detected. 

### System Settings

#### ```Reset Muledump Options```
Erases current options and resets it to the default Muledump options.

#### ```Erase SetupTools```
Erases all SetupTools-specific configuration and restores Muledump to its original state.

#### ```Erase Cached Data```
Erases all cached account data for Muledump. Useful when account data appears to be bad.

#### ```Erase All Data```
Erases all Muledump data including SetupTools, options, accounts, groups, backups, etc.

#### ```Reset to Default Settings```
Restore all settings to the default SetupTools configuration.
