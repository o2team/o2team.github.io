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
