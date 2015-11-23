<!-- Scripts -->
<!-- build:js js/dist.main.js -->
{{ js('js/debounce') }}
{{ js('js/jquery') }}
{% if theme.fancybox %}
{{ js('assets/fancybox/jquery.fancybox') }}
{{ js('js/fancybox') }}
{% endif %}
{% if page.comments and theme.duoshuo.shortname and theme.duoshuo.ua_enable %}
{{ js('js/ua-parser.min') }}
{{ js('js/duoshuo') }}
{% endif %}
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

{% if theme.busuanzi %}
<!--busuanzi-->
<script async src="//dn-lbstatics.qbox.me/busuanzi/2.3/busuanzi.pure.mini.js"></script>
{% endif %}
