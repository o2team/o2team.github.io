<section id="smSearch" class="slide-menu">

<!-- Search -->
    <section>
        <form class="search search-form" method="get">
            <input type="text" name="query" placeholder="{{ __('menu.search') }}" />
        </form>
    </section>

<!-- Links -->
    <section>
        <ul class="links" id="searchResults">Loading...</ul>
    </section>

</section>
{% raw %}
<script id="tplSearch" type="text/hogan-tpl">
    {{#items}}
    <li>
        <a href="{{ link }}">
            <h3>{{ name }}</h3>
            <p>{{ desc }}</p>
        </a>
    </li>
    {{/items}}
</script>
{% endraw %}
