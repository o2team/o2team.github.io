<!-- keywords -->
<meta name="keywords" name="{{ page_keywords(true) }}"/>
<!-- Canonical links -->
<link rel="canonical" href="{{ url }}">
<!-- Alternative links -->
{% if page.layout == 'page' or page.layout == 'index' %}
{% for lang in site.data.languages %}
<link rel="alternative" hreflang="{{ loop.key }}" href="{{ canonical_url(loop.key) }}">
{% endfor %}
{% endif %}
<!-- Icon -->
<link rel="apple-touch-icon" sizes="57x57" href="{{ url_for('img/apple-touch-icon-57x57.png') }}">
<link rel="apple-touch-icon" sizes="114x114" href="{{ url_for('img/apple-touch-icon-114x114.png') }}">
<link rel="apple-touch-icon" sizes="72x72" href="{{ url_for('img/apple-touch-icon-72x72.png') }}">
<link rel="apple-touch-icon" sizes="144x144" href="{{ url_for('img/apple-touch-icon-144x144.png') }}">
<link rel="apple-touch-icon" sizes="60x60" href="{{ url_for('img/apple-touch-icon-60x60.png') }}">
<link rel="apple-touch-icon" sizes="120x120" href="{{ url_for('img/apple-touch-icon-120x120.png') }}">
<link rel="apple-touch-icon" sizes="76x76" href="{{ url_for('img/apple-touch-icon-76x76.png') }}">
<link rel="apple-touch-icon" sizes="152x152" href="{{ url_for('img/apple-touch-icon-152x152.png') }}">
<link rel="icon" type="image/png" href="{{ url_for('img/favicon-230x230.png') }}" sizes="230x230">
<link rel="icon" type="image/png" href="{{ url_for('img/favicon-96x96.png') }}" sizes="96x96">
<link rel="icon" type="image/png" href="{{ url_for('img/favicon-16x16.png') }}" sizes="16x16">
<link rel="icon" type="image/png" href="{{ url_for('img/favicon-32x32.png') }}" sizes="32x32">
<meta name="msapplication-TileColor" content="#2f83cd">
<meta name="msapplication-TileImage" content="{{ url_for('img/mstile-144x144.png') }}">
<!-- CSS -->
<!-- build:css css/dist.style.css -->
{{ css('css/o2') }}
<!-- endbuild -->
{% if theme.fancybox %}
{{ css('assets/fancybox/jquery.fancybox.css') }}
{% endif %}
<!-- RSS -->
{{ feed_tag('atom.xml') }}
<!-- Open Graph -->
{{ open_graph({
fb_admins: config.fb_admins,
twitter_site: config.twitter
}) }}
<!-- Baidu Analytics -->
{{ partial('baidu_analytics') }}
<script>
var App = {
    root:'{{ config.root }}'    
};
</script>
