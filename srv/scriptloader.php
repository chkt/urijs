<?php
$alias = array(
	'default' => 'URIComponent,URINameComponent,URIPathComponent,URIKeyValue,URI'
);


$file = array(
	'URIComponent'     => '/URI/lib/URIComponent.js',
	'URINameComponent' => '/URI/lib/URINameComponent.js',
	'URIPathComponent' => '/URI/lib/URIPathComponent.js',
	'URIKeyValue'      => '/URI/lib/URIKeyValue.js',
	'URI'              => '/URI/lib/temp.js'
);


function resolve($token, array &$location) {
	global $alias;
	global $file;
	
	if (key_exists($token, $alias)) {
		$str = explode(",", $alias[$token]);
		
		foreach ($str as $item) resolve($item, $location);
		
		return;
	}
	
	$location[$token] = $file[$token];
}


header('Content-Type: text/javascript');

$token = explode(',', $_GET['content']);
$location = array();

foreach ($token as $item) resolve($item, $location);
	
foreach ($location as $name) {
	print file_get_contents($_SERVER['DOCUMENT_ROOT'] . $name);
}
?>