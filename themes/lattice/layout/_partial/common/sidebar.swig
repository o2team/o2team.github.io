<aside class="mod-side" id="sidebar">
    <div class="mod-side-sec aotuwx">
        <img  class="aotuwx-qrcode" src="{{ url_for('img/qrcode.jpg') }}" alt="{{ __('site.follow_us') }}"/> 
        <div class="aotuwx-slogan">每周五推送精选技术文章</div>
    </div>

    <div class="mod-side-sec works"> 
        <div class="mod-side-sec-hd">
            <h2>{{ __('sidebar.works') }}</h2>
        </div>
        <div class="mod-side-sec-bd">
            <ul class="mod-side-list">
                {% for item in site.data.cases %}
                <li>
                    <a href="{{ item.preview }}" target="_blank" title="{{ item.name }}">
                        {{ item.name }}
                    </a>
                </li>
                {% endfor %}
            </ul>
        </div> 
    </div>

    <div class="mod-side-sec favlinks"> 
        <div class="mod-side-sec-hd">
            <h2>{{ __('sidebar.favlinks') }}</h2>
        </div>
        <div class="mod-side-sec-bd">
            <ul class="mod-side-list">
                {% for item in site.data.links %}
                <li>
                    <a href="{{ item.link }}" target="_blank" title="{{ item.desc }}">
                        {{ item.name }}
                    </a>
                </li>
                {% endfor %}
            </ul>
        </div> 
    </div>
  
</aside>