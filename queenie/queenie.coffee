getURL = ->
  window.location.href.split("#").shift()
getHash = ->
  window.location.hash.slice 1
setControllPos = ->
  view = $("#magazine").turn("view")
  if view[0]
    $("#previous").addClass "visible"
  else
    $("#previous").removeClass "visible"
  if view[1]
    $("#next").addClass "visible"
  else
    $("#next").removeClass "visible"
checkHash = (hash) ->
  hash = getHash()
  k = undefined
  unless (k = jQuery.inArray(hash, pages)) is -1
    $("nav").children().each (index, value) ->
      unless $(value).attr("href").indexOf(hash) is -1
        $(value).addClass "on"
      else
        $(value).removeClass "on"

    return k + 1
  1
rotated = ->
  Math.abs(window.orientation) is 90
isPhone = ->
  navigator.userAgent.match /iPhone/i
resizeViewport = ->
  $("#viewport").css
    width: $(window).width()
    height: (if (isPhone() and not rotated()) then 1670 else $(document).height())
setScroll = ->
  window.scrollTo 0, (if (rotated()) then $("#magazine").offset().top - 6 else 1)  if isPhone()
moveMagazine = (page) ->
  that = $("#magazine")
  rendered = that.data().done
  width = that.width()
  pageWidth = width / 2
  total = that.data().totalPages
  options =
    duration: (if (not rendered) then 0 else 600)
    easing: "easeInOutCubic"
    complete: ->
      $("#magazine").turn "resize"

  $("#controllers").stop()
  $("#shadow-page").fadeOut 0  if page is total
  if (page is 1 or page is total) and not rotated()
    leftc = ($(window).width() - width) / 2
    leftr = ($(window).width() - pageWidth) / 2
    leftd = (if (page is 1) then leftr - leftc - pageWidth else leftr - leftc)
    $("#controllers").animate
      left: leftd
    , options
  else
    $("#shadow-page").fadeOut "slow"
    $("#controllers").animate
      left: 0
    , options
window.pages = [ "home", "usage", "usage", "get", "get", "reference", "reference", "credits", "animal", "animal", "animal", "movies" ]
$(document).ready ->
  $("#magazine").bind("turn", (e, page) ->
    moveMagazine page
  ).bind("turned", (e, page, pageObj) ->
    rendered = $(this).data().done
    moveMagazine page
    unless rendered
      $("#controllers").fadeIn()
    else
      jQuery.each pages, (index, value) ->
        if page is index + 1
          newUrl = getURL() + "#" + value
          window.location.href = newUrl
          false
    setControllPos()
    if page is 1
      $("#shadow-page").fadeIn "slow"
    else
      $("#shadow-page").fadeOut (if (rendered) then "slow" else 0)
    setScroll()
  ).bind("start", (e, page) ->
    if page is 2
      $("#previous").hide()
    else $("#next").hide()  if page is $(this).data().totalPages - 1
  ).bind "end", (e, page) ->
    $("#previous").show()  unless page is 1
    $("#next").show()  unless page is $(this).data().totalPages - 1

  $(window).bind("keydown", (e) ->
    if e.keyCode is 37
      $("#magazine").turn "previous"
    else $("#magazine").turn "next"  if e.keyCode is 39
  ).bind("hashchange", ->
    page = checkHash()
    $("#magazine").turn "page", page  unless pages is $("#magazine").turn("page")
  ).bind("touchstart", (e) ->
    t = e.originalEvent.touches
    if t[0]
      touchStart =
        x: t[0].pageX
        y: t[0].pageY
    touchEnd = null
  ).bind("touchmove", (e) ->
    t = e.originalEvent.touches
    pos = $("#magazine").offset()
    if t[0].pageX > pos.left and t[0].pageY > pos.top and t[0].pageX < pos.left + $("#magazine").width() and t[0].pageY < pos.top + $("#magazine").height()
      e.preventDefault()  if t.length is 1
      if t[0]
        touchEnd =
          x: t[0].pageX
          y: t[0].pageY
  ).bind("touchend", (e) ->
    if window.touchStart and window.touchEnd
      that = $("#magazine")
      w = that.width() / 2
      d =
        x: touchEnd.x - touchStart.x
        y: touchEnd.y - touchStart.y

      pos =
        x: touchStart.x - that.offset().left
        y: touchStart.y - that.offset().top

      if Math.abs(d.y) < 100
        if d.x > 100 and pos.x < w
          $("#magazine").turn "previous"
        else $("#magazine").turn "next"  if d.x < 100 and pos.x > w
  ).resize ->
    $("#magazine").turn "resize"
    resizeViewport()

  $("#next").click (e) ->
    $("#magazine").turn "next"
    false

  $("#previous").click (e) ->
    e.stopPropagation()
    $("#magazine").turn "previous"
    false

  $("#magazine").children(":first").bind("flip", ->
  ).find("p").fadeOut(0).fadeIn 2000
  $("body").bind "orientationchange", ->
    resizeViewport()
    setScroll()
    moveMagazine $("#magazine").turn("page")

  $("body").addClass "x1024"  if $(window).width() <= 1200
  $("#magazine").turn
    page: checkHash()
    gradients: not $.isTouch
    acceleration: false
    elevation: 50

  resizeViewport()
  setScroll()
