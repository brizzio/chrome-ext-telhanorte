var dados={}

var content = {

    page:"",
    url: {},

    init: function(){

        console.log("content.js: init router")
        //ROTEADOR
        //escuta por mensagens e redireciona para a função solicitada
        chrome.runtime.onMessage.addListener(function(request, sender,sendResponse){
            console.log("content.js recebeu: ", request, sender, sendResponse)
            if(request.fn in content){
                content[request.fn](request, sender,sendResponse)
            }
            return true;
        });

        
    },

    getScrapeResult: function(request, sender,sendResponse){
        console.log("background asks for: ",request)
        sendResponse(this.scrape());

    },

    setUrl: function(){
        var parser = document.createElement('a');
            parser.href = window.location.toString()

            this.url = {
            protocolo : parser.protocol, // => "http:"
            hostname :  parser.hostname, // => "example.com"
            port : parser.port,          // => "3000"
            path : parser.pathname,      // => "/pathname/"
            query : parser.search,       // => "?search=test"
            hash : parser.hash,          // => "#hash"
            host : parser.host,          // => "example.com:3000"
            secure:(parser.protocol==="https:"),
            url: parser.href  
            }
    },


    scrape: function(){
        
        console.log("scrape function called... ")
        var dados = {};
        
        this.setUrl()
        let produtos = document.getElementsByClassName("product--title_in")

            dados.is_product_page = (produtos.length === 1)
            
            dados.produto_descricao = produtos[0].textContent.trim()
            
            dados.is_promocao = (document.getElementsByClassName("pricing-title")[0].textContent.trim() === "De")
            
            dados.moeda = document.getElementsByClassName("price-currency")[0].textContent.trim()

            dados.preco_string = document.getElementsByClassName("price")[0].textContent.trim().replace(dados.moeda,"").trim()

            dados.preco_value = parseFloat(dados.preco_string.replace(",","."))

            dados.nivel_1 = document.querySelector('[id*="_liSecao"]').getElementsByTagName('a')[0].innerText

            dados.nivel_2 = document.querySelector('[id*="_liSubSecao"]').getElementsByTagName('a')[0].innerText

            dados.nivel_3 = document.querySelector('[id*="_liSubSubSecao"]').getElementsByTagName('a')[0].innerText

           return Object.assign({},this.url,dados);
        
    }
}

//start content
content.init();


/* window.addEventListener("load", function (event){
    //window.removeEventListener("load", load, false); //remove listener, no longer needed
    //enter here the action you want to do once loaded 
    console.log(event)
    dados = content.scrape();
    chrome.runtime.sendMessage({fn:"setPageScrapeResult",value:dados});
    
},false); */

