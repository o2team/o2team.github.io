{% extends '_layout.swig' %}

{% block page_class %}page-about{% endblock %}

{% block main %}
    {% include '_partial/about/main.swig' %}
{% endblock %}
   
{% block pagejs %}
{{ js('js/about') }}
{% endblock %}

