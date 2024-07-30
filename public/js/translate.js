(function () {
    var e = document.createElement("script");
    e.type = "text/javascript";
    e.async = true;
    e.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    var a = document.getElementsByTagName("script")[0];
    a.parentNode.insertBefore(e, a);
})();

        function googleTranslateElementInit() {
            new google.translate.TranslateElement({
                pageLanguage: '<%= language[0].code %>',
                includedLanguages: '',
            }, 'translater');
        }

function applyCustomStyles() {
  var iframe = document.querySelector("iframe.VIpgJd-ZVi9od-xl07Ob-OEVmcd");
  if (iframe) {
    var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    var style = document.createElement("style");
    style.textContent = `
            .VIpgJd-ZVi9od-vH1Gmf {
                text-align: center!important;
            }

            .indicator{
                display: none !important;
            }

              .VIpgJd-ZVi9od-vH1Gmf-ibnC6b{
            border-radius: 8px !important;
            width: 400px !important;
        }

        VIpgJd-ZVi9od-vH1Gmf{
            display: none !important; 
        }

            VIpgJd-ZVi9od-vH1Gmf-ibnC6b div:hover {
                background-color: #f1f1f1;
            }

            .VIpgJd-ZVi9od-l4eHX-hSRGPd{
                display: none !important;
            }
        `;
    iframeDoc.head.appendChild(style);
  } else {
    setTimeout(applyCustomStyles, 500);
  }
}

// Function to correct wrong translations in the DOM
function correctTranslations() {
    var wrongWords = {
        "The soup": "Soup",
        "beverages": "Beverages",
        "Warm starters": "Warm Appetizers",
        "girl": "grill",
        "Hauptgang": "Hauptgerichte",
        // Add more mappings as needed
    };

    function traverseNodes(node) {
        if (node.nodeType === 3) { // Text node
            var text = node.nodeValue;
            for (var wrongWord in wrongWords) {
                var correctWord = wrongWords[wrongWord];
                var regex = new RegExp(wrongWord, 'g');
                text = text.replace(regex, correctWord);
            }
            node.nodeValue = text;
        } else if (node.nodeType === 1) { // Element node
            for (var i = 0; i < node.childNodes.length; i++) {
                traverseNodes(node.childNodes[i]);
            }
        }
    }

    traverseNodes(document.body);
}






// Wait for the iframe to load and then apply styles
window.addEventListener("load", function () {
  setTimeout(function(){
    applyCustomStyles();
  }, 500);
});


// Wait for the iframe to load and then apply styles
window.addEventListener("change", function () {
    setTimeout(function(){
        correctTranslations();
    }, 500);
  });