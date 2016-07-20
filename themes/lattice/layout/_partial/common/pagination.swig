{% if page.prev or page.next %}
  <nav class="pagination">
    {{
      paginator({
        prev_text: '<i class="fa fa-angle-left"></i>',
        next_text: '<i class="fa fa-angle-right"></i>',
        mid_size: 1
      })
    }}
  </nav>
  <div class="spinner" id="spinnerPager">
    <div class="double-bounce double-bounce1"></div>
    <div class="double-bounce double-bounce2"></div>
  </div>
  <script>
    App.pager = {
        current: {{page.current}},
        next: {{page.next}},
        total: {{page.total}},
        size: {{config.per_page}},
        dir: '{{config.fragments_generator.dir}}',
        dirIndex: '{{config.fragments_generator.index_dir}}',
        dirCate: '{{config.category_dir}}/{{page.category}}',
        dirTag: '{{config.tag_dir}}/{{page.tag}}'
    };
  </script>
{% endif %}