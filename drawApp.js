/*
	structure
	namespace -> webSketch
	Websketch
		inject
            jsLibraries
            menu
		canvasSizeHandler
			height
			width
			initDimensions()
		tools
			pen()
			hideCanvas()
			showCanvas()
			eraser()
			show JSON
			Load from JSON
		menu
			hide()
			show()
        window.onresize change width of canvas
*/


	// script will load fabric js and trigger other functions. needs JQuery v >= 1.0
	$.getScript("//cdnjs.cloudflare.com/ajax/libs/fabric.js/1.6.3/fabric.min.js", function(){
		console.log('running scripts');
		webSketch.canvasSizeHandler.initDimensions();  /* Set inital dimensions according to Window size */
		webSketch.createCanvas(); /* render canvas */
		webSketch.inject.menu();
		webSketch.menu.show();
		});
    console.log('done');


var webSketch = {}; /*namespace*/
webSketch.inject = {};
webSketch.inject.jsLibraries = function(){
	console.log('injecting javascript libraries');
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
    
};
webSketch.inject.menu = function(){
	console.log('injecting menu');
    var body = document.getElementsByTagName('body')[0];
    var div = document.createElement('div');
    div.id = "draw-app-list-container";
    div.className = ".draw-app-list-container";
    div.innerHTML =
    '<ul id="draw-app-list" style="z-index:99">'+
        '<li id="draw-app-list" onclick="webSketch.tools.pen("#000000", 2)">Pen</li> <!-- default value given.. ui will be added later -->'+
        '<li id="draw-app-list" onclick="webSketch.tools.eraser()">Eraser</li>'+
        '<li id="draw-app-list" onclick="webSketch.canvas.clear()">Clear Canvas</li>'+
        '<li id="draw-app-list" onclick="webSketch.tools.showCanvas()">Show Canvas</li>'+
        '<li id="draw-app-list" onclick="webSketch.tools.hideCanvas()">Hide Canvas</li>'+
        '<li id="draw-app-list" onclick="webSketch.tools.showJSON()">show JSON</li>'+
        '<li id="draw-app-list" onclick="webSketch.tools.loadFromJSON()">Load from JSON</li>'
        '</ul>';
    body.appendChild(div);
    webSketch.menu.hide();
    
    var head = document.getElementsByTagName('head')[0];
    var link = document.createElement('link');
    link.rel="stylesheet";
    link.type="text/css";
    link.href="//rawgit.com/raghavmittal101/webservices/webDraw/drawMenu.css?v="+parseInt(Math.random()*1000);
    head.appendChild(link);
};

webSketch.canvasSizeHandler = {
    height: 0,
    width: 0,
    initDimensions: function(){ 
		console.log('getting dimensions of screen');
        var body = document.body;
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
    console.log('creating canvas');
    var canvasContainer = document.createElement('div');
    canvasContainer.id = 'canvasContainer';
    canvasContainer.style.position = 'absolute';
    canvasContainer.style.top = '-1px';
    canvasContainer.style.zIndex = 98;
    
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
    //webSketch.canvas.setHeight(webSketch.canvasSizeHandler.height);
    webSketch.canvas.setWidth(webSketch.canvasSizeHandler.width);
    webSketch.canvas.renderAll();
    $('#canvas-container').css("width",webSketch.canvasSizeHandler.width);
    //$('#canvas-container').css("height",webSketch.canvasSizeHandler.height);
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
        $(nodes[i]).attr("hidden", true);}
};

webSketch.tools.showCanvas = function(){
    var nodes = document.getElementById("canvasContainer").getElementsByTagName('*');
    for(var i = 0; i < nodes.length; i++){
        $(nodes[i]).attr("hidden", false);}
};

webSketch.tools.showJSON = function(){
	var json = JSON.stringify(webSketch.canvas.toJSON());
	prompt("JSON data", json);
};

webSketch.tools.loadFromJSON = function(){
	var json = prompt("enter JSON");
	webSketch.canvas.loadFromJSON(JSON.parse(json));
	webSketch.canvas.renderAll();
};

/*----------------funtions for controlling HTML menu-------*/
/* showing and hiding menu */
webSketch.menu = {};
webSketch.menu.hide = function(){
    $('.draw-app-list-container').attr("hidden",true);
};
webSketch.menu.show = function(){
    $('.draw-app-list-container').attr("hidden",false);
};
