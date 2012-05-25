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


function resolve($token, array &$location) {
	global $alias;
	global $depend;
	global $file;
	
	if ($location[$token]) return;
	
	if (key_exists($token, $alias)) {
		$str = explode(",", $alias[$token]);
		
		foreach ($str as $item) resolve($item, $location);
		
		return;
	}
	
	if (key_exists($token, $depend)) {
		$str = explode(",", $depend[$token]);
		
		foreach ($str as $item) resolve($item, $location);
	}
	
	$location[$token] = $file[$token];
}


function removeWhitespace(&$string) {
	$res = '';
	
	$quot  = null;
	$apos  = null;
	
	$first = 0;
	$last  = 0;
	
	for (;;) {
		if ($quot == null)  $quot  = mb_strpos($string, '"', $last);
		if ($apos == null)  $apos  = mb_strpos($string, '\'', $last);
		
//		print $quot . '-' . $apos . '|||';
		
		if ($quot == null && $apos == null) break;
		
		if ($quot < $apos) {
			$first = $quot;
			$quot = null;
			$char = '"';
		} else {
			$first = $apos;
			$apos = null;
			$char = '\'';
		}
		
		$res .= preg_replace('/(?<=[](){}<>;,:=+\-*\/%?&|!^~])\s*\n?|\n?\s*(?=[](){}<>;,:=+\-*\/%?&|!^~])/us', '', mb_substr($string, $last, $first - $last));
		
		//FIX detect regular expression literals containing ' or "
		for($index = $first + 1;;) {
			$pos = mb_strpos($string, $char, $index);
			
			if (!$pos) {
				$last = - 1;
				break;
			}
			
			if ($string[$pos - 1] != '\\') {
				$last = $pos + 1;
				break;
			}
			
			$index = $pos + 1;
		}
		
		if ($last == -1) return $res . mb_substr($string, $first);
		
		$res .= mb_substr($string, $first, $last - $first);
	}
	
	return $res;
}




header('Content-Type: text/javascript');

$size = (int) $_GET['size'];

$token = explode(',', $_GET['content']);
$location = array();

foreach ($token as $item) resolve($item, $location);

$str = '';

foreach ($location as $name) $str .= file_get_contents($_SERVER['DOCUMENT_ROOT'] . $name) . "\n\n\n\n\n";

//remove comments
if ($size > 0) $str = preg_replace('/\/\*.*?\*\/|\/\/.*?(?=\n)/us', '', $str);

//remove empty lines
if ($size > 1) $str = preg_replace('/(?<=^|\n)\s*\n/us', '', $str);

//trim lines
if ($size > 2) $str = preg_replace('/(?<=\n)\s*|\s*(?=\n)/us', '', $str);

//mangle all whitespace FIX will mangle whitespace inside strings
if ($size > 3) $str = removeWhitespace($str);

print $str;
?>