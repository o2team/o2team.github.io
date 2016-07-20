(function($){


    var SearchResult = {

        config: {
            minScore: 1e-5,
            minNum: 3 
        },

        init: function() {
            this.$wrap = $('#J_searchResultWrap');
            this.$contaner = $('#J_searchResult');
            this.$tips = $('#J_searchResultTips');
            this.$loading = $('#J_searchResultLoading');
            this.tpl = Hogan.compile($('#J_postTpl').html());
            this.tipsTpl = Hogan.compile($('#J_searchResultTipsTpl').html());
            this.queryString = Util.getParam('query');
            if (!this.queryString) {
                return;
            }
            this.getData();  
        },

        getData: function() {
            var self = this;
            this.$loading.addClass('active');
            $.ajax({
                url: '/assets/lunr/all.json',
                dataType: 'json'
            }).done(function(data){
                self.initSearch(data);
            });
        },

        initSearch: function (data) {
            this.index = lunr.Index.load(data.index);
            this.sourceData = data.store;
            this.result = this.index.search(this.queryString);
            this.filteredData = this.filterSourceData();
            this.render();
        },

        render: function() {
            var filteredData = this.filteredData,
                html;

            if (!filteredData.length) {
                html = "抱歉，您要的内容似乎没有哦，不如换个关键字试试吧。";
            } else {
                html = this.tpl.render({data: this.filteredData, coversrc: function(){
                    var cover = this.cover;
                    return cover;
                }});
            }
            this.$contaner.append(html);
            this.$tips.append(this.tipsTpl.render({query: this.queryString, count: filteredData.length}));
            this.$loading.removeClass('active');
            this.$wrap.show();
        },

        filterSourceData: function() {
            var self = this,
                filteredData = [],
                minNum = self.config.minNum;
                
            this.result.forEach(function(row, idx){
                if (self.config.minScore > row.score && idx >= self.config.minScore.minNum) {
                    return;
                }
                filteredData.push(self.sourceData[row.ref])
            });
            return filteredData;
        }

    }

    SearchResult.init();

})(jQuery);

