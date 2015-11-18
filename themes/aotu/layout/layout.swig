<!DOCTYPE html>
<html lang="{{ page.lang }}">
{{ partial('partial/head') }}
<body>
<div id="wrapper" class="root">
    {{ partial('partial/header') }}
    {{ partial('partial/slide_menu') }}
    {{ body }}
    {{ partial('partial/footer') }}
    {{ partial('partial/after_footer') }}
</div>
</body>
</html>
