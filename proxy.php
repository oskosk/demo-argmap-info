<?
//die("<pre>".print_r($_SERVER['QUERY_STRING'],true)."</pre>");
$origin = $_GET['url'];
$isOwnLayer = strpos($origin,'ign.gob.ar') !== false;
// if($isOwnLayer === false)
// {
	// die('Capa no del IGN');
	$origin = parse_url($origin);
	parse_str($origin['query'],$params);
	// descomentar esta linea para no traer data HTML, pero formosa (x ejemplo) no devuelve text/html
	// if(isset($params['INFO_FORMAT']) && $params['INFO_FORMAT'] == "text/html") $params['INFO_FORMAT'] = "text/plain";
	$newDestination = "?";
	foreach($params as $k=>$v)
	{
		$newDestination .= $k . "=" . urlencode($v) . "&";
	}
	$newDestination = $origin['scheme'] . "://" . $origin['host'] . $origin['path'] . $newDestination;
// }
//$ref = $_SERVER['HTTP_REFERER'];
// if ($ref == 'http://mapa.ign.gob.ar/' || $ref=='http://wms.ign.gob.ar/' ) {
	// $s = @file_get_contents($_GET['url']);
	$s = @file_get_contents($newDestination);
	echo $s;
// } else {
	// die();
// }

?>
