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
	'URI'              => '/URI/lib/URI.js'
);

$cache = '/URI/cache/';




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
	
	if (key_exists($token, $location)) return;
	
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


function readCache(&$cache, &$location, &$target) {
	if (!file_exists($cache)) return false;
	
	$time = filemtime($cache);
	
	foreach ($location as $name) {
		$name = $_SERVER['DOCUMENT_ROOT'] . $name;
		
		if (!file_exists($name) || filemtime($name) > $time) return false;		
	}
	
	$target .= file_get_contents($cache);
	
	return true;
}

function writeCache(&$name, &$content) {
	if (!file_exists($name)) {
		
	}
	
	if (file_put_contents($name, $content) === false) return false;
	
	return true;
}


function googleClosureCompress(&$string, &$size, &$target) {
	
	switch ($size) {
		case 1 :
			$level = 'WHITESPACE_ONLY';
			break;
		case 2 :
			$level = 'SIMPLE_OPTIMIZATIONS';
			break;
		case 3 :
			$level = 'ADVANCED_OPTIMIZATIONS';
			break;
		default : return false;
	}
	
	$content  = 'js_code=' . urlencode($string) . '&';
	$content .= 'compilation_level=' . $level . '&';
	$content .= 'output_format=json&';
	$content .= 'output_info=compiled_code';
	
	$connection = array(
		'http' => array(
			'method' => 'POST',
			'content' => $content
		)
	);
	
	$context  = stream_context_create($connection);
	$fp       = @ fopen('http://closure-compiler.appspot.com/compile', 'rb', false, $context);
	
	if (!$fp) return false;
	
	$response = @ stream_get_contents($fp);
	
	if ($response == false) return false;
	
	$json = json_decode($response);
	
	if (!$json->compiledCode) return false;
	
	$target .= $json->compiledCode;
	
	return true;
}	




header('Content-Type: text/javascript; charset=utf-8');

if (!key_exists('content', $_GET)) exit();

$token = explode(',', $_GET['content']);
$location = array(); $dependent = array();
$out = '';

foreach ($token as $item) resolve($item, $location, $dependent);

foreach ($location as $name) $out .= file_get_contents($_SERVER['DOCUMENT_ROOT'] . $name) . "\n\n\n\n\n";


$compress = 0;

if (key_exists('compress', $_GET)) $compress = (int) $_GET['compress'];

if ($compress) {
	$compressed = '';
	$name = $_SERVER['DOCUMENT_ROOT'] . $cache . $_GET['compress'] . "-" . $_GET['content'] . '.js';
	
	$cache = readCache($name, $location, $compressed);
	
	if (!$cache) {
		if (googleClosureCompress($out, $compress, $compressed)) writeCache($name, $compressed);
	}
	
	if ($compressed) $out = $compressed;
}


print $out;
?>