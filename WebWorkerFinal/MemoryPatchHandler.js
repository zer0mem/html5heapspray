var HEAP_BLOCK_SIZE = (0x1000000 * 6);

var MEMORY_CHANGED = 0x666;

function MemoryChangeDetected(pos, ind)
{
	postMessage( { "id" : m_id, "cmd" : MEMORY_CHANGED, "pos" : pos, "ind" : ind } );
	return true;
	
	//or jsut patch back ?
	m_memory[pos + ind] = m_data[ind];
	return false;
}
