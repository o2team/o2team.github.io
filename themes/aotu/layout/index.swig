{% extends '_layout.swig' %}

{% block main %}
<div id="main" class="main">

{% for post in page.posts %}
{% if loop.index <=3 %}
{% set author = post.author|default({github_name:config.github.user, nick:config.author}) %}
{{ partial('partial/index/post', {post: post, author: author}) }}
{% endif %}
{% endfor %}

{% include 'partial/pagination.swig' %}

</div>

<section id="sidebar" class="sidebar">
	<!-- Intro -->
	<section id="intro" class="intro">
		<a href="{{ url_for('') }}" class="intro-logo"><img src="{{ url_for(config.logo|default('img/logo.png')) }}" alt="{{ config.title }}" /></a>
		<header class="intro-header">
			<h1 class="intro-title">{{ __('menu.aotu_labs') }}</h1>
			<p class="intro-subtitle">
			"
			{% if theme.daily_words %}
			{% set cnt = site.data.words.length %}
			{% set pick = Math.floor(Math.random()*cnt) %}
			{{ site.data.words[pick].en }}
			{% else %}
			{{ config.slogan }}
			{% endif %}
			"
			</p>
		</header>
	</section>
	<!-- /Intro -->
	
	<!-- Mini Post -->
    {% if page.posts.length > 3 %}
	<section class="mini-posts-wrap">
		<div class="mini-posts">
		{% for post in page.posts %}
		{% if loop.index > 3 %}
		{% set author = post.author|default({github_name:config.github.user, nick:config.author}) %}
		{{ partial('partial/index/post_mini', {post:post, author:author}) }}
		{% endif %}	
		{% endfor%}	
		</div>
	</section>
	{% endif %}
	<!-- /Mini Post-->

    <!-- Recent Posts -->
    {% include 'partial/index/recent_posts.swig' %}
    <!-- /Recent Posts -->

    <!-- About -->
    {% include 'partial/index/about.swig' %}

	<!-- Footer -->
    {{ partial('partial/footer') }}
	<!-- /Footer -->
</section>
{% endblock %}
