/* global debounce */
'use strict';

/**
 * scroll paging plugin
 * @author levinhuang
 */
(function ($) {
	// Private functions.
	var p = {};
	p.model = function ($d, opts) {
		this.opts = opts;
		this.$target = $d;
		this.$scrollTarget = this.opts.$scrollTarget || $d;
		this.$doc = $(document);
		this.isLoading = false;
		this.pageData = opts.pageData;
		this.noMorePage = false;
		this.init();
	};
	p.model.prototype = {
		init: function () {
			var me = this;
			$.fn.scrollPager.enable(this.$target);
			
			this.$scrollTarget.on("scroll.scroll_pager", debounce(function (e) {
				return me.onScroll();
			}, me.opts.scrollDebounce));
			
			if(this.opts.loadDataOnInit) {
				this.loadData();
			}
		},
		dispose:function () {
			this.$scrollTarget.off("scroll.scroll_pager");
			this.$target.removeData("scrollpager");
		},
		onScroll:function () {
			if((!this.$target.data("scrollpager")) || this.isLoading || this.noMorePage ) {
				return false;
			}
			
			var canLoad = (this.$scrollTarget.scrollTop() + this.opts.heightOffset) >= (this.$doc.height() - this.$scrollTarget.height());
			if(!canLoad) {
				return false;
			}

			//load data from server
			return this.loadData();
			
		},
		_getUrl: function() {
			var ret = this.opts.url;
			if(typeof this.opts.url === 'function') {
				ret = ret(this.pageData);
			}
			return ret;
		},
		loadData: function () {
			this.pageData.p++;
			if(this.pageData.total <= this.pageData.p) {
				this.noMorePage = true;
				this.dispose();
			}

			if (this.pageData.total < this.pageData.p) {
				return false;
			}

			if(this.opts.ajaxOpts.stringifyData && this.opts.ajaxOpts.data) {
				this.opts.ajaxOpts.data = $.extend(true, this.opts.ajaxOpts.data, this.pageData);
				this.opts.ajaxOpts.data = JSON.stringify(this.opts.ajaxOpts.data);
			}

			this.isLoading = true;
			this.opts.showLoading();
			//before load
			if(this.opts.beforeLoad) {
				this.opts.beforeLoad.call(this);
			}
			var me = this,
				url = this._getUrl();
			this.jqXHR = $.ajax(url, this.opts.ajaxOpts)
				.done(function (data, txtstatus, xhr) {
					
					if(me.opts.afterLoad) {
						me.opts.afterLoad.call(this, true,data);
					}

				}).fail(function (txtstatus,xhr,err) {
					me.log(xhr);
					
					if(me.opts.afterLoad) {
						me.opts.afterLoad.call(this, false,{xhr:xhr,err:err,Title:"Server Error..."});
					}

				}).always(function (xhr, txtstatus) {
					me.isLoading = false;
					me.opts.hideLoading();
				});
			
		},
		log:function(obj) {
			var c = window["console"] || { log:function () {}};
			c.log(obj);
		}
	};
	//main plugin body
	$.fn.scrollPager = function (opts) {
		// Set the options.
		opts = $.extend(true,{}, $.fn.scrollPager.defaults, opts);
		// Go through the matched elements and return the jQuery object.
		return this.each(function () {
			new p.model($(this), opts);
		});
	};
	// Public defaults.
	$.fn.scrollPager.defaults = {
		"url": null,
		"beforeLoad":function (){},
		"afterLoad":function (isOk, data){},
		"showLoading":function () {},
		"hideLoading":function () {},
		"$scrollTarget":$(window),
		"heightOffset":0,
		"loadDataOnInit":false,
		"pageData": {
			p:0,		//current page
			ps:10,		//page size
			total:100	//total pages
		},
		"ajaxOpts": {
			dataType: 'json',
			contentType: 'application/json; charset=utf-8',
			type: "POST",
			data:{},
			stringifyData:true
		},
		scrollDebounce: 100
	};
	$.fn.scrollPager.disable = function($target) {
		return $target.data("scrollpager",false);
	};
	$.fn.scrollPager.enable = function($target) {
		return $target.data("scrollpager",true);
	};
})(jQuery);