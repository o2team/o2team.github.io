{% set cates = site.data['categories'] %}
{% set catesLength = cates.length + 1 %}
<div class="posts-wrap">
    <nav class="cates">
      <ul>{{ cate_menu('cate-menu') }}</ul>
    </nav>
    <div class="posts" id="posts">
      {% for post in page.posts %}
        {% if not post.draft %}
          {% set author = post.author|default({github_name:config.github.user, nick:config.author}) %}
          {% include '../post/mini.swig' with {post:post, author:author} %}
        {% endif %}
      {% endfor%}
    </div>
    {% include '../common/pagination.swig' %}
</div>
