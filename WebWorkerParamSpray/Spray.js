var m_memory;
onmessage = function(e)
{
	var param = e.data;
    postMessage(param.id);
	while (1);
}
