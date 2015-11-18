{% block main %}
<div id="main" class="main">

{% for post in page.posts %}
{{ partial('partial/post_index', {post: post}) }}
{% endfor %}

</div>

{% endblock %}
