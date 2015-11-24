<div class="archives-page-counter">
    {% set cheers %}
    {% set posts_length = site.posts.length %}
    {% if posts_length > 210 %} {% set cheers = 'excellent' %}
    {% elif posts_length > 130 %} {% set cheers = 'great' %}
    {% elif posts_length > 80 %} {% set cheers = 'good' %}
    {% elif posts_length > 50 %} {% set cheers = 'nice' %}
    {% elif posts_length > 30 %} {% set cheers = 'ok' %}
    {% else %}
    {% set cheers = 'um' %}
    {% endif %}
    {{ __('cheers.' + cheers) }}! {{ _p("counter.archive_posts", site.posts.length) }} {{ __('keep_on') }}
</div>
