
(function(){
	window.lv = {};

	var buildSelectors = function(selectors, source, characterToPrependWith) {
		$.each(source, function(propertyName, value){
			selectors[propertyName] = characterToPrependWith + value;
		});
	};

	lv.buildSelectors = function(classNames, ids) {
		var selectors = {};
		if(classNames) {
			buildSelectors(selectors, classNames, ".");
		}
		if(ids) {
			buildSelectors(selectors, ids, "#");
		}
		return selectors;
	};

	var classNames = {
		image: 'image',
		headerContainer: 'lv-header-container',
		galleryContainer: 'lv-gallery-container',
		contentContainer: 'lv-content-container',
		openCloseMenu: 'lv-open-close-menu',
		nav: 'lv-nav',
		showNav: 'lv-show-nav',
		newImage: 'lv-image',
		wrap: 'lv-wrap',
		openMenu: 'lv-open-menu'
	};

	var ids = {
	};

	var selectors = lv.buildSelectors(classNames, ids);

	function loadJSON() {
		$.ajax({
			dataType: "json",
			type: 'GET',
			url: 'gallery/gallery.json'
		}).done(function (data) {
			if (data[lv.index]) {
				$(selectors.wrap).html('');
				$.each(data[lv.index], function (key, value) {
					loadImage(value);
				});
			}
		}).fail(function () {
			console.log('Not available file or error in it!');
		});
	}

	function loadImage(imageName) {
		var $image = $('<img />').attr('src', '/images/loading.gif');
		var $imageContainer = $('<div/>').addClass(classNames.image).html($image);
		var $img;
		if ($(window).width() > 895) {
			$imageContainer.css({height: lv.heightImage});
		} else {
			$imageContainer.css({width: lv.imageWidth});
		}
		$(selectors.wrap).append($imageContainer);
		$img = $('<img />', {'src': '/gallery/' + lv.index + '/' + imageName}).load(function(){
			$imageContainer.html($img);
			$imageContainer.addClass(classNames.newImage);
		});
		if ($(window).width() > 895) {
			$img.css({height: lv.heightImage});
		} else {
			$img.css({width: lv.imageWidth});
		}
	}

	lv._resizeWindow = function(delimeter){
		delimeter = delimeter ? delimeter : 0;
		var headerHeight = $(selectors.headerContainer).outerHeight(),
			windowHeight = $(window).height(),
			windowWidth = $(window).width();
		lv.imageWidth = windowWidth - 20;
		lv.heightImage = windowHeight - headerHeight - delimeter;
		$(selectors.image).each(function(){
			$(this).removeAttr('style');
			$(this).find('img').removeAttr('style');
			if (windowWidth > 895) {
				$(this).css({height: lv.heightImage});
				$(this).find('img').css({height: lv.heightImage});
			} else {
				$(this).css({width: lv.imageWidth});
				$(this).find('img').css({width: lv.imageWidth});
			}

		});
		$(selectors.galleryContainer).removeAttr('style');
		$(selectors.wrap).removeAttr('style');
		if (windowWidth > 895) {
			$(selectors.galleryContainer).css({height: lv.heightImage});
			$(selectors.wrap).css({height: lv.heightImage});
		} else {
			$(selectors.galleryContainer).css({width: lv.imageWidth});
			$(selectors.wrap).css({width: lv.imageWidth});
		}
		$(selectors.contentContainer).show();
		$(selectors.headerContainer).removeClass(classNames.openMenu);
		$(selectors.nav).removeClass(classNames.showNav);
	};

	$(function(){
		lv.index = location.pathname === '/' ? 'index' : location.pathname.replace('.html', '').replace('/','').toString();
		lv._resizeWindow(25);
		loadJSON();

		$(selectors.openCloseMenu).on('click', function(){
			$(selectors.headerContainer).toggleClass(classNames.openMenu);
			$(selectors.contentContainer).toggle();
			$(selectors.nav).toggleClass(classNames.showNav);
		});
	});

	$(window).on('resize', function(){
		lv._resizeWindow(10);
	});
})();