<header id="header" class="header" itemscope itemtype="http://schema.org/WPHeader">
	<h1 class="logo-wrap"><a class="logo" href="{{ url_for('index.html') }}" title="{{ config.title }}"><img src="{{ url_for(theme.logo.url) }}" alt="{{ config.title }}"/></a></h1>
	<nav class="header-main">
		<ul class="header-links">
        	{{ header_menu('main-nav') }}
		</ul>
	</nav>
	<nav class="header-extra">
		<ul class="header-links-extra">
			<li class="search">
				<a class="fa-search" href="#search">{{ __('menu.search') }}</a>
				<form id="search" method="get" class="search-form">
					<input type="text" name="query" placeholder="{{ __('menu.search') }}" />
				</form>
			</li>
			<li class="menu">
				<a class="fa-bars" href="#menu">Menu</a>
			</li>
		</ul>
	</nav>
</header>
