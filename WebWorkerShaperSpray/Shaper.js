onmessage = function(e)
{
	var param = e.data;
	
	var buff = param.img.data;
    if (param.data.length)
    {
		//first 0x20b is header, 0xE0 align to 0x100
        for (var pos = param.skipped; pos < buff.length; pos = param.skipped + ((pos + param.data.length + param.alig) & (~param.alig)))
        {
            for (var i = 0; i < param.data.length; i++)
				buff[pos + i] = param.data[i];
			break;
        }
    }

    postMessage(param.img);
}
