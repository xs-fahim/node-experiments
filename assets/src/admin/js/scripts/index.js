const { doAction } = wp.hooks;

/** draggable Sidebar */
function draggableSidebar() {
    let el = jQuery('.interface-interface-skeleton__sidebar');
    el.prepend("<div class='xs-draggable'></div>");

    jQuery('.xs-draggable').mousedown(function (e) {
        e.preventDefault();
        jQuery(document).mousemove(function (e) {
            jQuery('#position').html(e.pageX + ', ' + e.pageY);
            el.find('.edit-post-sidebar').css("width", jQuery(window).width() - (e.pageX + 2));
        })
    });

    jQuery(document).mouseup(function (e) {
        jQuery(document).unbind('mousemove');
    });
}


(function (window) {

    jQuery(window).load(function ($) {
        var link_html = '<div id="xs-custom-toolbar" class="getgenie">';

        let intervalCount = 0;
        let blockLoadedInterval = setInterval(function () {
            intervalCount++;
            if (jQuery('.edit-post-header__toolbar').length === 1) {
                /** inserting a id in the toolbar to initiate react component */
                if (wp.data.select('core/editor').getCurrentPostType() === 'post') {
                    jQuery('.edit-post-header__toolbar').append(link_html);
                }
                doAction('genieai_after_render_toolbar', 'xs');
                /** clearing interval */
                clearInterval(blockLoadedInterval);
            }
            if (intervalCount >= 30) {
                clearInterval(blockLoadedInterval);
            }
        }, 500)


        /** add template list screen button */

        let adminbarInterval = 0;
        let adminbarLoadedInterval = setInterval(function () {
            adminbarInterval++;
            if (jQuery('#wp-admin-bar-getgenie-template-list').length === 1) {
                
                /** inserting a id in the toolbar to initiate react component */
                // if (wp.data.select('core/editor').getCurrentPostType() === 'post') {
                //     jQuery('.edit-post-header__toolbar').append(link_html);
                // }
                doAction('getgenie_adminbar_menu', 'xs');

                /** clearing interval */
                clearInterval(adminbarLoadedInterval);
            }
            if (adminbarInterval >= 30) {
                clearInterval(adminbarLoadedInterval);
            }
        }, 500)



        if (!jQuery("#getgenie-container").length) {
            jQuery('body').append('<div id="getgenie-container" class="getgenie getgenie-main-container"></div>');
        };
        doAction('genieai_after_render_app', 'xs')

        // for template script
        if (!jQuery("#getgenie-template-container").length) {
            jQuery('body').append('<div id="getgenie-template-container" class="getgenie getgenie-main-container"></div>');
        };
        doAction('genieai_after_render_app_template', 'xs')

        /** sidebar draggable */
        draggableSidebar();

        /**
         * GetGenie Active sub menu item
         */
        jQuery.fn.menu_current = function () {
            this.addClass('current').siblings().removeClass('current');
        };
        let $toplevel_page = jQuery('.toplevel_page_getgenie.wp-menu-open');
        $toplevel_page
            .addClass('wp-has-current-submenu wp-menu-open').removeClass('wp-not-current-submenu')
            .find('a.menu-top')
            .addClass('wp-has-current-submenu wp-menu-open').removeClass('wp-not-current-submenu')
            .next().find('li')
            .each(function (key, val) {
                const { hash, search } = window.location;
                let menu_link = jQuery(val).children('a').attr('href'); /** eslint-disable-line */

                if (hash === '' && search.includes('?page=getgenie')) {
                    $toplevel_page.find('ul > li.wp-first-item').menu_current();
                    return false;
                } else if (menu_link && menu_link.includes(hash)) {
                    jQuery(val).menu_current();
                }
            })
            .on('click', function () {
                jQuery(this).menu_current();
            });

        setInterval(async() => {

            const response = await fetch(window.getGenie.config?.authTokenLeaserApi+'&_wpnonce='+window.getGenie.config.restNonce)
                .catch(err => {
                    //
                });

            if (!response) {
                return
            }

            if (response.ok) {
                try {
                    const res = await response.json();
                    window.getGenie.config.authToken = res;
                }
                catch (e) {
                    //
                }
            }
        }, (180*1000))
    })
})(window)




