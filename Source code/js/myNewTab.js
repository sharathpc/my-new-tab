const imageCategory = ['nature','wallpaper','places','computer','transportation','travel','buildings'];
const quoteCategory = ['movies','movies','movies','movies','movies','movies','movies','famous'];

var randomNumber = 0
  , wallpaperResponse = ''
  , quoteText = '';

$(document).ready(function(){
  //chrome.storage.sync.clear();
  assertData();
});

function assertData(){
  randomNumber = Math.floor(Math.random() * imageCategory.length+1);
  chrome.storage.sync.get(function(_data){
    if(_data.timeStamp != undefined && _data.wallpaperData.length>1 && parseInt(Math.abs(new Date()-new Date(_data.timeStamp))/3000) == 0){
      $('#preloader').show();
      _data.wallpaperData.slice(1,2);
      chrome.storage.sync.set({'wallpaperData': _data.wallpaperData});
      wallpaperResponse = _data.wallpaperData;
      quoteText = _data.quoteData;
      applyData();
      assertData();
    }else if(_data.timeStamp != undefined && _data.wallpaperData.length==1){
      requestImage(1)
    }else if(_data.timeStamp == undefined){
      requestImage(2)
    }else{
      $('#preloader').show();
      wallpaperResponse = _data.wallpaperData;
      quoteText = _data.quoteData;
      applyData();
    }
      chrome.storage.sync.set({'timeStamp': new Date().getTime()});
  });
}

function requestImage(_responseCount){
  $.ajax({
    url: "https://api.unsplash.com/photos/random",
    type: "get",
    headers: {"Accept-Version": "v1"},
    data: { 
      client_id: 'f8d843241ec749d581a9de34a8330a16c8fc02e5eb8bb7176d8179a3e78f0484',
      orientation: 'landscape',
      query: imageCategory[randomNumber],
      w: 1366,
      h: 637,
      count: _responseCount
    },
    success: function(response) {
      if(_responseCount == 2){
        chrome.storage.sync.set({'wallpaperData': response});
        wallpaperResponse = response;
        requestQuote(_responseCount);
      }else{
        chrome.storage.sync.get(function(_data){
          _data.wallpaperData.push(response[0]);
          chrome.storage.sync.set({'wallpaperData': _data.wallpaperData});
        });
      }
    },
    error: function(xhr) {}
  });
}

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
      //if(_responseCount == 2){
        chrome.storage.sync.set({'quoteData': JSON.parse(response)});
        quoteText = JSON.parse(response);
      /* }else{
        chrome.storage.sync.get(function(_data){
          chrome.storage.sync.set({'wallpaperData': _data.wallpaperData.push(response[0])});
        });
      } */
      $('#preloader').show();
      applyData();
    },
    error: function(xhr) {}
  });
}

function applyData(){
  $('body').css('background', 'url('+wallpaperResponse[0].urls.custom+')');
  $('#photographerInfo').attr('href','https://unsplash.com/@'+wallpaperResponse[0].user.username+'?utm_source=my_new_tab&utm_medium=referral').text(wallpaperResponse[0].user.name);
  $('#quote').text(quoteText.quote);
  $('#author').text('- '+quoteText.author);
  $('#preloader').hide();
  $('#content').show();
}

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

