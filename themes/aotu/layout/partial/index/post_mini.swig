<article class="mini-post" itemscope itemtype="http://schema.org/Article">
    <header class="mini-post-header">
        <h3><a href="{{ url_for(post.path) }}" itempro="name">{{ post.title }}</a></h3>
        <time class="published" datetime="{{ date_xml(post.date) }}" itempro="datePublished">{{ date(post.date) }}</time>
        <a href="https://github.com/{{ author.github_name }}" target="_blank" class="author"><img src="https://avatars.githubusercontent.com/{{ author.github_name }}?v=3&s=80" alt="{{ author.nick }}" /></a>
    </header>
    <a href="{{ url_for(post.path) }}" class="image"><img src="{{ post_img( post.cover|default(theme.post.cover) ) }}" alt="{{ post.title }}" /></a>
</article>
