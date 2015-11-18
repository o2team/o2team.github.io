<footer id="footer" class="footer">
    <ul class="icons">
        <li><a href="https://twitter.com/{{ config.twitter }}" class="footer-link" target="_blank"><i class="fa fa-twitter"></i></a></li>
        <li><a href="https://github.com/{{ config.github }}" class="footer-link" target="_blank"><i class="fa fa-github-alt"></i></a></li>
        <li><a href="{{ url_for('atom.xml') }}" class="fa-rss"><span class="label">RSS</span></a></li>
    </ul>
    <div class="copyright">
      &copy; {{ moment(Date.now()).year() }} <a href="http://zespia.tw/" target="_blank">{{ config.author }}</a><br>
      Documentation licensed under <a href="http://creativecommons.org/licenses/by/4.0/" target="_blank">CC BY 4.0</a>.
    </div>
</footer>
