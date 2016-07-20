<!DOCTYPE html>
<html class="theme-lattice">
<head>
    <meta charset="utf-8"/>
    <title>{% block title %}{% if page.title %}{{ page.title }} | {% endif %}{{ config.title }}「{{ config.subtitle }}」{% endblock %}</title>
    {{partial('_partial/common/head')}}
</head>
<body class="{% block page_class %}{% endblock %}">
    {% block header %}
        {% include '_partial/common/header.swig' %}
    {% endblock %}

	{% block main %}{% endblock %}

    {% block backTop %}
       <div class="mod-backtop" id="backTop"><i class="fa fa-long-arrow-up"></i></div>
    {% endblock %}

    {% block footer %}
        {% include '_partial/common/footer.swig' %}
    {% endblock %}

    {% block pagejs %}{% endblock %}

    {% block after_footer %}
        {% include '_partial/common/after_footer.swig' %}
    {% endblock %}

    
</body>
</html>
