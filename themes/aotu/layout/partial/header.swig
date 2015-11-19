<header id="header" class="header">
	<h1 class="logo-wrap"><a class="logo" href="{{ url_for_lang('index.html') }}">{{ config.title }}</a></h1>
	<nav class="links">
		<ul>
        	{{ header_menu('main-nav') }}
			<li class="main-nav-item">
				<a href="https://github.com/{{ config.github }}" class="main-nav-link"><i class="fa fa-github-alt"></i></a>
			</li>
		</ul>
	</nav>
	<nav class="main">
		<ul>
			<li class="search">
				<a class="fa-search" href="#search">Search</a>
				<form id="search" method="get" action="#">
					<input type="text" name="query" placeholder="Search" />
				</form>
			</li>
			<li class="menu">
				<a class="fa-bars" href="#menu">Menu</a>
			</li>
		</ul>
	</nav>
</header>
