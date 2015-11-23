{% extends '_layout.swig' %}

{% block title %} {{ __('menu.tags') }}: {{ page.tag }} | {{ config.title }} {% endblock %} 
{% block page_class %} page-tag {% endblock %}

{% block main %}
<div id="main" class="main">
    <div class="header-page">
        <h2 >"{{ page.tag }}" <small>{{  __('menu.tags')  }}</small></h2>
    </div>
    <div class="box box-white archives archives-by-tag">
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
