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

{% if page.comments && theme.gitalk && theme.gitalk.client_id %}
<div class="post-comments" id="comments"></div>
<script>
  var gitalkOpts = {
    id: '{{ post_key(page.path, page.ckey) }}',
    owner: '{{ theme.gitalk.owner }}',
    repo: '{{ theme.gitalk.repo }}',
    title: '{{ page.title }}',
    body: '{{url}}\n\n{{ page.subtitle }}',
    clientID: '{{ theme.gitalk.client_id }}',
    clientSecret: '{{ theme.gitalk.client_secret }}',
    admin: ['mamboer', 'waileung', 'yevolcn']
  };
</script>
{% endif %}
