<?php
$alias = array(
	'default' => 'URIComponent,URINameComponent,URIPathComponent,URIKeyValue,URI'
);

$depend = array(
	'URINameComponent' => 'URIComponent',
	'URIPathComponent' => 'URIComponent',
	'URIKeyValue'      => 'URIComponent',
	'URI'              => 'URIComponent'
);

$file = array(
	'URIComponent'     => '/URI/lib/URIComponent.js',
	'URINameComponent' => '/URI/lib/URINameComponent.js',
	'URIPathComponent' => '/URI/lib/URIPathComponent.js',
	'URIKeyValue'      => '/URI/lib/URIKeyValue.js',
	'URI'              => '/URI/lib/temp.js'
);



/**
 * Analyses <code>token</code> and puts all new file into <code>$location</code>
 * @global array   $alias
 * @global array   $depend
 * @global array   $file
 * @param  string &$token
 * @param  array  &$location
 * @param  array  &$dependent
 * @return void
 */
function resolve(&$token, array &$location, array &$dependent) {
	global $alias;
	global $depend;
	global $file;
	
	if ($location[$token]) return;
	
	if (key_exists($token, $alias)) {
		$str = explode(",", $alias[$token]);
		
		foreach ($str as $item) resolve($item, $location, $dependent);
		
		return;
	}
	
	if (key_exists($token, $dependent)) return;
	
	if (key_exists($token, $depend)) {
		$dependent[$token] = true;
		
		$str = explode(",", $depend[$token]);
		
		foreach ($str as $item) resolve($item, $location, $dependent);
	}
	
	$location[$token] = $file[$token];
}



header('Content-Type: text/javascript');

$token = explode(',', $_GET['content']);
$location = array(); $dependent = array();
$out = '';

foreach ($token as $item) resolve($item, $location, $dependent);

foreach ($location as $name) $out .= file_get_contents($_SERVER['DOCUMENT_ROOT'] . $name) . "\n\n\n\n\n";
	
print $out;
?>