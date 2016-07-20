{% for post in page.posts %}
{% set author = post.author|default({github_name:config.github.user, nick:config.author}) %}
{% include '_partial/post/mini.swig' with {post:post, author:author} %}
{% endfor%}	