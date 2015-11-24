{% if page.posts.length %}
<section class="recent-posts-wrap">
    <ul class="recent-posts">
        {% for post in page.posts %}
        {# Show year #}
        {% set year %}
        {% set post.year = date(post.date, 'YYYY') %}

        {% if post.year !== year %}
        <li class="recent-posts-hd">    
            {% set year = post.year %}
            <div class="recent-posts-title">
                <h2 class="archive-year motion-element" id="archive-year-{{ year }}"><i class="fa fa-calendar-check-o"></i> {{ year }}</h2>
            </div>
        </li>
        {% endif %}
        {# endshow #}
        <li>
            <article class="recent-post" itemscope itemtype="http://schema.org/Article">
                <header class="recent-post-header">
                    <h3 class="recent-post-title"><a href="{{ url_for(post.path) }}" itempro="name">{{ post.title }}</a></h3>
                    <time class="published" datetime="{{ date_xml(post.date) }}" itempro="datePublished">{{ date(post.date) }}</time>
                </header>
                <a href="{{ url_for(post.path) }}" class="image recent-post-cover"><img src="{{ post_img( post.cover|default(theme.post.cover) ) }}" alt="{{ post.title }}" /></a>
            </article>
        </li>
        {% endfor %}
    </ul>
</section>
{% endif %}
