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
function anno_rtag(xpath)
{
  var clicked_element = anno_getElementByXpath(xpath);
  var span = document.createElement("span");
  var prop = document.createAttribute("property");
  if (window.getSelection().toString().length!==0) {
    
        var link = document.createElement("link");
    var rel = document.createAttribute("rel");
    rel.value = "stylesheet";
    var href = document.createAttribute("href");
    href.value = "https://code.jquery.com/ui/1.8.24/themes/smoothness/jquery-ui.css";
    link.setAttributeNode(rel);
    link.setAttributeNode(href);
    var head = document.getElementsByTagName("head");
        head[0].appendChild(link);

    $j(head).append('<script src="http://code.jquery.com/jquery-1.11.1.min.js"></script>' );
    
    $j("#dialog").dialog({
      
      autoOpen: true,
      buttons: {
        
        Date: function() { 
          
          alert("Date!");
          prop.value = "Date";
          $j(this).dialog("close"); 
        },
        Currency: function() { 
          
          alert("Currency");
          prop.value = "Currency";
          $j(this).dialog("close"); 

        },
        Unit: function() { 
          
          alert("Unit");
          prop.value = "Unit";
          $j(this).dialog("close"); 
        }
        
      },
      width: "400px"
      
    });

    var div1 = document.createElement("div");
    var id = document.createAttribute(id);
    id.value="dialog";
    div1.setAttributeNode(id);
    clicked_element.appendChild(div1);
    
    span.setAttributeNode(prop);
    var sel = window.getSelection();
    if (sel.rangeCount) {
      var range = sel.getRangeAt(0).cloneRange();
      range.surroundContents(span);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }  
}
//------------------------------------------------------------------------



//main function which will execute other functions
function do_tagging() {
    document.onclick = function(event) {
        if (event === undefined) {
            event = window.event;
        } // for IE
        var target = 'target' in event ? event.target : event.srcElement; // for IE
        var root = document.compatMode === 'CSS1Compat' ? document.documentElement : document.body;
        var xpath = anno_getXpathTo(target);
          anno_rtag(xpath);
    };
}
