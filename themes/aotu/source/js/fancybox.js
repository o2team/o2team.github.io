(function($){

    $('.post-content img').each(function(){
        var $image = $(this),
            imageTitle = $image.attr('title'),
            $imageWrapLink = $image.parent('a');

        if($imageWrapLink.size() > 0) return;

        $imageWrapLink = $image.wrap('<a href="' + this.getAttribute('src') + '"></a>').parent('a');
        $imageWrapLink.addClass('fancybox');
        $imageWrapLink.attr('rel', 'group');

        if (imageTitle) {
            $imageWrapLink.attr("title", imageTitle); //make sure img title tag will show correctly in fancybox
        }
    });

    $('.fancybox').fancybox();

})(jQuery);
