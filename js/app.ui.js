App.ui = {
	init: function()
	{
		ArgMap.buildBaseMap();
		ArgMap.features.search.autocomplete('#searchBox');
		App.ui._initToolbar();
		ArgMap.externalLayers.ui.autocomplete('#layerSearchBox');
		ArgMap.externalLayers.ui.list.init('#layerListBox');
		ArgMap.Event.subscribe('features.search.autocomplete.select', App.ui.previewToponym);
		ArgMap.Event.subscribe('externalLayers.ui.autocomplete.select', App.ui.previewLayer);
		ArgMap.clickCollector.ui.init({
			showHideSwitch:'#clickMeister', //Element to toggle the container
			caption: 'Clicks: %', //el caption que va a tener el toggle, reemplaza % x la cantidad de clicks
			notifyClass:'success', //clase a agregar al toggle cuando haya un cambio
			container:'#clickCollectionContainer', //Element donde se van a meter los items
			containerTitle:'Registro de clicks',//titulo para poner en el anterior... no sirve, lo pones en el html
			cleanerElement: '#clearClickCollection', //dom element para borrar toda la coleccion
			toggleElement: '#collectorSwitcher' // dom element para on/off
		});
		/* estas son actions agregada, llevan el objeto jQuery y un callback
		* En el callback vamos a contar con un $(this).attr('data-index') que devuelve
		* el uniqueId del feature con el que queremos trabajar, y el metodo 
		* ArgMap.clickCollector.getFeatureByUniqueId() para traer la feature
		*/
		ArgMap.clickCollector.ui.addAction(
			$('<a href="#" class="itemActionCentrar">centrar</a>'),
			function(){
				ArgMap.map.panTo(ArgMap.collector.getItemByUniqueId($(this).attr('data-index')).lonlat);
				/*               ^^^^^^metodo para traer el feature^^^^^^^^-^^uniqueId asignado x cCui^-^property del feature */
				return false;// IMPORTANTE: para cancelar el default click del objeto
			}
		);
		ArgMap.clickCollector.ui.addAction(
			$('<a href="#">marcar</a>'),
			function(e){
				ArgMap.clickCollector.ui.mark($(this).attr('data-index'));
				return false;
			}
		);
		ArgMap.clickCollector.ui.addAction(
			$('<a href="#">+info</a>'),
			function(e){
				var p = ArgMap.collector.getItemByUniqueId($(this).attr('data-index'));
				p.revival.uniqueId = p.collectionUniqueId;
				ArgMap.getInfo.fromPixel(p.revival);
				return false;
			}
		);
		ArgMap.clickCollector.ui.marcarAlAgregar = true;
		
		ArgMap.ui.getInfoDialog.init();
		
		App.ui.resizeStuff();
		$(window).resize(function(){
			App.ui.resizeStuff();
		});
		$('form').submit(function() {
			return false;
		});
	},

	resizeStuff: function()
	{
		$('#mapcontainer').outerWidth( $('#mapcontainer').parent().innerWidth() );
		$('#mapcontainer').outerHeight( $(window).height() - $('#mapcontainer').offset().top - 20);


	},
	_initToolbar: function()
	{
		// para abrir y cerrar los dropdown de la barra
		// WHAT?!
		$("a.menu").click(function (e) {
			var $li = $(this).parent("li").toggleClass('open');
	    return false;
		});
		// again... WHAT?!?!
		$("#layersBoxButton").click(function(e) {
			App.ui.layersBox.toggle();
		});
	},
	previewLayer: function(layer)
	{
		layer.type = 'wms';
		layer.serverURL = layer.url;
		ArgMap.externalLayers.load( layer );
	},

	previewToponym: function(item)
	{
		var extent;

		extent = new OpenLayers.Bounds(item.left, item.bottom, item.right, item.top);
		/*
		 * ArgMap.map es un objeto OpenLayers.Map de OpenLayers
		 * Ver http://dev.openlayers.org/docs/files/OpenLayers/Map-js.html
		 */
		ArgMap.map.zoomToExtent(extent);
	}
	
};

