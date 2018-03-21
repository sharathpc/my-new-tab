const imageCategory = ['nature','wallpaper','places','computer','transportation','travel','buildings'];
const quoteCategory = ['movies','movies','movies','movies','movies','movies','movies','famous'];

var randomNumber = 0
  , wallpaperResponse = ''
  , quoteText = '';

$(document).ready(function(){
  //chrome.storage.sync.clear();

  /* Set Toggle state from stoage */
  chrome.storage.sync.get("freezeWallpaper", function(_data){
    if(_data.freezeWallpaper){
      $('#freezeWallpaper').prop("checked", true);
    }
  });

  /* Create Shortcuts from storage */
  chrome.storage.sync.get("shortcutsList", function(_data){
    if(_data.shortcutsList){
      var _CONTENT = "";
      $(_data.shortcutsList).each(function(index, item){
        _CONTENT += '<li>\
                        <a href="'+ item.url +'" title="'+ item.title +'" data-index="'+ index +'">\
                            <img src="'+ item.icon +'"/>\
                        </a>\
                    </li>';
      });
      $("#scrollContainer>ul").append(_CONTENT);

      /* Run function to bind Context menu events */
      contextMenuEvents();
    }
  });

  /* Run functions to bind New/Freeze Wallpaper events */
  bindFreezeWallpaperEvent();
  bindNewWallpaperEvent();

  /* Initiate Data Assertion/Validation */
  assertData();
});

/* Assert/Validate information to request new data */
function assertData(){
  randomNumber = Math.floor(Math.random() * imageCategory.length+1);
  chrome.storage.sync.get(function(_data){

    if(_data.timeStamp != undefined
        && _data.wallpaperData != undefined
        && _data.wallpaperData.length>1 
        && (Math.round((((new Date() - new Date(_data.timeStamp)) % 86400000) % 3600000) / 60000)>5) 
        && (_data.freezeWallpaper == undefined
        || _data.freezeWallpaper != "true")){
      $('#preloader').show();
      chrome.storage.sync.set({'wallpaperData': [_data.wallpaperData[1]]});
      wallpaperResponse = [_data.wallpaperData[1]];
      quoteText = _data.quoteData;
      applyData();
      assertData();
    }else if(_data.timeStamp != undefined
        && _data.wallpaperData != undefined 
        && _data.wallpaperData.length==1){
      requestImage(1)
      chrome.storage.sync.set({'timeStamp': new Date().getTime()});
    }else if(_data.timeStamp == undefined || _data.wallpaperData == undefined){
      requestImage(2)
      chrome.storage.sync.set({'timeStamp': new Date().getTime()});
    }else{
      $('#preloader').show();
      wallpaperResponse = _data.wallpaperData;
      quoteText = _data.quoteData;
      applyData();
    }
  });
}

/* API Call to Unsplash for Wallpapers data */
function requestImage(_responseCount){
  $.ajax({
    url: "https://api.unsplash.com/photos/random",
    type: "get",
    headers: {"Accept-Version": "v1"},
    data: { 
      client_id: 'f8d843241ec749d581a9de34a8330a16c8fc02e5eb8bb7176d8179a3e78f0484',
      orientation: 'landscape',
      query: imageCategory[randomNumber],
      w: $(window).width(),
      h: $(window).height(),
      count: _responseCount
    },
    success: function(response) {
      if(_responseCount == 2){
        chrome.storage.sync.set({'wallpaperData': response});
        wallpaperResponse = response;
      }else{
        chrome.storage.sync.get(function(_data){
          _data.wallpaperData.push(response[0]);
          chrome.storage.sync.set({'wallpaperData': _data.wallpaperData});
        });
      }
      requestQuote(_responseCount);
    },
    error: function(xhr) {
      chrome.storage.sync.remove('wallpaperData');
    }
  });
}

/* API Call to Mashape for Quotes data */
function requestQuote(_responseCount){
  $.ajax({
    url: "https://andruxnet-random-famous-quotes.p.mashape.com/",
    type: "get",
    headers: {
      "X-Mashape-Key": "H18SzizuxpmshAfQ0vUpmqS7t59lp16RmOfjsnPBzvngwNZ48U",
      "Content-Type": "application/x-www-form-urlencoded",
      "Accept": "application/json"
    },
    data: { 
      cat: quoteCategory[randomNumber],
      count: _responseCount
    },
    success: function(response) {
      chrome.storage.sync.set({'quoteData': response});
      quoteText = response;
      if(_responseCount == 2){
        $('#preloader').show();
        applyData();
      }/* else{
        chrome.storage.sync.get(function(_data){
          chrome.storage.sync.set({'wallpaperData': _data.wallpaperData.push(response[0])});
        });
      } */
    },
    error: function(xhr) {}
  });
}

/* Update Wallpaper/Quotes data to UI */
function applyData(){
  $('body').css('background', 'url('+wallpaperResponse[0].urls.custom+')');
  $('#photographerInfo').attr('href','https://unsplash.com/@'+wallpaperResponse[0].user.username+'?utm_source=my_new_tab&utm_medium=referral').text(wallpaperResponse[0].user.name);
  $('#quote').text(quoteText.quote);
  $('#author').text('- '+quoteText.author);
  $('#preloader').hide();
  $('#options_container, #content').show();
}

/* New Wallpaper event function */
function bindNewWallpaperEvent(){
  $('#newWallpaper').bind('click',function(){
    $("#newWallpaper").addClass("rotateToggleFull");
    $('#preloader').show();
    $('#options_container, #content').hide();
    chrome.storage.sync.get(function(_data){
      if(_data.wallpaperData !== undefined){
        chrome.storage.sync.set({'wallpaperData': [_data.wallpaperData[1]], 'timeStamp': new Date().getTime()});
        wallpaperResponse = [_data.wallpaperData[1]];
        quoteText = _data.quoteData;
        applyData();
      }else{
        chrome.storage.sync.remove('timeStamp');
      }
      assertData();
    });
    setTimeout(function(){
      $("#newWallpaper").removeClass("rotateToggleFull");
    }, 500);
  });
}

/* Freeze Wallpaper event function */
function bindFreezeWallpaperEvent(){
  $('#freezeWallpaper').bind('click',function(){
    chrome.storage.sync.set({
      "freezeWallpaper": $("#freezeWallpaper").prop("checked"),
    });
  });
}

/* Context menu events function */
var shortcutItem;
function contextMenuEvents(){
  $("#scrollContainer li").bind("contextmenu", function(event) {
      event.preventDefault();
      $(".custom-context-menu").finish().toggle(100).css({
          top: event.pageY + "px",
          left: (event.pageX-130) + "px"
      });
      shortcutItem = $(this);
  });
  
  /* If the document is clicked somewhere */
  $(document).bind("mousedown", function(e) {
      if (!$(e.target).parents(".custom-context-menu").length > 0) {
          $(".custom-context-menu").hide(100);
      }
  });
  
  /* If the menu element is clicked */
  $(".custom-context-menu li").click(function(){
    switch($(this).attr("data-action")) {
      case "openTab":
        window.open(shortcutItem.children('a').attr('href'), '_blank');
        break;
      case "openWindow":
        chrome.windows.create({url: shortcutItem.children('a').attr('href')});
        break;
      case "removeShortcut":
        chrome.storage.sync.get(function(_data){
          if(_data.shortcutsList){
            chrome.storage.sync.set({'shortcutsList': _data.shortcutsList.filter((item) => item.url !== shortcutItem.children('a').attr('href'))});
          }
        }); 
        shortcutItem.remove(); 
        break;
    }
      $(".custom-context-menu").hide(100);
  });
}

/* Digital Clock self invoking function */
$(function(){
    // Cache some selectors
  
    var clock = $('#clock'),
      ampm = clock.find('.ampm');
  
    // Map digits to their names (this will be an array)
    var digit_to_name = 'zero one two three four five six seven eight nine'.split(' ');
  
    // This object will hold the digit elements
    var digits = {};
  
    // Positions for the hours, minutes, and seconds
    var positions = [
      'h1', 'h2', ':', 'm1', 'm2', ':', 's1', 's2'
    ];
  
    // Generate the digits with the needed markup,
    // and add them to the clock
  
    var digit_holder = clock.find('.digits');
  
    $.each(positions, function(){
  
      if(this == ':'){
        digit_holder.append('<div class="dots">');
      }
      else{
  
        var pos = $('<div>');
  
        for(var i=1; i<8; i++){
          pos.append('<span class="d' + i + '">');
        }
  
        // Set the digits as key:value pairs in the digits object
        digits[this] = pos;
  
        // Add the digit elements to the page
        digit_holder.append(pos);
      }
  
    });
  
    // Add the weekday names
  
    var weekday_names = 'MON TUE WED THU FRI SAT SUN'.split(' '),
      weekday_holder = clock.find('.weekdays');
  
    $.each(weekday_names, function(){
      weekday_holder.append('<span>' + this + '</span>');
    });
  
    var weekdays = clock.find('.weekdays span');
  
  
    // Run a timer every second and update the clock
  
    (function update_time(){
  
      // Use moment.js to output the current time as a string
      // hh is for the hours in 12-hour format,
      // mm - minutes, ss-seconds (all with leading zeroes),
      // d is for day of week and A is for AM/PM
  
      var now = moment().format("hhmmssdA");
  
      digits.h1.attr('class', digit_to_name[now[0]]);
      digits.h2.attr('class', digit_to_name[now[1]]);
      digits.m1.attr('class', digit_to_name[now[2]]);
      digits.m2.attr('class', digit_to_name[now[3]]);
      digits.s1.attr('class', digit_to_name[now[4]]);
      digits.s2.attr('class', digit_to_name[now[5]]);
  
      // The library returns Sunday as the first day of the week.
      // Stupid, I know. Lets shift all the days one position down, 
      // and make Sunday last
  
      var dow = now[6];
      dow--;
      
      // Sunday!
      if(dow < 0){
        // Make it last
        dow = 6;
      }
  
      // Mark the active day of the week
      weekdays.removeClass('active').eq(dow).addClass('active');
  
      // Set the am/pm text:
      ampm.text(now[7]+now[8]);
  
      // Schedule this function to be run again in 1 sec
      setTimeout(update_time, 1000);
  
    })();
  
  });

