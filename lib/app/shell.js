const { shell } = require('electron');

function link_bind(links) {

    links.each(function(index, link) {
        $(link).on('click.shell.openExternal', function(e) {
            e.preventDefault();
            shell.openExternal($(this).attr('href'));
        });
    });

}

module.exports = {
    link_bind: link_bind
};
