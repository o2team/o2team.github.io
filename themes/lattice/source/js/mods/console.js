(function($, App) {
    var o2console = {

        // console配置内容,内容为空请填写 如：freshTec: "%c%c",
        configs: {
            // 招聘信息：统一固定的输出
            staff: "%cBuilt%c by AOTU Labs（Aotu.io） %cbasing on Hexo.\n\nJoin us at %caotu@jd.com%c.\n\n",
            // 页面用到的技术：在这个页面，我们用了%cXXX，YYY，%c你发现了吗？\n\n
            freshTec: "%c%c",
            // 趣味体验：另外，尝试%cXXX，%c会有惊喜哦~\n\n
            funExp: "%c%c"
        },

        // 定义console样式
        init: function(){

            // 只展示chrome
            if(window.console&&console.log&&navigator.userAgent.toLowerCase().match(/chrome\/([\d.]+)/)) {

                var consoleConfig = this.configs;

                var styleBold = "font-weight: bold;color: #6190e8;";
                var styleNormal =  "font-size: 12px;color: #6190e8;";

                console.log(consoleConfig.staff + consoleConfig.freshTec + consoleConfig.funExp, "color: #6190e8;", styleBold, styleNormal, styleBold, styleNormal, styleBold, styleNormal, styleBold, styleNormal);

            }
        }   

    };
    o2console.init();   
})(jQuery, App);// console信息
