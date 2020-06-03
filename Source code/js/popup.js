
$(document).ready(function(){
  var shortcutData = {};

  /* Get current active tab URL/Favicon/Title */
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    shortcutData = {
      url: tabs[0].url,
      icon: tabs[0].favIconUrl,
      title: tabs[0].title
    }; 
  });

  /* Check the URL instance in storage and update the Add/Delete icon */
  chrome.storage.sync.get(function(_data){
    if(_data.shortcutsList){
      $(_data.shortcutsList).each(function(index, item){
        if(item.url == shortcutData.url){
          $("#addShortcut, #addShortcut_content").hide();
          $("#removeShortcut").show();
          return false;
        }
      });
    }
  });

  /* Add Shortcut click event */
  $('#addShortcut').bind('click',function(){
    addShortcut(shortcutData);
  });

  /* Add Shortcut click event */
  $('#removeShortcut').bind('click',function(){
    removeShortcut(shortcutData);
  });

});

/* Add Shortcut function */
function addShortcut(_shortcutData){
  chrome.storage.sync.get(function(_data){
    if($("#shortcutName").val() != ""){
      _shortcutData.title = $("#shortcutName").val();
    }

    if(_data.shortcutsList){
      _data.shortcutsList.push(_shortcutData)
      chrome.storage.sync.set({'shortcutsList': _data.shortcutsList});
    }else{
      chrome.storage.sync.set({'shortcutsList': [_shortcutData]});
    }
    $("#addShortcut, #addShortcut_content").hide();
    $("#removeShortcut").show();
  });
}

/* Remove Shortcut function */
function removeShortcut(_shortcutData){
  chrome.storage.sync.get(function(_data){
    if(_data.shortcutsList){
      chrome.storage.sync.set({'shortcutsList': _data.shortcutsList.filter((item) => item.url !== _shortcutData.url)});
      $("#addShortcut, #addShortcut_content").show();
      $("#removeShortcut").hide();
    }
  });
}