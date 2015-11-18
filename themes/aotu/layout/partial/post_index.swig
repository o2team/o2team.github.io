<!-- Post -->
<article class="post" itemscope itemtype="http://schema.org/Article">
    <header class="post-header">
        <div class="title">
            <h2><a href="{{ url_for(post.path) }}" itemprop="name">{{ post.title }}</a></h2>
        </div>
        <div class="meta">
            <time class="published" datetime="{{ post.date }}">{{ time_tag(post.date) }}</time>
            <a href="#" class="author"><span class="name">Jane Doe</span><img src="images/avatar.jpg" alt="" /></a>
        </div>
    </header>
    <a href="#" class="image featured"><img src="images/pic01.jpg" alt="" /></a>
    <p>{{ post.excerpt }}</p>
    <footer>
        <ul class="actions">
            <li><a href="{{ url_for(post.path) }}" class="button big">{{ theme.excerpt_link }}</a></li>
        </ul>
        <ul class="stats">
            {% if post.tags and post.tags.length %}
            {% for tag in post.tags %}
                <li><a href='{{ url_for(tag.path) }}' class='pure-button pull-right' style='margin:3px;'>{{ tag.name }}</a></li>
            {% endfor %} 
            {% endif %}
        </ul>
    </footer>
</article>
