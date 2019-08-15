const { link_bind } = nodeRequire('./lib/app/shell');

$(document).ready(function () {
    link_bind($('a'));
});
