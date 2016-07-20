<!-- Post -->
<article class="post">
    <header class="post-hd">
        {{seachData()}}
        <h2 class="post-tit">{{ post.title }}</h2>
        <div class="post-meta">
            by <a target="_blank" href="https://github.com/{{ author.github_name }}" class="post-author">{{ author.nick|default(author.github_name) }}</a> on <span>{{ date(post.date) }}</span>
        </div>
        {% if post.subtitle %}
        <p class="post-subtit" style="display:none;"><i class="fa fa-quote-left"></i>{{ post.subtitle }}</p>
        {% endif %}
        <span style="display:none;" id="busuanzi_value_page_pv"></span>
    </header>

    <div class="post-cover"><img src="{{ post_img( post.cover|default(theme.post.cover) ) }}" alt="{{ post.title }}" /></div>
    
    <div class="post-content">
        {{ page_anchor(post.content) }}

        {% if post.coeditor %}
        <div class="post-announce">感谢您的阅读，本文由 <a href="{{ post.coeditor.url }}">{{ post.coeditor.name }}</a> 原创提供。如若转载，请注明出处：凹凸实验室（<a href="{{ url_for(post.path) }}">https://aotu.io{{ url_for(post.path) }}</a>）</div> 
        {% else %}
        <div class="post-announce">感谢您的阅读，本文由 <a href="//aotu.io">凹凸实验室</a> 版权所有。如若转载，请注明出处：凹凸实验室（<a href="{{ url_for(post.path) }}">https://aotu.io{{ url_for(post.path) }}</a>）</div> 
        {% endif %}
        <div class="post-revision">
            <i class="fa fa-clock-o"></i> <time class="post-updated" datetime="{{ date_xml(post.updated) }}">{{ __('post.last_updated', full_date(post.updated)) }}</time>
         </div>

    </div>

    {% include 'prevnext.swig' %}
    {% include '../common/comment.swig' %}
</article>