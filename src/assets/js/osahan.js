(function ($) {
	"use strict";
	$('[data-toggle="tooltip"]').tooltip();
	// $('.offer-slider').slick({
	// 	centerMode: true,
	// 	centerPadding: '40px',
	// 	slidesToShow: 3,
	// 	infinite: true,
	// 	slidesToScroll: 1,
	// 	autoplay: true,
 	// 	autoplaySpeed: 5000,
	// 	arrows: false,
	// 	responsive: [{
	// 		breakpoint: 769,
	// 		settings: {
	// 			arrows: false,
	// 			centerMode: true,
	// 			centerPadding: '40px',
	// 			slidesToShow: 2
	// 		}
	// 	}, {
	// 		breakpoint: 480,
	// 		settings: {
	// 			arrows: false,
	// 			centerMode: true,
	// 			centerPadding: '10px',
	// 			slidesToShow: 2
	// 		}
	// 	}]
	// });
	// $('.cat-slider').slick({
	// 	centerMode: true,
	// 	centerPadding: '30px',
	// 	slidesToShow: 6,
	// 	arrows: false,
	// 	responsive: [{
	// 		breakpoint: 769,
	// 		settings: {
	// 			arrows: false,
	// 			centerMode: true,
	// 			centerPadding: '40px',
	// 			slidesToShow: 3
	// 		}
	// 	}, {
	// 		breakpoint: 480,
	// 		settings: {
	// 			arrows: false,
	// 			infinite: true,
  //       		slidesToScroll: 1,
  //       		autoplay: true,
  //        		autoplaySpeed: 3000,
	// 			centerMode: true,
	// 			centerPadding: '40px',
	// 			slidesToShow: 2
	// 		}
	// 	}]
	// }).on('setPosition', function (event, slick) {
	//     slick.$slides.css('height', slick.$slideTrack.height() + 'px');
	// });

	// $('.trending-slider').slick({
	// 	centerMode: false,
	// 	infinite: true,
	// 	centerPadding: '50px',
	// 	slidesToShow: 4,
	// 	arrows: true,
	// 	responsive: [
	// 	{
	// 		breakpoint: 1282,
	// 		settings: {
	// 			arrows: false,
	// 			centerMode: true,
	// 			centerPadding: '20px',
	// 			slidesToShow: 3
	// 		}
	// 	}
	// 	,{
	// 		breakpoint: 991,
	// 		settings: {
	// 			arrows: false,
	// 			centerMode: true,
	// 			centerPadding: '40px',
	// 			slidesToShow: 2
	// 		}
	// 	}, {
	// 		breakpoint: 480,
	// 		settings: {
	// 			arrows: false,
	// 			centerMode: true,
	// 			centerPadding: '20px',
	// 			slidesToShow: 1
	// 		}
	// 	}]
	// }).on('setPosition', function (event, slick) {
	//     slick.$slides.css('height', slick.$slideTrack.height() + 'px');
	// });

	var $main_nav = $('#main-nav');
	var $toggle = $('.toggle');
	var defaultOptions = {
		disableAt: false,
		customToggle: $toggle,
		levelSpacing: 40,
		navTitle: 'Triveni Sangam',
		levelTitles: true,
		levelTitleAsBack: true,
		pushContent: '#container',
		insertClose: 2,
    removeOriginalNav : false
	};
  var Nav = $main_nav.hcOffcanvasNav(defaultOptions);

})(jQuery);

