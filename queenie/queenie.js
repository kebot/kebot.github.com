(function() {
  var checkHash, getHash, getURL, isPhone, moveMagazine, resizeViewport, rotated, setControllPos, setScroll;

  getURL = function() {
    return window.location.href.split("#").shift();
  };

  getHash = function() {
    return window.location.hash.slice(1);
  };

  setControllPos = function() {
    var view;
    view = $("#magazine").turn("view");
    if (view[0]) {
      $("#previous").addClass("visible");
    } else {
      $("#previous").removeClass("visible");
    }
    if (view[1]) {
      return $("#next").addClass("visible");
    } else {
      return $("#next").removeClass("visible");
    }
  };

  checkHash = function(hash) {
    var k;
    hash = getHash();
    k = void 0;
    if ((k = jQuery.inArray(hash, pages)) !== -1) {
      $("nav").children().each(function(index, value) {
        if ($(value).attr("href").indexOf(hash) !== -1) {
          return $(value).addClass("on");
        } else {
          return $(value).removeClass("on");
        }
      });
      return k + 1;
    }
    return 1;
  };

  rotated = function() {
    return Math.abs(window.orientation) === 90;
  };

  isPhone = function() {
    return navigator.userAgent.match(/iPhone/i);
  };

  resizeViewport = function() {
    return $("#viewport").css({
      width: $(window).width(),
      height: (isPhone() && !rotated() ? 1670 : $(document).height())
    });
  };

  setScroll = function() {
    if (isPhone()) {
      return window.scrollTo(0, (rotated() ? $("#magazine").offset().top - 6 : 1));
    }
  };

  moveMagazine = function(page) {
    var leftc, leftd, leftr, options, pageWidth, rendered, that, total, width;
    that = $("#magazine");
    rendered = that.data().done;
    width = that.width();
    pageWidth = width / 2;
    total = that.data().totalPages;
    options = {
      duration: (!rendered ? 0 : 600),
      easing: "easeInOutCubic",
      complete: function() {
        return $("#magazine").turn("resize");
      }
    };
    $("#controllers").stop();
    if (page === total) $("#shadow-page").fadeOut(0);
    if ((page === 1 || page === total) && !rotated()) {
      leftc = ($(window).width() - width) / 2;
      leftr = ($(window).width() - pageWidth) / 2;
      leftd = (page === 1 ? leftr - leftc - pageWidth : leftr - leftc);
      return $("#controllers").animate({
        left: leftd
      }, options);
    } else {
      $("#shadow-page").fadeOut("slow");
      return $("#controllers").animate({
        left: 0
      }, options);
    }
  };

  window.pages = ["home", "usage", "usage", "get", "get", "reference", "reference", "credits", "animal", "animal", "movies"];

  $(document).ready(function() {
    $("#magazine").bind("turn", function(e, page) {
      return moveMagazine(page);
    }).bind("turned", function(e, page, pageObj) {
      var rendered;
      rendered = $(this).data().done;
      moveMagazine(page);
      if (!rendered) {
        $("#controllers").fadeIn();
      } else {
        jQuery.each(pages, function(index, value) {
          var newUrl;
          if (page === index + 1) {
            newUrl = getURL() + "#" + value;
            window.location.href = newUrl;
            return false;
          }
        });
      }
      setControllPos();
      if (page === 1) {
        $("#shadow-page").fadeIn("slow");
      } else {
        $("#shadow-page").fadeOut((rendered ? "slow" : 0));
      }
      return setScroll();
    }).bind("start", function(e, page) {
      if (page === 2) {
        return $("#previous").hide();
      } else {
        if (page === $(this).data().totalPages - 1) return $("#next").hide();
      }
    }).bind("end", function(e, page) {
      if (page !== 1) $("#previous").show();
      if (page !== $(this).data().totalPages - 1) return $("#next").show();
    });
    $(window).bind("keydown", function(e) {
      if (e.keyCode === 37) {
        return $("#magazine").turn("previous");
      } else {
        if (e.keyCode === 39) return $("#magazine").turn("next");
      }
    }).bind("hashchange", function() {
      var page;
      page = checkHash();
      if (pages !== $("#magazine").turn("page")) {
        return $("#magazine").turn("page", page);
      }
    }).bind("touchstart", function(e) {
      var t, touchEnd, touchStart;
      t = e.originalEvent.touches;
      if (t[0]) {
        touchStart = {
          x: t[0].pageX,
          y: t[0].pageY
        };
      }
      return touchEnd = null;
    }).bind("touchmove", function(e) {
      var pos, t, touchEnd;
      t = e.originalEvent.touches;
      pos = $("#magazine").offset();
      if (t[0].pageX > pos.left && t[0].pageY > pos.top && t[0].pageX < pos.left + $("#magazine").width() && t[0].pageY < pos.top + $("#magazine").height()) {
        if (t.length === 1) e.preventDefault();
        if (t[0]) {
          return touchEnd = {
            x: t[0].pageX,
            y: t[0].pageY
          };
        }
      }
    }).bind("touchend", function(e) {
      var d, pos, that, w;
      if (window.touchStart && window.touchEnd) {
        that = $("#magazine");
        w = that.width() / 2;
        d = {
          x: touchEnd.x - touchStart.x,
          y: touchEnd.y - touchStart.y
        };
        pos = {
          x: touchStart.x - that.offset().left,
          y: touchStart.y - that.offset().top
        };
        if (Math.abs(d.y) < 100) {
          if (d.x > 100 && pos.x < w) {
            return $("#magazine").turn("previous");
          } else {
            if (d.x < 100 && pos.x > w) return $("#magazine").turn("next");
          }
        }
      }
    }).resize(function() {
      $("#magazine").turn("resize");
      return resizeViewport();
    });
    $("#next").click(function(e) {
      $("#magazine").turn("next");
      return false;
    });
    $("#previous").click(function(e) {
      e.stopPropagation();
      $("#magazine").turn("previous");
      return false;
    });
    $("#magazine").children(":first").bind("flip", function() {}).find("p").fadeOut(0).fadeIn(2000);
    $("body").bind("orientationchange", function() {
      resizeViewport();
      setScroll();
      return moveMagazine($("#magazine").turn("page"));
    });
    if ($(window).width() <= 1200) $("body").addClass("x1024");
    $("#magazine").turn({
      page: checkHash(),
      gradients: !$.isTouch,
      acceleration: false,
      elevation: 50
    });
    resizeViewport();
    return setScroll();
  });

}).call(this);
