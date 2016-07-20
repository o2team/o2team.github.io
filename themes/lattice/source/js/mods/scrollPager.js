/* global App */
'use strict';
(function($){

    if(!App.pager) return;

    var pager = {
        getBaseUrl: function() {
            var base = '';
            if(App.isHome) {
                base = App.pager.dirIndex + '/';
            } else if (App.isCate) {
                base = App.pager.dirCate + '/';
            } else if (App.isTag) {
                base = App.pager.dirTag + '/';
            }

            base = App.root + App.pager.dir + '/' + base;
            return base;
        },
        getOffset: function() {
            var $sidebar = $('#sidebar');
            var sidebarInFooter = $sidebar.css('float') === 'none';
            var off = $('#footer').outerHeight(true) + 50;
            if(sidebarInFooter) {
                off += $sidebar.outerHeight(true);
            }
            return off;
        },
        init: function() {
            var base = this.getBaseUrl();
            var offset = this.getOffset();
            var $spinner = $('#spinnerPager');
            var $posts = $('#posts');
            $(window).scrollPager({
                heightOffset: offset,
                url: function(pagerData) {
                    return (base + pagerData.p +'/');
                },
                showLoading: function () {
                    $spinner.addClass('active');
                },
                hideLoading: function () {
                    $spinner.removeClass('active')
                },
                afterLoad: function (isOK, data) {
                    $posts.append(data);
                },
                pageData: {
                    p: 1,
                    ps: App.pager.size,
                    total: App.pager.total
                },
                ajaxOpts: {
                    cache: false,
                    type: 'GET',
                    contentType: false,
                    dataType: 'html',
                    stringifyData: false
                }
            }); 
        }
    };

    
    pager.init();
    

})(jQuery);