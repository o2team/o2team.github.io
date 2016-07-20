{% extends '_layout.swig' %}

{% block page_class %}page-cate{% endblock %}

{% block main %}
    {% include '_partial/index/banner.swig' %}
    {% include '_partial/index/main.swig' %}
{% endblock %}

{% block footer %}
    {% parent %}
    {% include '_partial/common/post_tpl.swig' %}
{% endblock %}