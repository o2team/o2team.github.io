<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<meta name="author" content="{{ config.author }}" />
<meta name="designer" content="{{ config.author }}" />
<meta name="rating" content="general" /> 
<meta name="format-detection" content="telephone=yes" />
<meta name="robots" content="index, follow" />

{% if config.baiduce %}
<meta baidu-gxt-verify-token="{{ config.baiduce }}" />
{% endif%}

<!-- keywords -->
<meta name="keywords" content="{{ page_keywords(true) }}"/>
<!-- Canonical links -->
<link rel="canonical" href="{{ url }}">

<!-- Alternative links -->
{% if page.layout == 'page' or page.layout == 'index' %}
{% for lang in site.data.languages %}
<link rel="alternative" hreflang="{{ loop.key }}" href="{{ canonical_url(loop.key) }}">
{% endfor %}
{% endif %}

<!-- favicons -->
{% include 'favicons.swig' %}

<!--open.weibo.com-->
<meta property="wb:webmaster" content="a1686eb81db284d5" />

<!--wechat shares meta-->
{% if page.wechat %}
<meta name="wechat-logo" content="{{ page.wechat.share_cover | default(page.cover) }}">
<meta name="wechat-title" content="{{ page.wechat.share_title | default(page.title) }}">
<meta name="wechat-desc" content="{{ page.wechat.share_desc | default(page.subtitle) }}">
{% endif %}

<!-- Prefetch -->
{% include 'prefetch.swig' %}

<!-- CSS -->
{% if theme.gitalk %}
<link rel="stylesheet" href="https://unpkg.com/gitalk/dist/gitalk.css"/>
{% endif %}
{{ css('css/style') }}

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

<script>
    var App = {
        root:'{{ config.root }}',
        isHome: {{is_home()}},
        isCate: {{is_category()}},
        isTag: {{is_tag()}}  
    };
</script>

{% if page.wechat %}
<script>
    window.WechatShareData = {
        imgUrl: "{{ page.wechat.share_cover | default(page.cover) }}",
        link: window.location.href,
        title: "{{ page.wechat.share_title | default(page.title) }}",
        desc: "{{ page.wechat.share_desc | default(page.subtitle) }}"
    }
    window.WechatJSSDKURL = '{{ config.wechat.jssdk_url }}'
</script>
{% endif %}
