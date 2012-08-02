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


function googleClosureCompress(&$string, &$size) {
	
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
		default : return '';
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
	
	if (!$fp) return '';
	
	$response = @ stream_get_contents($fp);
	
	if ($response == false) return '';
	
	$json = json_decode($response);
	
	if (!$json->compiledCode) return '';
	
	return $json->compiledCode;
}	




header('Content-Type: text/javascript; charset=utf-8');

$token = explode(',', $_GET['content']);
$location = array(); $dependent = array();
$out = '';

foreach ($token as $item) resolve($item, $location, $dependent);

foreach ($location as $name) $out .= file_get_contents($_SERVER['DOCUMENT_ROOT'] . $name) . "\n\n\n\n\n";


$compress = (int) $_GET['compress'];

if ($compress) $str_cmp = googleClosureCompress($out, $compress);
if ($str_cmp)  $out = $str_cmp;

print $out;
?>