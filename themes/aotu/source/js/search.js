(function($){
    var $body = $('body'),
        term = "",
        isSearching = false,
        xhr,
        idx,
		store,
        $form = $('.search-form').on('submit',function(e){
            var $input = $(this).find('input');
            $input.removeClass('error');
            term = $input.val();
            if(term === ''){
                $input.addClass('error');    
                return false;
            }

            doSearch(term);
            return false;
        }),
        $panel = $('#smSearch'),
        $panelInput = $panel.find('input'),
        $panelForm = $panel.find('form'),
        $panelTip = $('#searchResults');
    $panel
        .panel({
            delay: 500,
            hideOnClick: true,
            hideOnSwipe: true,
            resetScroll: true,
            resetForms: true,
            side: 'right',
            target: $body,
            visibleClass: 'is-search-visible'
        });
    
    var doSearch = function(term){
        if(isSearching){
            xhr.abort();
            xhr = null;
            isSearching = false;
        }    
        isSearching = true;
        showUI(term);

        if(idx){
            isSearching = false;
            onIndexed(term);
            return;
        }

        xhr = $.ajax('/assets/lunr/all.json',{
            dataType:'json'
        }).done(function(data, txtStatus, jqXHR){
            idx = lunr.Index.load(data.index);
            store = data.store;
			onIndexed(term);
        }).error(function(jqXHR, txtStatus, err){
            showTip("服务器错误：" + err.message||err);
        }).always(function(dataOrXHR, txtStatus, errOrXHR){
            isSearching = false;
        });  

    },
    onIndexed = function(term){
        var res = idx.search(term);
        $panel.removeClass('no-res'); 
        if(res.length === 0){
            $panel.addClass('no-res');
            showTip('无相关结果!');
            return;
        }
		//get results from store
		var res1 = {items:[]},
			len = res.length,
			item;
		for(var i=0; i<len; i++){
			item = store[res[i].ref];
			item.url = item.url.replace(App.root,'/');
			res1.items.push(item);
		}
		xhogan.render({
			target:"#searchResults",
			tpl:"#tplSearch",
			data:res1,
			extraTplData:null,
			tplVersion:"2",
			dataVersion:"2",
			appendToTarget:false,
			cbk:function(err,html,tpl,data){
				
			}
		});

    };
    var showUI = function(term){
        $body.addClass('is-search-visible'); 
        $panelInput.val(term);
    },hideUI = function(){
        $panelForm.reset();
        $body.removeClass('is-search-visible');
    },showTip = function(tip){
        $panelTip.html(tip);
    };

})(jQuery);
