document.addEventListener('DOMContentLoaded', function(){
  document.getElementById('newWallpaper').addEventListener('click',function(){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {myNewTab: "reset"});
    });
  });
}, false);