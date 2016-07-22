<article class="mod-post" itemscope itemtype="http://schema.org/Article">
    <a href="{{ url_for(post.path) }}" itemprop="url" title="{{ post.title }}">
        <div class="mod-post-cover" itemscope itemtype="http://schema.org/ImageObject">
            <img src="{{ post.cover }}" alt="{{ post.title }}" itemprop="contentUrl"/>
        </div>
        <div class="mod-post-info">
            <h3 class="mod-post-tit" itemprop="name headline">{{ post.title }}</h3>
            <p class="mod-post-desc" itemprop="about">{{ post.subtitle }}</p>
        </div>
    </a>
</article>