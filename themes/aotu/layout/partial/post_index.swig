<!-- Post -->
<article class="post" itemscope itemtype="http://schema.org/Article">
    <header class="post-header">
        <div class="post-title">
            <h2><a href="{{ url_for(post.path) }}" itemprop="name">{{ post.title }}</a></h2>
            {% if post.subtitle %}
            <p>{{ post.subtitle }}</p>
            {% endif %}
        </div>
        <div class="post-meta">
            <time class="published" datetime="{{ post.date }}">{{ date(post.date) }}</time>
            <a target="_blank" href="https://github.com/{{ author.github_name }}" class="author"><span class="name">{{ author.nick|default(author.github_name) }}</span><img src="https://avatars.githubusercontent.com/{{ author.github_name }}?v=3&s=80" alt="{{ author.github_name }}" /></a>
        </div>
    </header>
    <a href="{{ url_for(post.path) }}" class="image featured post-cover"><img src="{{ post_img( post.cover|default(theme.post.cover) ) }}" alt="{{ post.title }}" /></a>
    <p>{{ post.excerpt }}</p>
    <footer class="post-footer">
        <ul class="actions">
            <li><a href="{{ url_for(post.path) }}" class="button big">{{ theme.excerpt_link }}</a></li>
        </ul>
        <ul class="post-stats">
            {% if post.tags and post.tags.length %}
            {% for tag in post.tags %}
            <li><a href='{{ url_for(tag.path) }}' class='meta-tag'>{{ tag.name }}</a></li>
            {% endfor %} 
            {% endif %}
            <li title="{{ __("page.word_count") }}"><span class="icon fa-font">{{ wordcount(post.content) }}</span></li>
            {% if theme.busuanzi %}
			<li id="busuanzi_container_page_pv" title="{{ __("page.pv") }}"><span class="icon fa-eye" id="busuanzi_value_page_pv"></span></li>
        	{% endif %}
		</ul>
    </footer>
</article>
