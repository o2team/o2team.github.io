<!DOCTYPE html>
<html lang="{{ page.lang }}" class="theme-o2 {% block page_class %}{% endblock %}">
<head prefix="og: http://ogp.me/ns#">
	<meta charset="utf-8"/>
	<title>{% block title %}{% if page.title %}{{ page.title }} | {% endif %}{{ config.title }}{% endblock %}</title>
	<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1"/>
	<meta name="viewport" content="width=device-width, initial-scale=1"/>
  	<meta name="apple-touch-fullscreen" content="yes" />
	<meta name="apple-mobile-web-app-capable" content="yes"/>
	<meta name="apple-mobile-web-app-status-bar-style" content="black"/> 
    {{ partial('partial/head') }}
</head>
<body itemscope itemtype="http://schema.org/WebPage">
	<div id="wrapper" class="root">
		{% block header %}
		{{ partial('partial/header') }}
		{% endblock %}
		{% block main %}{% endblock %}
	</div>
    {% block slide_menu %}
    {{ partial('partial/slide_menu') }}
    {{ partial('partial/search_results') }}
    {% endblock %}
	{% block backTop %}
	<div class="back-to-top" id="backTop"><i class="fa fa-long-arrow-up"></i></div>
	{% endblock %}
    {% block after_footer %}
    {{ partial('partial/after_footer') }}
    {% endblock %}
</body>
</html>
