<link rel="dns-prefetch" href="//storage.360buyimg.com" />
<link rel="dns-prefetch" href="//img10.360buyimg.com" />
<link rel="dns-prefetch" href="//img11.360buyimg.com" />
<link rel="dns-prefetch" href="//img12.360buyimg.com" />
<link rel="dns-prefetch" href="//img13.360buyimg.com" />
<link rel="dns-prefetch" href="//img14.360buyimg.com" />
<link rel="dns-prefetch" href="//img20.360buyimg.com" />
<link rel="dns-prefetch" href="//img30.360buyimg.com" />
<link rel="dns-prefetch" href="//misc.aotu.io" />

{% if is_home() %}
{% set arr = num_toArray(page.total) %}
{% for p in arr %}
    {% if p > 1 %}
    <link rel="prefetch" href="{{ url_for(config.fragments_generator.dir + '/' + config.fragments_generator.index_dir + '/' + p + '/') }}" />
    {% endif %}
{% endfor %}
{% endif %}

{% if is_category() %}
{% set arr = num_toArray(page.total) %}
{% for p in arr %}
    {% if p > 1 %}
    <link rel="prefetch" href="{{ url_for(config.fragments_generator.dir + '/' + config.category_dir + '/' + page.category + '/' + p + '/') }}" />
    {% endif %}
{% endfor %}
{% endif %}

{% if is_tag() %}
{% set arr = num_toArray(page.total) %}
{% for p in arr %}
    {% if p > 1 %}
    <link rel="prefetch" href="{{ url_for(config.fragments_generator.dir + '/' + config.tag_dir + '/' + page.tag + '/' + p + '/') }}" />
    {% endif %}
{% endfor %}
{% endif %}