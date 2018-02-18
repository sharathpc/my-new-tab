document.addEventListener('DOMContentLoaded', function(){

  chrome.storage.sync.get(function(_data){
    if(_data.freezeWallpaper != undefined && _data.freezeWallpaper == "true"){
      document.getElementById('freezeWallpaper').checked = true;
    }
  });

  /* Change Wallpaper click event */
  document.getElementById('newWallpaper').addEventListener('click',function(){
    var newWallpaper = this;
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {myNewTab: "reset"}, function(){
        newWallpaper.classList.add("rotateToggleFull");
        setTimeout(function(){
          newWallpaper.classList.remove("rotateToggleFull");
        }, 500);
      });
    });
  });

  /* Freeze Wallpaper click event */
  document.getElementById('freezeWallpaper').addEventListener('change',function(){
    var freeze = this;
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if(freeze.checked){
        chrome.tabs.sendMessage(tabs[0].id, {freezeWallpaper: "true"});
      }else{
        chrome.tabs.sendMessage(tabs[0].id, {freezeWallpaper: "false"});
      }
    });
  });
}, false);