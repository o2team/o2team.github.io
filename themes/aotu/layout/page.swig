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

<div id="main" class="main">
    <div class="box box-white box-page">    
    {# tagcloud page support #}
    {% if page.type === "tags" %}
      <div class="tag-cloud">
        <div class="tag-cloud-title">
            {{ _p('counter.tag_cloud', site.tags.length) }}
        </div>
        <div class="tag-cloud-items">
          {{ tagcloud({min_font: 12, max_font: 30, amount: 200, color: true, start_color: '#ccc', end_color: '#111'}) }}
        </div>
      </div>
    {% elif page.type === 'categories' %}
      <div class="cates-wrap">
        <div class="cates-title">
            {{ _p('counter.categories', site.categories.length) }}
        </div>
        <div class="cates">
          {{ list_categories() }}
        </div>
      </div>
    {% else %}
      {{ page.content }}
    {% endif %}
    {{ partial('partial/comment') }}
    </div>
</div>

<section id="sidebar" class="sidebar">
	
    {% include 'partial/index/intro.swig' %}	
    {% if not page.hideAbout %}
    {% include 'partial/index/about.swig' %}
    {% endif %}
    {% include 'partial/footer.swig' %}
</section>

{% endblock %}


