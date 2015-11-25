<!-- Scripts -->
<!-- build:js js/dist.main.js -->
{{ js('js/lunr') }}
{{ js('js/debounce') }}
{{ js('js/jquery') }}
{{ js('js/xhogan') }}
{{ js('js/hammer') }}
{{ js('assets/bootstrap/js/bootstrap') }}
{{ js('js/lang_select') }}
{{ js('js/toc') }}
{{ js('js/mobile_nav') }}
{{ js('js/skel') }}
{{ js('js/util') }}
{{ js('js/main') }}
{{ js('js/search') }}
<!-- endbuild -->

{% if theme.fancybox %}
<!-- build:js js/dist.fancybox.js -->
{{ js('assets/fancybox/jquery.fancybox') }}
{{ js('js/fancybox') }}
<!-- endbuild -->
{% endif %}

{% if page.comments and theme.duoshuo.shortname and theme.duoshuo.ua_enable %}
<!-- build:js js/dist.duoshuo.js -->
{{ js('js/ua-parser.min') }}
{{ js('js/duoshuo') }}
<!-- endbuild -->
{% endif %}

{% if theme.busuanzi %}
<!--busuanzi-->
<script async src="//dn-lbstatics.qbox.me/busuanzi/2.3/busuanzi.pure.mini.js"></script>
{% endif %}
