{% if page.comments && config.disqus_shortname %}
<section id="comments">
  <div id="disqus_thread"></div>
</section>
<script>
  var disqus_shortname = '{{ config.disqus_shortname }}';
  var disqus_url = '{{ url }}';
  var disqus_title = {{ JSON.stringify(page.title) }};
  var disqus_config = function(){
    this.language = '{{ disqus_lang() }}';
  };
  (function(){
    var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
    dsq.src = '//go.disqus.com/embed.js';
    (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
  })();
</script>
{% endif %}

{% if page.comments && theme.duoshuo.shortname %}
<div class="post-comments" id="comments">
<!-- 多说评论框 start -->
<div class="ds-thread" data-thread-key="{{ post_key(page.path, page.ckey) }}" data-title="{{ page.title }}" data-url="{{ url }}"></div>
<!-- 多说评论框 end -->
<!-- 多说公共JS代码 start (一个网页只需插入一次) -->
<script type="text/javascript">
    var duoshuoQuery = {short_name:"{{ theme.duoshuo.shortname }}"};
    (function() {
        var ds = document.createElement('script');
        ds.id = "duoshuo-script";
        ds.type = 'text/javascript';ds.async = true;
        ds.src = (document.location.protocol == 'https:' ? 'https:' : 'http:') + '//static.duoshuo.com/embed.js';
        ds.charset = 'UTF-8';
        (document.getElementsByTagName('head')[0] 
         || document.getElementsByTagName('body')[0]).appendChild(ds);
    })();
</script>
<!-- 多说公共JS代码 end -->

{% if theme.duoshuo.admin_enable and theme.duoshuo.user_id %}
<script type="text/javascript">
    var duoshuo_user_ID = {{theme.duoshuo_info.user_id}},
        duoshuo_admin_nickname="{{theme.duoshuo_info.admin_nickname}}";
</script>
{% endif %}

</div>
{% endif %}
