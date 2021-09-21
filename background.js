// A2Z F17
// Daniel Shiffman
// http://shiffman.net/a2z
// https://github.com/shiffman/A2Z-F17

// This is the background script for the extension

//msg: global variable. 
//its always updated with the active message 
msg={}
var bg = {}
//bg['classificacao']=[]
var runningTab = 0 
var runningUrl = ''
var iter

function* generator(){
  yield 'https://www.telhanorte.com.br/';
  yield 'scrape-all';
  yield* bg.classificacao


}

var sites = [
  {
      id:1,
      nome:"Madeira Madeira",
      host:"www.madeiramadeira.com.br",
      img:"assets/img/madeiramadeira-logo.jpg"
  
  },
  {
      id:2,
      nome:"Telhanorte",
      host:"www.telhanorte.com.br",
      img:"assets/img/telhanorte.png"
  
  }
]



// A listener for when the user clicks on the extension button
chrome.browserAction.onClicked.addListener(buttonClicked);

// Handle that click
function buttonClicked(tab) {
  // Send a message to the active tab
  console.log("button clicked!");
  iter = generator()
  let host = iter.next().value
  runningTab = tab.id
  runningUrl = host
  console.log("vai fazer update na aba", runningTab);
  msg = {"message": iter.next().value}
  chrome.tabs.update(tab.id, { url: host } );

  
  // Send a message to the tab that is open when button was clicked
  //chrome.tabs.sendMessage(tab.id, {"message": "browser action"});
}



// Listening for messages
chrome.runtime.onMessage.addListener(receiver);

function receiver(request, sender, sendResponse) {
  console.log("background receiver function got: ",request);
  switch(request.type)
  {
    case "message":
          console.log("%s says > %s", sender.name, request.data)
          break;
    case "setVariable":
          bg[request.name]=JSON.parse(request.data)
          console.log(sender)
          console.log("%s sent variable: %s > payload > ", sender.origin, request.name)
          console.log(bg[request.name])
          break;
    case "classificador":
          bg[request.name]=JSON.parse(request.data)
          console.log(sender)
          console.log("%s sent variable: %s > payload > ", sender.origin, request.name)
          console.log(bg[request.name])
          console.log('vai chamar a primeira url da classificacao...')
          runningUrl = bg.classificacao[0].url
          console.log('vai chamar a primeira url da classificacao...', runningUrl)
          msg = {"message": "scan-produtos"}
          chrome.tabs.update(runningTab, { url: runningUrl } );
          break;
    case "products-page":
          bg[request.name]=JSON.parse(request.data)
            console.log("%s sent dados de produto: %s > payload > ", sender.origin, request.name)
            console.log(bg[request.name])
            
  }     
  
}


chrome.tabs.onActivated.addListener(function(activeInfo) {
  console.log(activeInfo);
  console.log("runningTab-->", runningTab);
  if(activeInfo.tabId == runningTab){
    let msg = {"message": "pinker"}
    console.log("podia mandar agora ...(" + activeInfo.tabId + ")=>>> ",msg);
  };
});


chrome.tabs.onUpdated.addListener(function (tabID, changeInfo, tab) {
  
  if (tab.status == 'complete' && tabID == runningTab && runningUrl) {
    console.log("Updated tab (" + tabID + ")=>>> ",tab.url);
    console.log("changeInfo (" + tabID + ")=>>> ",changeInfo )
    console.log('navigation completed... vou passar a mensagem');

    
    console.log("mensagem enviada...", msg);
    _messager(tabID, msg);
   
   
  }
});

function _messager(tid, message){

  console.log("messager message sent...", message);
  chrome.tabs.sendMessage(tid, message);

}