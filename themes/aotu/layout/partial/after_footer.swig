<!-- Scripts -->
<!-- build:js js/dist.main.js -->
{{ js('js/jquery') }}
{{ js('js/hammer') }}
{{ js('assets/bootstrap/js/bootstrap') }}
{{ js('js/lang_select') }}
{{ js('js/toc') }}
{{ js('js/mobile_nav') }}
{{ js('js/skel') }}
{{ js('js/util') }}
{{ js('js/main') }}
<!-- endbuild -->
{% if page.layout === 'plugins' %}
<!-- build:js js/dist.plugins.js -->
{{ js('js/lunr') }}
{{ js('js/plugins') }}
<!-- endbuild -->
{% endif %}
