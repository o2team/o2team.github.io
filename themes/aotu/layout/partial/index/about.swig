<section class="blurb">
    <h2>{{ __('menu.about') }}</h2>
    <p>{{ config.description }}</p>
    <ul class="actions">
        <li><a href="{{ url_for('about/') }}" class="button">{{ __('button.learn_more') }}</a></li>
    </ul>
</section>
