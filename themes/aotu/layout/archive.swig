{% extends '_layout.swig' %}

{% block title %} {{ __('menu.archive') }} | {{ config.title }} {% endblock %}
{% block page_class %} page-archive {% endblock %}

{% block main %}
<div id="main" class="main">
    {% include 'partial/archive/cheers.swig' %}	
    <div class="box box-white archives">
        {% include 'partial/archive/mini_posts.swig' %}	
    </div>
    {% include 'partial/pagination.swig' %}
</div>

<section id="sidebar" class="sidebar">
	
    {% include 'partial/index/intro.swig' %}	

    {% include 'partial/index/about.swig' %}

    {% include 'partial/footer.swig' %}
</section>
{% endblock %}
