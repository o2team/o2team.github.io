{% if config.cnzz_analytics %}
<style>
#cnzz_stat_icon_{{ config.cnzz_analytics }}{display:none;}
</style>
<script type="text/javascript">var cnzz_protocol = (("https:" == document.location.protocol) ? " https://" : " http://");document.write(unescape("%3Cspan id='cnzz_stat_icon_{{ config.cnzz_analytics }}'%3E%3C/span%3E%3Cscript src='" + cnzz_protocol + "s11.cnzz.com/z_stat.php%3Fid%3D{{ config.cnzz_analytics }}' type='text/javascript'%3E%3C/script%3E"));</script>
{% endif %}
