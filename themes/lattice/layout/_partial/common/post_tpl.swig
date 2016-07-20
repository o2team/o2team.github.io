{% raw %}
<script id="J_postTpl" type="text/template">
    {{#data}}
    <article class="mod-post">
        <a href="{{ url }}">
            <div class="mod-post-cover">
                <img src="{{ cover }}" alt="{{ title }}" />
            </div>
            <div class="mod-post-info">
                <h3 class="mod-post-tit">{{ title }}</h3>
                <p class="mod-post-desc">{{ desc }}</p>
            </div>
        </a>
    </article>
    {{/data}}
</script>
{% endraw %}