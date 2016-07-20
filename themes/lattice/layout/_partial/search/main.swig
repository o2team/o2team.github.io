<div class="mod-container">
    <div class="grid">    
        <div class="mod-main">
            <div id="J_searchResultLoading" class="spinner spinner-search">
                <div class="double-bounce double-bounce1"></div>
                <div class="double-bounce double-bounce2"></div>
            </div>
            <div class="search-result" id="J_searchResultWrap" style="display:none;">
                <h2 class="search-result-tit" id="J_searchResultTips"></h2>
                <div class="posts" id="J_searchResult"></div>
            </div> 
        </div>

        {% include '../common/sidebar.swig' %} 
    </div>
</div>
{% raw %}
<script id="J_searchResultTipsTpl" type="text/template">
    找到匹配<em>{{query}}</em>的结果<em>{{count}}</em>条:
</script>
{% endraw %}
