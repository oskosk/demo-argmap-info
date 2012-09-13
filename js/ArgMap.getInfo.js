/**
* @class ArgMap.getInfo
* <p>getInfo es una extensión para pedir información del mapa.<br />
*/
ArgMap.getInfo = {
	temp:null,
	/**
	* @event getInfo.preRequest
	* Se dispara justo antes de pedir la información a los servidores.
	*/
	PRE_REQUEST: 'getInfo.preRequest',
	/**
	* @event getInfo.postRequest
	* Se dispara cuando el/los request/s fueron hechos
	*/
	POST_REQUEST: 'getInfo.postRequest',
	
	/**
	* @property
	* @type Array
	* Si se provee un array de layers se buscará solo en esos layers. Por defecto se usan los layers del mapa.
	*/
	layers: null,
	/**
	* @cfg
	*/
	infoFormat: 'text/html',
	proxy: 'proxy.php?url=',
	maxFeatures: 10,
	/**
	* Pide información en base a un pixel del mapa.
	* Para pedir información de servidores WMS es necesario proveer el pixel y el bounding box
	* @param {Object} px Un objeto OpenLayers.Pixel
	* @param {Object} bb El BoundingBox del mapa al momento en que se consulta el pixel (px)
	*/
	fromPixel: function(contextData)
	{
		//si el object viene con un uniqueId, lo apendeamos, sino creamos uno
		contextData.id = contextData.uniqueId ? 'getInfo_Dialog_' + contextData.uniqueId : OpenLayers.Util.createUniqueID('getInfo_Dialog_');
		ArgMap.Event.fire('getInfo.preRequest',contextData);
		ArgMap.getInfo.request(contextData);
	},
	/**
	* Pide información en base a un par de coordenadas del mapa.
	* Para pedir información de servidores WMS es necesario proveer el bounding box
	* @param {Object} ll Un objeto OpenLayers.LonLat
	* @param {Object} bb El BoundingBox del mapa al momento en que se consulta el par de coordenadas (ll)
	*/
	fromLonLat: function(ll,bb)
	{
		ArgMap.Event.fire('getInfo.preRequest',{pixel:px,bounds:bb});
		return;
	},
    /**
     * Method: request
     * Sends a GetFeatureInfo request to the WMS
     * 
     * @param {OpenLayers.Pixel} clickPosition
	 * @param {OpenLayers.Bounds} Bbox
     */
    request: function(contextData) {
        var layers = ArgMap.getInfo._findLayers();
		var uniqueId = contextData.id;
		var urls = [];

        if(layers.length == 0)
		{
			ArgMap.Event.fire('getInfo.request',{id:id,wmsoptions:urls});
            // Reset the cursor.
			// esto es de la ui, que lo procese en el listener
            //OpenLayers.Element.removeClass(ArgMap.map.viewPortDiv, "olCursorWait");
            return false;
        }
        
		// this._text = '';
		// this._requestCount = 0;
		// this._numRequests = 0;
		// this.features = [];
		// group according to service url to combine requests
		var services = {}, url;
		for(var i=0, len=layers.length; i<len; i++) {
			var layer = layers[i];
			// console.log('layer in layers',layer);
			var service;
			url = layer.url instanceof Array ? layer.url[0] : layer.url;
			if(url in services) {
				services[url].push(layer);
			} else {
				if (url == ArgMap.PATH.CACHE) url = ArgMap.PATH.WMS;
				services[url] = [layer];
			}
		}
		var layers;
		for (var url in services) {
			layers = services[url];
			// console.log('layer in services',layers);
			var wmsOptions = ArgMap.getInfo._buildWMSOptions(url, layers, contextData, layers[0].params.FORMAT);
			var a = "";
			//OpenLayers.Request.GET(wmsOptions);
			// ArgMap.getInfo.temp = wmsOptions.params;
			for(var p in wmsOptions.params)
			{
				a += p + "=" + wmsOptions.params[p] + "&";
			}
			wmsOptions.requestUrl = OpenLayers.Util.urlAppend(wmsOptions.url,a);
			wmsOptions.requestId = OpenLayers.Util.createUniqueID(uniqueId + '_');
			wmsOptions.parentId = uniqueId;
			wmsOptions.wmsLayer = layers[0];
			urls.push(wmsOptions);
		}
		ArgMap.Event.fire('getInfo.request',{id:uniqueId,context:contextData,layers:urls});
    },
    /**
     * Method: findLayers
     * Internal method to get the layers, independent of whether we are
     *     inspecting the map or using a client-provided array
     */
    _findLayers: function() {

        var candidates = ArgMap.getInfo.layers || ArgMap.map.layers;
        var layers = [];
        var layer;
        for(var i=0, len=candidates.length; i<len; ++i) {
            layer = candidates[i];

            if(layer instanceof OpenLayers.Layer.WMS) {
                layers.push(layer);
            }
        }
        return layers;
    },
    /**
     * Method: buildWMSOptions
     * Build an object with the relevant WMS options for the GetFeatureInfo request
     *
     * Parameters:
     * url - {String} The url to be used for sending the request
     * layers - {Array(<OpenLayers.Layer.WMS)} An array of layers
     * pixel - {<OpenLayers.Pixel>} The position on the map where the mouse
     *     event occurred.
     * format - {String} The format from the corresponding GetMap request
	 * @param {OpenLayers.Bounds} bb
     */
    _buildWMSOptions: function(url, layers, contextData, format) {
        var layerNames = [], styleNames = [];
        for (var i = 0, len = layers.length; i < len; i++) { 
            layerNames = layerNames.concat(layers[i].params.LAYERS);
            styleNames = styleNames.concat(ArgMap.getInfo._getStyleNames(layers[i]));
        }
        var params = OpenLayers.Util.extend({
            service: "WMS",
            version: layers[0].params.VERSION,
            request: "GetFeatureInfo",
            layers: layerNames,
            query_layers: layerNames,
            styles: styleNames,
            bbox: contextData.mapBounds.toBBOX(null,layers[0].reverseAxisOrder()),
            feature_count: ArgMap.getInfo.maxFeatures,
            height: contextData.mapSize.h,
            width: contextData.mapSize.w,
            format: format,
            info_format: ArgMap.getInfo.infoFormat
        }, (parseFloat(layers[0].params.VERSION) >= 1.3) ?
            {
                crs: ArgMap.map.getProjection(),
                i: contextData.mapPixel.x,
                j: contextData.mapPixel.y
            } :
            {
                srs: ArgMap.map.getProjection(),
                x: contextData.mapPixel.x,
                y: contextData.mapPixel.y
            }
        );
		var p = ArgMap.getInfo.proxy ? ArgMap.getInfo.proxy : null;
        return {
            url: url,
            params: OpenLayers.Util.upperCaseObject(params),
			proxy: p,
			async: true
            // scope: ArgMap
            // callback: function(request) {
				// console.log('callback says:',request);
                // ArgMap.getInfo._handleResponse(pixel, request);
            // },
        };
    },
	_handleResponse:function(px,request)
	{
		// console.log(px,request);
	},
    /**
     * Method: _getStyleNames
     * Gets the STYLES parameter for the layer. Make sure the STYLES parameter
     * matches the LAYERS parameter
     * 
     * Parameters:
     * layer - {<OpenLayers.Layer.WMS>}
     *
     * Returns:
     * {Array(String)} The STYLES parameter
     */
    _getStyleNames: function(layer) {
        // in the event of a WMS layer bundling multiple layers but not
        // specifying styles,we need the same number of commas to specify
        // the default style for each of the layers.  We can't just leave it
        // blank as we may be including other layers that do specify styles.
        var styleNames;
        if (layer.params.STYLES) {
            styleNames = layer.params.STYLES;
        } else {
            if (layer.params.LAYERS instanceof Array) {
                styleNames = new Array(layer.params.LAYERS.length);
            } else { // Assume it's a String
                styleNames = layer.params.LAYERS.replace(/[^,]/g, "");
            }
        }
        return styleNames;
    },
};
