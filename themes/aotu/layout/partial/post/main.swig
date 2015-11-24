<!-- Post -->
<article class="post" itemscope itemtype="http://schema.org/Article">
    <header class="post-header">
        <div class="post-title">
            <h2><a href="{{ url_for(post.path) }}" itemprop="name">{{ post.title }}</a></h2>
            <ul class="post-stats">
                {% if post.tags and post.tags.length %}
                {% for tag in post.tags %}
                <li><a href='{{ url_for(tag.path) }}' class='meta-tag'>{{ tag.name }}</a></li>
                {% endfor %} 
                {% endif %}
                <li title="{{ __("post.word_count") }}"><span class="icon fa-font">{{ wordcount(post.content) }}</span></li>
                {% if theme.busuanzi %}
                <li id="busuanzi_container_page_pv" title="{{ __("post.pv") }}"><span class="icon fa-eye" id="busuanzi_value_page_pv"></span></li>
                {% endif %}
                {% if page.comments and theme.duoshuo.shortname %}
                <li>
                    <a href="{{ url_for(post.path) }}#comments" itemprop="discussionUrl" class="lnk-comments">
                        <span class="post-comments-count ds-thread-count icon fa-comments" data-thread-key="{{ post.path }}" itemprop="commentsCount">0</span>
                    </a>
                </li>
                {% endif %} 
            </ul>
            {% if post.subtitle %}
            <p>{{ post.subtitle }}</p>
            {% endif %}
        </div>
        <div class="post-meta">
            <time class="published" datetime="{{ date_xml(post.date) }}" itempro="datePublished">{{ date(post.date) }}</time>
            <a target="_blank" href="https://github.com/{{ author.github_name }}" class="author"><span class="name">{{ author.nick|default(author.github_name) }}</span><img src="https://avatars.githubusercontent.com/{{ author.github_name }}?v=3&s=80" alt="{{ author.github_name }}" /></a>
        </div>
    </header>
    <a href="{{ url_for(post.path) }}" class="image featured post-cover"><img src="{{ post_img( post.cover|default(theme.post.cover) ) }}" alt="{{ post.title }}" /></a>
    <div class="post-content" itemprop="articleBody" data-swiftype-index="true">
        {{ page_anchor(post.content) }}
    </div>
    <div class="post-revision">
        <i class="fa fa-clock-o"></i> <time class="post-updated" datetime="{{ date_xml(post.updated) }}" itemprop="dateModified">{{ __('post.last_updated', full_date(post.updated)) }}</time>
    </div>
    {% include 'prevnext.swig' %}
    {{ partial('partial/comment') }}
</article>
