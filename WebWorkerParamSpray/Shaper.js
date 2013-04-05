onmessage = function(e)
{
	var param = e.data;
	
    if (param.data.length)
    {
		//first 0x20b is header, 0xE0 align to 0x100
        for (var pos = param.skipped; pos < param.img.data.length; pos = param.skipped + ((pos + param.data.length + param.alig) & (~param.alig)))
        {
            for (var i = 0; i < param.data.length; i++)
				param.img.data[pos + i] = param.data[i];
			break;
        }
    }

    postMessage(param.img);
}
