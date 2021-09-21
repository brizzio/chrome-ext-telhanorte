var console = chrome.extension.getBackgroundPage().console;

var sites = [
    {
        nome:"Madeira Madeira",
        host:"www.madeiramadeira.com.br",
        img:"assets/img/madeiramadeira-logo.jpg"
    
    },
    {
        nome:"Telhanorte",
        host:"www.telhanorte.com.br",
        img:"assets/img/telhanorte.png"
    
    }
]


console.log("popup script loaded and ready...")

var app = {

    init: function(){
        
        console.log("app started")
        //carrega a pagina do popup
        //document.getElementById("main").appendChild(buildHtml())
        //cacheia a referencia aos elementos do html
        //$urlInput = document.getElementById("url-input")
        $tnBtn = document.getElementById("btn-1")
        $mmBtn = document.getElementById("btn-2")
        //$tabBtn = document.getElementById("tab-btn")

        //veerifica tem url definida 
        chrome.runtime.sendMessage({fn:"getUrl"}, function(response){
            console.log("popup reecebeu resposta:", response)
            //$urlInput.value = response
        });

        $tnBtn.addEventListener("click", function(){
            console.log("acionou telha norte...")
            //chrome.runtime.sendMessage({fn:"setHost", host: sites[1].host})
            navigateTo(sites[1].host)
        });

        $mmBtn.addEventListener("click", function(){
            console.log("acionou madeira madeira...")
            chrome.runtime.sendMessage({fn:"setHost", host: sites[0].host})
            //chrome.runtime.sendMessage({fn:"setUrl", url: $urlInput.value})
        });

       /*  $tabBtn.addEventListener("click", function(){
            console.log("acionou tab-btn...")
            window.open(chrome.runtime.getURL('pages/report.html'),'_newtab');
        });  */
    
    }

}

//start app
document.addEventListener("DOMContentLoaded", function(){app.init()})

var bgPage = chrome.extension.getBackgroundPage();

function navigateTo(url){
    bgPage.browser.tabs.create({url: url}).then(() => {
        bgPage.browser.tabs.executeScript({
        code: `
        var pgn = window.location.href
        console.log('location:', pgn);`
        });
    });
}

