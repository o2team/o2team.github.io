{% extends '_layout.swig' %}

{% block title %} {{ config.title }} {% endblock %}
{% block page_class %} page-search {% endblock %}

{% block main %}
    {% include '_partial/index/banner.swig' %}
    {% include '_partial/search/main.swig' %}
{% endblock %}

{% block footer %}
    {% parent %}
    {% include '_partial/common/post_tpl.swig' %}
{% endblock %}

{% block pagejs %} 
<!-- build:js /js/bundle/search.js -->
{{ js('js/libs/lunr') }}
{{ js('js/mods/search_result') }}
<!-- endbuild -->
{% endblock %}

