{% if not is_index and (post.prev or post.next) %}
<div class="post-nav">
    {% if post.prev %}
    <div class="post-nav-next"><a href="{{ url_for(post.prev.path) }}" title="{{ post.prev.title }}">{{post.prev.title}} <i class="fa fa-chevron-right"></i></a></div>
    {% endif %}
    {% if post.next %}
    <div class="post-nav-prev"><a href="{{ url_for(post.next.path) }}" title="{{ post.next.title }}"><i class="fa fa-chevron-left"></i> {{post.next.title}}</a></div>
    {% endif %}
</div>
{% endif %}
