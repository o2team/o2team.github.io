<section id="menu" class="slide-menu">

<!-- Search -->
    <section>
        <form class="search" method="get" action="#">
            <input type="text" name="query" placeholder="{{ __('menu.search') }}" />
        </form>
    </section>

<!-- Links -->
    <section>
        <ul class="links">
            {% for item in site.data.links %}
            <li>
                <a href="{{ item.link }}">
                    <h3>{{ item.name }}</h3>
                    <p>{{ item.desc }}</p>
                </a>
            </li>
            {% endfor %}
            <li>
                <div id="lang-select-wrap" class="lang-select-wrap">
                    <label id="lang-select-label" class="lang-select-label"><i class="fa fa-globe"></i><span>{{ lang_name(page.lang) }}</span></label>
                    <select id="lang-select" data-canonical="{{ canonical_path_for_nav() }}" class="lang-select">
                        {% for lang in site.data.languages %}
                        <option value="{{ loop.key }}"{% if page.lang === loop.key %} selected{% endif %}>{{ lang_name(loop.key) }}</option>
                        {% endfor %}
                    </select>
                </div>
            </li>
        </ul>
    </section>

<!-- Actions -->
    <section>
        <ul class="actions vertical">
            <li><a href="https://github.com/{{ config.github.user }}" class="button big fit"><i class="fa fa-github"></i>Github</a></li>
        </ul>
    </section>
</section>
