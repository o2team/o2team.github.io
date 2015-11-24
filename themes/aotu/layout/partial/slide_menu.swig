<section id="menu" class="slide-menu">

    <!-- Search -->
    <section>
        <form class="search search-form" method="get">
            <input type="text" name="query" placeholder="{{ __('menu.search') }}" />
        </form>
    </section>

    <section>
        <ul class="links sm-links-aotu">
        {{ header_menu('main-nav') }}
        </ul>
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
        </ul>
    </section>

    <!-- Actions -->
    <section>
        <ul class="actions vertical">
            <li><a href="https://github.com/{{ config.github.user }}" class="button big fit"><i class="fa fa-github"></i>Github</a></li>
        </ul>
    </section>
</section>
