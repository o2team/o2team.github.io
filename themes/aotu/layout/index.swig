{% extends '_layout.swig' %}

{% block page_class %}page-index{% endblock %}

{% block main %}
<div id="main" class="main">

{% include 'partial/index/feature_posts.swig' %}	

{% include 'partial/pagination.swig' %}

</div>

<section id="sidebar" class="sidebar">
	
    {% include 'partial/index/intro.swig' %}	
	
    {% include 'partial/index/mini_posts.swig' %}	

    {% include 'partial/index/recent_posts.swig' %}

    {% include 'partial/index/about.swig' %}

    {% include 'partial/footer.swig' %}
</section>
{% endblock %}
