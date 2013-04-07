// Init sidebar
$(function() {
  var activeItem,
      helpList = $('#sub-nav .js-maintopic'),
      firstOccurrence = true

  // hide list items at startup
  if($('body.api') && window.location){
    var reg = /\/\/[^\/]+(\/.+)/g,
        docUrl = reg.exec(window.location.toString())
    if(docUrl){
      $('#sub-nav .js-maintopic a').each(function(){
        var url = $(this).attr('href').toString()
        if(url.indexOf(docUrl[1]) >= 0 && url.length == docUrl[1].length){
          // $(this).parent('li').addClass('active')
          $(this).attr('class', "active")
          var parentTopic = $(this).parentsUntil('#sub-nav > ul').last()
          parentTopic.addClass('js-current')
          parentTopic.find('.js-expand-btn').toggleClass('collapsed expanded')
        }
      })
    }
  }

  $('#sub-nav .js-maintopic').each(function(){
    if(($(this).find('.active').length == 0 || firstOccurrence == false) &&
    $(this).hasClass('js-current') != true){
      $(this).find('.js-guides').children().hide()
    } else {
      activeItem = $(this).index()
      firstOccurrence = false
    }
  })

  // Toggle style list. Expanded items stay
  // expanded when new items are clicked.
  $('#sub-nav .js-toggle-list .js-expand-btn').click(function(){
    var clickedTopic = $(this).parents('.js-topic'),
        topicGuides  = clickedTopic.find('.js-guides li')
    $(this).toggleClass('collapsed expanded')
    topicGuides.toggle(100)
    return false
  })

  // Accordion style list. Expanded items
  // collapse when new items are clicked.
  $('#sub-nav .js-maintopic>a').click(function(){
    var clickedTopic = $(this).parents('.js-maintopic'),
        topicGuides = clickedTopic.find('.js-guides li')

    if(clickedTopic.find('ul').length === 0) {
      return true;
    } else if(activeItem != clickedTopic.index()){
      if(helpList.eq(activeItem)){
        helpList.eq(activeItem).find('.js-guides li').toggle(100)
      }
      activeItem = clickedTopic.index()
      topicGuides.toggle(100)
    } else {
      activeItem = undefined
      topicGuides.toggle(100)
    }

    return false
  })

});