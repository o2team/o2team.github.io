{% extends '_layout.swig' %}
{% block title %}
  {% set page_title_suffix = ' | ' + config.title %}
  {% if page.type === "cates" %}
    {{ __('menu.cates') + page_title_suffix }}
  {% elif page.type === "tags" %}
    {{ __('menu.tags') + page_title_suffix }}
  {% else %}
    {{ page.title + page_title_suffix }}
  {% endif %}
{% endblock %}

{% block main %}
  {% if page.type === "join" %}
      {% include '_partial/index/join.swig' %}
  {% endif %}


  {% if page.type === "about" %}
      {% include '_partial/about/main.swig' %}
  {% endif %}
{% endblock %}


