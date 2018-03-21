/* Get URL and Update the extension disable/enable state */
chrome.tabs.onHighlighted.addListener(function (tabs){
    chrome.tabs.get(tabs.tabIds[0], function (data){
        if(data.url.indexOf("http")==-1 || data.url.indexOf("https")==-1){
            setTimeout(function(){
                chrome.browserAction.disable(data.id);
            },50);
        }
    });
});