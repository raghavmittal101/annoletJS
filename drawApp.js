var $j = $.noConflict;

function injectAndCall(){
    
    webSketch.inject();
    $j(window).load(
        function(){
    webSketch.canvasSizeHandler.initDimensions();  /* Set inital dimensions according to Window size */
    webSketch.createCanvas(); /* render canvas */
        }
    );
                 
};


var webSketch = {}; /*namespace*/

webSketch.inject = function(){
    var script = document.createElement('script');
    var head = document.getElementsByTagName('head')[0];

    /*injecting jQuery into <HEAD>*/
    script.src="//code.jquery.com/jquery-2.2.4.min.js";
    head.appendChild(script);

    var script = document.createElement('script');
    var head = document.getElementsByTagName('head')[0];
    /*injecting FabricJS into <HEAD>*/
    script.src = "//cdnjs.cloudflare.com/ajax/libs/fabric.js/1.6.3/fabric.min.js";
    head.appendChild(script);
}

webSketch.canvasSizeHandler = {
    height: 0,
    width: 0,
    initDimensions: function(){ 
        var body = document.body,
        html = document.documentElement;

         /*will get height of whole webpage
         ERROR: not working with Chrome.*/
        this.height = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );

        // will get width of whole webpage
        this.width = Math.max( body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth );
   }
};

// main script which will create container for canvas and set its properties. and add convas element to DOM.
webSketch.createCanvas = function(){
    

    // creating container div for convas and satting its height and width to overlay whole webpage.
    var canvasContainer = document.createElement('div');
    canvasContainer.id = 'canvasContainer';
    canvasContainer.style.position = 'absolute';
    canvasContainer.style.top = '-1px';
    
    var canvasElement = document.createElement('canvas');
    canvasElement.id="sheet";
    canvasContainer.appendChild(canvasElement);

    var body = document.getElementsByTagName('body')[0];
    body.appendChild(canvasContainer);
    body.appendChild(canvasContainer,document.body.childNodes[0]);

    // creating canvas with ID=sheet
    webSketch.canvas = new fabric.Canvas('sheet');
    
    // assigning convas height
    webSketch.canvas.setHeight(webSketch.canvasSizeHandler.height);
    webSketch.canvas.setWidth(webSketch.canvasSizeHandler.width);
    
    // other settings
    webSketch.canvas.isDrawingMode = true;
    webSketch.canvas.freeDrawingBrush.width = 3;
    webSketch.canvas.freeDrawingBrush.color = "#005df2";

};


// changes size of canvas to fit in webpage perfectly, whenever windows size is changed
// ERROR: size only increases but do not decrease
// size of canvas doubles on decreasing window size
window.onresize = function(){
    webSketch.canvasSizeHandler.initDimensions();
    webSketch.canvas.setHeight(webSketch.canvasSizeHandler.height);
    webSketch.canvas.setWidth(webSketch.canvasSizeHandler.width);
    webSketch.canvas.renderAll();
    $j('#canvas-container').css("width",webSketch.canvasSizeHandler.width);
    $j('#canvas-container').css("height",webSketch.canvasSizeHandler.width);
};

/* TOOLS for drawing */
webSketch.tools = {};
webSketch.tools.eraser = function(){
    webSketch.canvas.isDrawingMode = false;
    window.onclick = function(){
        webSketch.canvas.remove(webSketch.canvas.getActiveObject());
    };
};

webSketch.tools.pen = function(color, width){
    webSketch.canvas.isDrawingMode = true;
    webSketch.canvas.freeDrawingBrush.color = color;
    webSketch.canvas.freeDrawingBrush.width = width;
};

webSketch.tools.hideCanvas = function(){
    var nodes = document.getElementById("canvasContainer").getElementsByTagName('*');
    for(var i = 0; i < nodes.length; i++){
        $j(nodes[i]).attr("hidden", true)}
}

webSketch.tools.showCanvas = function(){
    var nodes = document.getElementById("canvasContainer").getElementsByTagName('*');
    for(var i = 0; i < nodes.length; i++){
        $j(nodes[i]).attr("hidden", false)}
}

/*----------------funtions for controlling HTML menu-------*/
/* showing and hiding menu */
webSketch.menu = {};
webSketch.menu.hide = function(){
    $j('.draw-app-list-container').attr("hidden",true);
}
webSketch.menu.show = function(){
    $j('.draw-app-list-container').attr("hidden",false);
}