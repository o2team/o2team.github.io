<!-- Mini Post -->
{% if page.posts.length > 3 %}
<section class="mini-posts-wrap">
    <div class="mini-posts">
    {% for post in page.posts %}
    {% if loop.index > 3 %}
    {% set author = post.author|default({github_name:config.github.user, nick:config.author}) %}
    {% include '../post/mini.swig' with {post:post, author:author} %}
    {% endif %}	
    {% endfor%}	
    </div>
    {% include '../../partial/pagination.swig' %}
</section>
{% endif %}
<!-- /Mini Post-->
