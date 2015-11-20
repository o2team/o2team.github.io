<!DOCTYPE html>
<html lang="{{ page.lang }}" class="theme-o2 {% block page_class %}{% endblock %}">
{{ partial('partial/head') }}
<body itemscope itemtype="http://schema.org/WebPage">
<div id="wrapper" class="root">
    {{ partial('partial/header') }}
    {{ partial('partial/slide_menu') }}
    {% block main %}{% endblock %}
    {{ partial('partial/after_footer') }}
</div>
</body>
</html>
