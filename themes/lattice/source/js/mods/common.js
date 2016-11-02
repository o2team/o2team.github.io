(function($){

  var $window = $(window);

  $('#J_hdToggle').on('click', function(e){
    $('.mod-hd-main').toggleClass('mod-hd-main-expand')
  });


  var $backTop = $('#backTop');
  $window.on('scroll.backtop', Util.debounce(function () {
      if ($window.scrollTop() > $window.height()) {
          $backTop.show();
      } else {
          $backTop.hide();
      }
  }));

  // scroll body to 0px on click
  $backTop.on('click',function () {
      $('body,html').animate({
          scrollTop: 0
      }, 500);
      return false;
  });


  var search = {
        init: function (){
            this.$el = $('#J_search');
            this.$form = $('#J_searchForm');
            this.$input = $('#J_searchInput');
            this.$trigger = $('#J_searchTrigger');
            this.bindEvent();
        },

        bindEvent: function (){
            var self = this;
            this.$form.on('submit', function(e){
                var val = $.trim(self.$input.val());
                if (!val) { e.preventDefault(); }
            });

            this.$trigger.on('click', function(e){
                var $this = $(this),
                    isShowed = $(this).data('show');
                if (!isShowed) {
                    self.$input.focus();
                }
                self.$form.toggleClass('show');
                self.$el.toggleClass('active');
                $this.data('show', !isShowed);
            });
        }
    };

    search.init();


    function handleLayoutParam(){
      var layoutParam = Util.getParam('o2layout') || '',
          clsArr = layoutParam.split('-');
      if(!clsArr.length ){ return; }
      $('body').addClass(clsArr.join(' '));
    }
    handleLayoutParam();
 

})(jQuery);