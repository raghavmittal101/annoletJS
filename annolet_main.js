
var $j = jQuery.noConflict();

// function to get Xpath to passed element
function anno_getXpathTo(element) {
    if (element.id !== '') {
        return "//*[@id='" + element.id + "']";
    }
    if (element === document.body) {
        return "html/" + element.tagName.toLowerCase();
    } //added 'html/' to generate a valid Xpath even if parent has no ID.
    var ix = 0;
    var siblings = element.parentNode.childNodes;
    for (var i = 0; i < siblings.length; i++) {
        var sibling = siblings[i];
        if (sibling === element) {
            return anno_getXpathTo(element.parentNode) + '/' + element.tagName.toLowerCase() + '[' + (ix + 1) + ']';
        }
        if (sibling.nodeType === 1 && sibling.tagName === element.tagName) {
            ix++;
        }
    }
}

// function to evaluate element from Xpath
function anno_getElementByXpath(xpath) {
    return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

//------------------------------------------------------------------------
var language_trans = "default_value";

function get_languagetrans(str,fr,to){

  var xhr = new XMLHttpRequest();
  xhr.open("POST", "//localhost:5000/language-translive", true); // replace localhost afterwards
  xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
  xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
  xhr.send(JSON.stringify({"sentence":str,"from-language":fr,"to-language":to}));

  xhr.onreadystatechange = processRequest;

  function processRequest(e)
  {
    if (xhr.readyState == 4)
    {
      console.log('language trans set');
      language_trans = xhr.responseText;
    }
  }

}




//function for getting phonetic
function anno_language(xpath) {
  var clicked_element = anno_getElementByXpath(xpath);
  //if element is already highlighted
  if (clicked_element.id == "mark" || clicked_element.id == "annolet") {
      console.log('not permitted');
  }
  else {
  //if element is already translated
  if (anno_getElementByXpath(xpath).id != "language" || !(anno_getElementByXpath(xpath).id)) {
    var text_to_translate = $j(anno_getElementByXpath(xpath)).html();
    get_languagetrans(text_to_translate,'en','hi');
    var timer = window.setInterval
    (
      function ()
      {
        if(typeof language_trans !== "default_value")
        {
          console.log("text changing");
          $j(anno_getElementByXpath(xpath)).text(language_trans);
          language_trans = "default_value";
          window.clearInterval(timer);
        }
        else
        {
          console.log("returned without change");
        }
      }
      ,1000
    );
  }
  else {
        console.log('already translated');
    }
  }
}

//------------------------------------------------------------------------



//main function which will execute other functions
function run_langtrans() {
    document.onclick = function(event) {
        if (event === undefined) {
            event = window.event;
        } // for IE
        var target = 'target' in event ? event.target : event.srcElement; // for IE
        var root = document.compatMode === 'CSS1Compat' ? document.documentElement : document.body;
        var xpath = anno_getXpathTo(target);
          anno_language(xpath);
    };
}
