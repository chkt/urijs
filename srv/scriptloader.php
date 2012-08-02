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
 * @return void
 */
function resolve(&$token, array &$location) {
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

/**
 * Returns a string that has all nonessential removed
 * @param  string &$string
 * @return string 
 */
function removeWhitespace(&$string) {
	$res = '';
	
	$match = preg_split('/(?<=[\(\[\:\;\,\<\>\=\+\-\*\/\%\&\^\|\!\~\?]|new|void|return|typeof|instanceof|in)(?:\s*)(\'|"|\/)/uU', $string, null, PREG_SPLIT_DELIM_CAPTURE);
	
	if ($match == null) return '' . $string;

	$delim = '';
	$error = false;
	
	for ($i = 0, $len = count($match); $i < $len; $i++) {
		$str = $match[$i];
		
		if ($error) {
			print '//[' . $i . '][' . $delim . '] encountered error' . "\n";
			
			$res .= $str;
			
			continue;
		}
		
		if ($delim != '') {
//			$seg = preg_split('/(?<!\\\\)(\\' . $delim . ')/uU', $str, 2, PREG_SPLIT_DELIM_CAPTURE);
			$seg = preg_split('/(?<!\\\\)(\\' . $delim . ')/uU', $str, 0, PREG_SPLIT_DELIM_CAPTURE);
						
			if ($seg == null) {
				$error = true;
				
				continue;
			}
			
			$num = count($seg);
			
			if ($num == 1) {
				print '//[' . $i . '][' . $delim . '][' . $num . '] ' . $str . "\n";
				
				$res .= $str;
				
				continue;
			}
			
			if ($num != 3) {
				print '//[' . $i . '][' . $delim . '][' . $num . '] ' . print_r($seg) . "\n";
				
				$error = true;
				$res .= $str;
				
				continue;
			}
			
			print '//[' . $i . '][' . $delim . '][' . $num . '] ' . $seg[0] . $seg[1] . preg_replace('/(?<=[](){}<>;,:=+\-*\/%?&|!^~])\s*\n?|\n?\s*(?=[](){}<>;,:=+\-*\/%?&|!^~])/usU', '', $seg[2]) . "\n";
			
			$res .= $seg[0] . $seg[1] . preg_replace('/(?<=[](){}<>;,:=+\-*\/%?&|!^~])\s*\n?|\n?\s*(?=[](){}<>;,:=+\-*\/%?&|!^~])/usU', '', $seg[2]);
			
			$delim = '';
			
			continue;
		}
		
		if (strlen($str) != 1) {
			print '//[' . $i . '][' . $delim . '] ' . preg_replace('/(?<=[](){}<>;,:=+\-*\/%?&|!^~])\s*\n?|\n?\s*(?=[](){}<>;,:=+\-*\/%?&|!^~])/usU', '', $str) . "\n";
			
			$res .= preg_replace('/(?<=[](){}<>;,:=+\-*\/%?&|!^~])\s*\n?|\n?\s*(?=[](){}<>;,:=+\-*\/%?&|!^~])/usU', '', $str);
			
			continue;
		}
				
		switch ($str) {
			case '\'':
			case '"' :
			case '/' : $delim = $str;
			default  : $res .= $str;
		}
		
		print '//[' . $i . '] ' . $str . "\n";
	}
	
	return $res;
}


function parseComment(&$source, &$target, &$offset, &$limit) {
	$token = $source[$offset];
	$match = '';
	
	switch ($token) {
		case '//'  :
			$match = "\n";
			break;
		case '/**' :
			$match = '**/';
			break;
		default : 
			$target .= $token;
			return false;
	}
	
	for ($i = $index; $i < $limit; $i++) {
		if ($source[$i] != $match) continue;
		
		$offset = $i;
		
		return true;
	}
	
	return false;
}


function parseLiteral(&$source, &$target, &$offset, &$limit) {
	$token = $source[$offset];
	$match = '';
	$escape = false;
	
	$target .= $token;
	
	switch ($token) {
		case '\'' :
		case '"'  :
		case '/'  :
			$match = $token;
			break;
		default :
			return false;
	}
	
	for ($i = $offset + 1; $i < $limit; $i++) {
		$token = $source[$offset];
		
		$target .= $token;
		
		if ($token == '\\' && !$escape) {
			$escape = true;
			continue;
		}
		
		if ($escape) {
			$escape = false;
			continue;
		}
		
		if ($token != $match) continue;
		
		$offset = $i;
		
		return true;
	}
	
	return false;
}


function parseBlock(&$source, &$target, &$offset, &$limit) {
	$token = $source[$offset];
	
	if ($token != '{') {
		$target .= $token;
		return false;
	}
	
	for ($i = $offset + 1; $i < $limit; $i++) {
		$token = trim($source[$offset]);
		
		if ($token == '') continue;
		
		switch ($token) {
			case '{' :
				if (parseBlock($source, $target, $offset, $limit)) continue;
				break;
			case '}' :
				$target .= $token;
				return true;
			default : 
				if (parseStatement($source, $target, $offset, $limit)) continue;
		}
		
		return false;
	}
}


function parseStatement(&$source, &$target, &$offset, &$limit) {
	for ($i = $offset; $i < $limit; $i++) {
		$token = trim($source[$i]);
		
		if ($token == '') continue;
		
		switch($token) {
			case '//' :
			case '/**' :
				if (parseComment($source, $target, $i, $limit)) continue;
				break;
			case '{' :
				if (parseBlock($source, $target, $i, $limit)) return true;
				break;
			case ';' :
				$target .= $token;
				return true;
			case 'return' :
			case 'throw'  :
			case '('    :
			case '['    :
			case '='    :
			case '*='   :
			case '/='   :
			case '%='   :
			case '+='   :
			case '-='   :
			case '<<='  :
			case '>>='  :
			case '>>>=' :
			case '&='   :
			case '^='   :
			case '|='   :
				if (parseExpression($source, $target, $i, $limit)) continue;
				break;
		}
		
		return false;
	}
}


function errorContinue(&$source, &$target, &$offset) {
	$slice = array_slice($source, $offset);
	$target .= join($slice);
}


function removeWhitespace2(&$string) {
	$res = '';
	
	$source = preg_split('/\b/uU', $string);
	
	if ($source == null) return $res . $string;
	
	for ($i = 0, $len = count($source); $i < $len; $i++) {
		if (parseStatement($source, $res, $i, $len)) continue;
		
		break;
	}
	
	if ($i < $len) errorContinue ($source, $res, ++$i); 
	
	return $res;
}


//$time = microtime(true);

header('Content-Type: text/javascript');

$size = (int) $_GET['size'];

$token = explode(',', $_GET['content']);
$location = array();

foreach ($token as $item) resolve($item, $location);

$str = '';

foreach ($location as $name) $str .= file_get_contents($_SERVER['DOCUMENT_ROOT'] . $name) . "\n\n\n\n\n";

//remove comments
//if ($size > 0) $str = preg_replace('/\/\*.*\*\/|\/\/.*(?=\n)/usU', '', $str);

//remove empty lines
if ($size > 1) $str = preg_replace('/(?<=^|\n)\s*\n/us', '', $str);

//trim lines
if ($size > 2) $str = preg_replace('/(?<=\n)\s*|\s*(?=\n)/us', '', $str);

//mangle all nonessential whitespace outside string and regular expression literals
if ($size > 3) $str = removeWhitespace($str);
	
print $str;

//print '//' . $time . ' ' . microtime(true) . ' ' . (microtime(true) - $time);
?>