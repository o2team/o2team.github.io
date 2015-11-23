{% for post in page.posts %}
{% if loop.index <=3 %}
{% set author = post.author|default({github_name:config.github.user, nick:config.author}) %}
{% include '../post/feature.swig' with {post: post, author: author} %}
{% endif %}
{% endfor %}

