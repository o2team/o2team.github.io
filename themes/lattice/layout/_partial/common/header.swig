<div class="mod-hd">
    <div class="grid">
        <div class="mod-logo">
            <a href="{{ url_for('index.html') }}" title="{{ config.title }}">
                {{ config.title }}
            </a>
        </div>
        <span class="mod-hd-toggle" id="J_hdToggle"><i class="fa fa-bars"></i></span>
        <div class="mod-hd-main">
            <div class="mod-hd-inner"> 
                <nav class="mod-nav">
                    <ul class="mod-nav-list">
                        {{ header_menu('main-nav') }}
                    </ul>
                </nav>
                <div class="mod-search" id="J_search">
                    <a class="fa fa-search mod-search-ico" id="J_searchTrigger" title="{{ __('menu.search') }}"></a>
                    <form id="J_searchForm" method="get" class="mod-search-form" action="/search/">
                        <input type="text" name="query" class="mod-search-ipt" id="J_searchInput" placeholder="{{ __('menu.search') }}" />
                    </form>
                </div>
            </div> 
        </div>
    </div>
</div>
