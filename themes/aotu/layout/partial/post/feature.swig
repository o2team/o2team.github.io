<!-- Post -->
<article class="post" itemscope itemtype="http://schema.org/Article">
    <header class="post-header">
        <div class="post-title">
            <h2 itemprop="name headline"><a href="{{ url_for(post.path) }}" itemprop="url">{{ post.title }}</a></h2>
            <ul class="post-stats">
                {% if post.tags and post.tags.length %}
                {% for tag in post.tags %}
                <li><a href='{{ url_for(tag.path) }}' class='meta-tag' rel="tag">{{ tag.name }}</a></li>
                {% endfor %} 
                {% endif %}
                <li title="{{ __("post.word_count") }}"><span class="icon fa-font" itemprop="wordCount">{{ wordcount(post.content) }}</span></li>
                {% if theme.busuanzi %}
                <li id="busuanzi_container_page_pv" title="{{ __("post.pv") }}"><span class="icon fa-eye" id="busuanzi_value_page_pv">0</span></li>
                {% endif %}
            </ul>   
            {% if post.subtitle %}
            <p itemprop="description" class="post-desc">{{ post.subtitle }}</p>
            {% endif %}
        </div>
        <div class="post-meta">
            <time class="published" datetime="{{ date_xml(post.date) }}" itemprop="datePublished">{{ date(post.date) }}</time>
            <a target="_blank" href="https://github.com/{{ author.github_name }}" class="author"><span class="name">{{ author.nick|default(author.github_name) }}</span><img src="https://avatars.githubusercontent.com/{{ author.github_name }}?v=3&s=80" alt="{{ author.github_name }}" /></a>
        </div>
    </header>
    <a href="{{ url_for(post.path) }}" class="image featured post-cover" itemscope itemtype="http://schema.org/ImageObject" itemprop="url"><img itemprop="contentUrl" src="{{ post_img( post.cover|default(theme.post.cover) ) }}" alt="{{ post.title }}" /></a>
    <p itemprop="articleBody" class="post-excerpt">{{ post.excerpt }}</p>
    <footer class="post-footer">
        <ul class="actions">
            <li><a href="{{ url_for(post.path) }}" class="button big">{{ __('post.read_more') }}</a></li>
        </ul>
        <ul class="post-stats">
            {% if post.tags and post.tags.length %}
            {% for tag in post.tags %}
            <li><a href='{{ url_for(tag.path) }}' class='meta-tag' rel="tag">{{ tag.name }}</a></li>
            {% endfor %} 
            {% endif %}
            <li title="{{ __("post.word_count") }}"><span class="icon fa-font" itemprop="wordCount">{{ wordcount(post.content) }}</span></li>
            {% if theme.busuanzi %}
			<li id="busuanzi_container_page_pv" title="{{ __("post.pv") }}"><span class="icon fa-eye" id="busuanzi_value_page_pv">0</span></li>
        	{% endif %}
		</ul>
    </footer>
</article>
