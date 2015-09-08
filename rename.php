<?php

function iterate_over_folder( $dir ) {
	$dh = opendir( $dir );
	while ( false !== ( $filename = readdir( $dh ) ) ) {
		if ( $filename == '.' || $filename == '..' ) {
			continue;
		}

		if ( is_dir( pathToFile( $dir, $filename ) ) ) {
			echo ">>" . pathToFile( $dir, $filename ) . "\n";
			iterate_over_folder( pathToFile( $dir, $filename ) );
		} else {
			$pathToFile = pathToFile( $dir, $filename);
			$renamed = substr($pathToFile, 0, -4) . '.scss';
			rename($pathToFile, $renamed);
		}


	}

	closedir( $dh );
}

/**
 * @param $dir
 * @param $filename
 *
 * @return string
 */
function pathToFile( $dir, $filename ) {
	return $dir . "/" . $filename;
}

iterate_over_folder( "./app/styles/blocks" );