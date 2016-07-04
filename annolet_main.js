
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

function anno_audio(xpath)
{
  if (window.getSelection().toString().length!==0) {
    console.log("inside audio");
    var clicked_element = anno_getElementByXpath(xpath);
    var node = document.createElement("audio");
    var prop1 = document.createAttribute("src");
    var prop2 = document.createAttribute("controls");
    var prop3 = document.createAttribute("autoplay");
    var prop4 = document.createAttribute("id");
    var string1 = "https://api.voicerss.org/?key=24041d6a5a6c4f0db89edfbff791e8cb&src=";
    var string2 = window.getSelection().toString();
    var string3 = "&hl=en-in";
    var str = string1.concat(string2,string3);
    prop1.value = str;
    prop4.value = "uniqueid";
    node.setAttributeNode(prop1);
    node.setAttributeNode(prop2);
    node.setAttributeNode(prop3);
    node.setAttributeNode(prop4                         );
    clicked_element.appendChild(node);
    document.getElementById("uniqueid").remove();
    
  }
}

//------------------------------------------------------------------------


function listenOnSelection(){
  //main function which will execute other functions
    document.onclick = function(event) {
      console.log("mouse down hello");
      event.preventDefault();
      if (event === undefined) {
        event = window.event;
      } // for IE
      var target = 'target' in event ? event.target : event.srcElement; // for IE
      var root = document.compatMode === 'CSS1Compat' ? document.documentElement : document.body;
      var xpath = anno_getXpathTo(target);
        anno_audio(xpath);
  
    };
}
