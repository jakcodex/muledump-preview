// accounts.js no longer required, open muledump.html and check out the first time setup tool

// editor with syntax highlighting is recommended (for example, notepad++ or textmate)

accounts = {

// Put your data here as shown below. Don't forget the commas and quotes!
// If your emails or passwords contain single quotes,
// escape them with backslashes (\) like this: 'pass\'word'


'email': 'pass',
'email2': 'pass2',


};// don't delete this line!


// how many characters are displayed in each row (within one account)
rowlength = 7;

// change to 1 to switch to testing
testing = 0;

// change to 1 to enable price display in tooltips
prices = 0;

// change to 1 to enable one-click login (run lib/mulelogin.au3 first)
mulelogin = 0;

// 0 = use smart layout (fill empty spaces)
// 1 = show account boxes row by row
nomasonry = 0;

//  seconds to delay between loading separate accounts (try to limit yourself to 6 requests per minute)
accountLoadDelay = 2;

//  whether or not to enable debug console logging
debugging = false;

//  if you have your own imgur client id then uncomment this line and add it here; this is not a required setting
//ImgurClientID = '';
