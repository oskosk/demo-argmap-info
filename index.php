<!DOCTYPE html> 
<html> 
    <head> 
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		<!-- Para que IE8 y IE9 procesen en modo estándar -->
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">

        <title>IDERA</title> 
        <!-- Importo el CSS de OL. Auto import no funciona con nuestra versión minified de OpenLayers.js--> 

		<link rel="stylesheet" type="text/css" href="css/style.css"/>

		<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js"></script>
		<script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.10/jquery-ui.min.js"></script> 
		<script src="http://api.ign.gob.ar/javascript.js?package=ArgMap"></script>
	
		<script src="js/app.js"></script> 
		<script src="js/app.ui.js"></script>
		<script src="js/app.ui.layersBox.js"></script>
		<script src="js/ArgMap.externalLayers.js"></script>
		<script src="js/ArgMap.externalLayers.ui.js"></script>
		<script src="js/ArgMap.getInfo.js"></script>
		<script src="js/ArgMap.ui.getInfoDialog.js"></script>
		<script type="text/javascript">
		jQuery(document).ready(function() {
			App.init();
		});
		</script>

    </head> 
    <body style="padding-top:40px"> 
		<div class="topbar" style="">
		  <div class="topbar-inner">
		    <div class="container fixed">
			  <h3><a class="logo"><span class="blueFont">Arg</span>Map</a></h3>

			  <ul>
				<li class="menu">
					<a id="" class="menu" href="#">Feedback</a>
					<ul class="menu-dropdown">
						<li><a id="layersBoxButton" href="#" >Reportar un error en el mapa base</a></li>
					</ul>
				</li>
			  </ul>

				  <form >
				<input type="text" placeHolder="Búsqueda de topónimos" id="searchBox"/>
			  </form>
			  <ul class="nav secondary-nav">
				<li>
					<form >
						<input type="text"  placeHolder="Buscar capas WMS en la IDE" id="layerSearchBox"/>
					</form>
				</li>
			    <li><a id="" href="#">Ayuda</a></li>
			    <li><button class="btn" style="margin-top:5px;" id="clickMeister" href="#">Clicks: 0</button></li>
			  </ul>
		    </div>
		  </div>
		</div>

		<div  class="container-fluid">
			<div class="sidebar">
				<div class="page-header">
				<h3>Capas de este mapa</h3>
				</div>
				<div class="row" id="layerListBox">

				</div>
				<!--
				<div class="popover-well" style="">
					<div class="popover-wrapper">
						<div class="popover below">
							<div class="arrow"></div>
							<div class="inner">
								<h3 class="title">Capas en este mapa</h3>
								<div id="layerListBox" class="content" style="max-height:450px;overflow:auto">
								</div>
							</div>
						</div>
					</div>
				</div>--><!-- popover para las capas -->
			</div>
			<div class="content">
				<div class="page-header">
				<h3>IDERA <small>Interoperabilidad entre servicios WMS</small></h3>
				</div>
				<div class="row" style="margin:0;">
					<div id="mapcontainer"></div>
				</div>	<!--row-->

				<div class="popover-well" id="clickCollectionContainer" style="">
					<div class="popover-wrapper">
						<div class="popover below">
							<div class="arrow"></div>
							<div class="inner">
								<h3 class="title">Popover Title</h3>
								<div class="clickCollectionToolbar">
									<a href="#" id="clearClickCollection">limpiar lista</a>
									<a href="#" id="collectorSwitcher">on/off</a>
								</div>
								<div class="content" style="max-height:450px;overflow:auto">
									<p class="defaultItem">A medida que haga clicks en el mapa quedarán registrados aquí.</p>
								</div>
							</div>
						</div>
					</div>
				</div><!-- popover para los clicks -->
				
				<div>

				</div>
			</div> <!--content-->
		</div> <!-- container -->

    </body> 
</html>
