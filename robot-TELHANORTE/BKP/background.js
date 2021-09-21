console.log("background script loaded and ready...");

var scrapeTabId;

var background = {

    url:"",
    dados:{},
    ready:false,
    host:"",
    hostTab:"",

    init: function(){

        //ROTEADOR
        //escuta por mensagens e redireciona para a função solicitada
        chrome.runtime.onMessage.addListener(function(request, sender,sendResponse){
            console.log("mensagesm recebida", request, sender, sendResponse)
            if(request.fn in background){
                background[request.fn](request, sender,sendResponse)
            }
            return true;
        });
    },

    setHost: function(request, sender, sendResponse){
        console.log("definindo o Host ", request.host)
        this.host = request.host
        this.ready = false
        gotoSite(request.host)
        
    },

    setUrl: function(request, sender, sendResponse){
        console.log("definindo a url: ", request.url)
        this.url = request.url
        this.ready = false
        this.navigate()
        
    },

    setPageScrapeResult:function(request, sender, sendResponse){
        console.log("recebendo scrape do content js: ", request.value)
        this.dados = request.value
    },

    setPageReadyState:function(request, sender, sendResponse){
        console.log("ready: ", request.value)
        this.ready = request.value
    },

    getUrl: function(request, sender, sendResponse){
        console.log("respondendo a url: ", this.url)
        sendResponse(this.url);
    },

    navigate: function(){
        console.log("navegando: ", this.url)
        /* chrome.tabs.query( { active: true, currentWindow: true }, function( tabs ) {
            this.tabId = tabs[0].id
            console.log("aba: ", this.tabId )
            chrome.tabs.update( tabs[0].id, { url: this.url } ); 
          }); */
          chrome.tabs.update( { url: this.url } ); 
          console.log("tab: ", tabId)
    }


}


function gotoSite(site){
    var toUrl = "https://" + site
    console.log("navegando para o host: ", toUrl)
          chrome.tabs.create( { url: toUrl } ); 
          chrome.tabs.query( { active: true, currentWindow: true }, function( tabs ) {
            console.log("nova aba: ", tabs[0].id)
            background.hostTab = tabs[0].id
          }); 
          

}


chrome.tabs.onActivated.addListener(function(activeInfo) {
  tabId = activeInfo.tabId;
});

chrome.tabs.onUpdated.addListener(function (tabID, changeInfo, tab) {
    console.log("Updated tab (" + tabID + ")=>>> " + tab.url);
    console.log("changeInfo (" + tabID + ")=>>> ")
    console.log(changeInfo);
    //chrome.tabs.sendMessage(tabID, { name: 'Chrome Tabs updated >>>>>> ' + tab.url });
    if (tab.status == 'complete' && tab.url.startsWith(background.url)) {
     console.log('navigation completed...');
     chrome.tabs.sendMessage(tabID, {fn: "getScrapeResult"}, function(response) {
        if (!chrome.runtime.lastError) {
            // do you work, that's it. No more unchecked error
            console.log("content response: ", response)
          }
         
     });
     
    }
});

//startup
background.init();