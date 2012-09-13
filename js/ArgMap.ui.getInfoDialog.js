/**
* @class ArgMap.ui.getInfoDialog
* @extends ArgMap.ui
* @author Instituto Geográfico Nacional
* @version 1.0
*/
ArgMap.ui.getInfoDialog = {
	boxWidth: 600,
	boxHeight: 400,
	init: function(options)
	{
		ArgMap.Event.subscribe('getInfo.preRequest',ArgMap.ui.getInfoDialog.preRequestHandler);
		ArgMap.Event.subscribe('getInfo.request',ArgMap.ui.getInfoDialog.requestHandler);
	},
	preRequestHandler: function(request)
	{
		OpenLayers.Element.addClass(ArgMap.map.viewPortDiv, "olCursorWait");
	},
	requestHandler: function(request)
	{
		// console.log(request);
		var id = request.id;//id del request, no confundir con el id del wms url
		var requests = request.layers;
		if(requests.length < 1)
		{
			// console.log(requests.length);
			//cuando esta todo listo, removemos el wait del mapa
			OpenLayers.Element.removeClass(ArgMap.map.viewPortDiv, "olCursorWait");
			return false;
		}
		
		var d = $('<div id="' + id + '" />').css('padding',0);
		var t = $('<div />').css({'padding':0,'border':0});
		var tu = $('<ul />');
		d.dialog({
			height:ArgMap.ui.getInfoDialog.boxHeight,
			width:ArgMap.ui.getInfoDialog.boxWidth,
			close: function(event,ui){
				$(this).remove();
			}
		});
		d.append(t);
		t.append(tu);
		for(var i = 0; i < requests.length;i++)
		{
			var attribs = ArgMap.ui.getInfoDialog._getAttribsForLayer(requests[i].wmsLayer);
			// console.log(attribs);
			var tab = $('<li><a href="#' + requests[i].requestId + '">' + attribs.title + '</a></li>');
			var tabContent = $('<div></div>');
			tabContent.attr('id',requests[i].requestId);
			var frame = $('<iframe />').css({
				border: '0px solid green',
				width: '100%',
				height: '290px'
			});
			tu.append(tab);
			t.append(tabContent);
			tabContent.append(frame);
			frame.attr('src','http://mapa.ign.gob.ar/apps/info/img16.gif');
			frame.attr('src',requests[i].requestUrl);
			// console.log(requests[i]);
		}
		t.tabs();
		OpenLayers.Element.removeClass(ArgMap.map.viewPortDiv, "olCursorWait");
	},
	_getAttribsForLayer:function(layer)
	{
		if(layer.isBaseLayer)
		{
			return {title:layer.attribution,description:layer.name,from:null};
		}
		var ret = {title:null,description:null,from:null};
		var fineWmsLayer = layer.loadedFrom instanceof Object ? layer.loadedFrom : null;
		if(fineWmsLayer)
		{
			//deberia hacer un cascade de valores aca:
			//abstract => human readable
			//label => full title
			//name => server name, por lo general, encoded/camelized
			//proposedName => osk was here, deberia usar esta
			//title => nombre corto, por lo general human readable
			//servername => el nombre del server que provee el dato, no se si no lo hicimos con osk esto
			ret.title = fineWmsLayer.proposedName;
			ret.description = fineWmsLayer.proposedName;
			ret.from = fineWmsLayer.servername;
		}else{
			ret.title = layer.name;
			ret.description = layer.params.LAYERS[0];
			ret.from = layer.url;
		}
		return ret;
	},
	_createIframe: function()
	{
		
	}
}
