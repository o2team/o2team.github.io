<section id="smSearch" class="slide-search">

<!-- Search -->
    <section>
        <form class="search search-form" method="get">
            <input type="text" name="query" placeholder="{{ __('menu.search') }}" />
        </form>
    </section>

<!-- Links -->
    <section>
		<h3>搜索结果</h3>
        <ul class="links" id="searchResults">Loading...</ul>
    </section>

</section>
{% raw %}
<script id="tplSearch" type="text/hogan-tpl">
    {{#items}}
    <li>
        <a href="{{ url }}" target="_blank">
            <h3>{{ title }}</h3>
            {{#desc}}
			<p>{{ desc }}</p>
			{{/desc}}
        </a>
    </li>
    {{/items}}
</script>
{% endraw %}
