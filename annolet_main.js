
var $j = jQuery.noConflict();

annolet_main();

var annolet_btn;
// function to create annolet controls container
function annolet_createContainer() {
    // appending a CSS stylesheet to head of webpage
    var link = document.createElement('link');
    // using rawgit.com MaxCDN.. files directly linked to git repo 'annoletjs/master'
    link.href = "https://cdn.rawgit.com/SSS-Studio-development/annoletjs/master/annolet.css"; //random version number removed bcoz some browser take it as text file and not as CSS.
    link.type = "text/css";
    link.rel = "stylesheet";
    document.getElementsByTagName('head')[0].appendChild(link);

    // appending a div to body of webpage
    var body = document.getElementsByTagName('body')[0];
    var annolet_container = document.createElement('div');
    annolet_container.id = 'annolet-container';
    body.appendChild(annolet_container);
    //injecting html code
    document.getElementById('annolet-container').innerHTML = "<ul class=annolet-tools-menu><span style='border-radius:10px;  color:orange;font-weight:bold;font-family:monospace; font-size:1.3em'>AnnoLet!</span><span style='color:grey;'>|</span><li class=annolet-tools-menu-item id=addnote_btn onclick='annolet_btn=2;' >language</li><li class=annolet-tools-menu-item id=highlight-btn onclick='annolet_btn=1;'>highlight</li><li class=annolet-tools-menu-item id=save-btn>save</li><li class=annolet-tools-menu-item id=exit-btn onclick='annolet_btn=0;'>exit</li></ul>"; //HTML to create a list of options
}

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


var phonetic_trans = "default_value";
var language_trans = "default_value";

function get_phonetics(str){
  
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "//localhost:5000/phonetic-trans", true); // replace localhost afterwards.
  xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
  xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
  xhr.send(JSON.stringify({"sentence":str}));


  xhr.onreadystatechange = processRequest;

  function processRequest(e)
  {
    if (xhr.readyState == 4)
    {
      console.log('pho trans set');
      phonetic_trans = xhr.responseText;
    }
  }

}


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


//main function which will execute other functions
function annolet_main() {
  console.log('hello world annolet');
  annolet_createContainer();
    document.onclick = function(event) {
        if (event === undefined) {
            event = window.event;
        } // for IE
        var target = 'target' in event ? event.target : event.srcElement; // for IE
        var root = document.compatMode === 'CSS1Compat' ? document.documentElement : document.body;
        var xpath = anno_getXpathTo(target);
        if (annolet_btn === 1) {
            anno_highlight(xpath);
        }
      else if (annolet_btn === 2) {
            anno_language(xpath); 
        }
    };
}

//function to push objects to a stack.
var i = 1; //counter for id
var annolet_stack = []; //object will be pushed to this
function annolet_pushToStack(xpath, anno_content) {
    if (!anno_content) {
        anno_content = null;
    } //initializing anno_content to null if highlighting done.
    var annolet_obj = {
        authorname: 'raghav',
        id: i++,
        type: annolet_btn, //1 for highlight, 2 for annotation.
        content: anno_content, //would be null if highlighting is done only.
        xpath: xpath
    };
    // pushing data to stack
    annolet_stack.push(annolet_obj);
}



//function for highlighting element
function anno_highlight(xpath) {
  clicked_element = anno_getElementByXpath(xpath);
    //if element is already highlighted
    if (clicked_element.id == "mark" || clicked_element.id == "annolet") {
        console.log('not permitted');
    }
    else {
      // hightlight selected element and store it
      $j(anno_getElementByXpath(xpath)).wrapInner("<span id='mark' style='background:yellow;'></span>");
      annolet_insertIntoObject(xpath); // storing into object
    }
}




//function for getting phonetic
function anno_phonetic(xpath) {
    //if element is already translated
  if (anno_getElementByXpath(xpath).id != "phonetic" || !(anno_getElementByXpath(xpath).id)) {
    var text_to_translate = $j(anno_getElementByXpath(xpath)).html();
    get_phonetics(text_to_translate);
    var timer = window.setInterval
    (
      function ()
      {
        if(typeof phonetic_trans !== "default_value")
        {
          console.log("text changing");
          $j(anno_getElementByXpath(xpath)).text(phonetic_trans);
          phonetic_trans = "default_value";
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


//function for getting phonetic
function anno_language(xpath) {
  //if element is already translated
  if (anno_getElementByXpath(xpath).id != "language" || !(anno_getElementByXpath(xpath).id)) {
    var text_to_translate = $j(anno_getElementByXpath(xpath)).html();
    get_languagetrans(text_to_translate,'en','gu');
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
