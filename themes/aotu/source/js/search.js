(function($){
    var term = "",
        isSearching = false,
        xhr,
        idx
        $form = $('.search-form').on('submit',function(e){
            var $input = $form.find('input');
            $input.removeClass('error');
            term = $input.val();
            if(term === ''){
                $input.addClass('error');    
                return false;
            }

            doSearch(term);

        }); 

    var doSearch = function(term){
        if(isSearching){
            xhr.abort();
            isSearching = false;
        }    
        isSearching = true;
        showUI();

        

    };

    var showUI = function(){
        
    };

})(jQuery);
