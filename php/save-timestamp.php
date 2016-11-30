<?php
	include_once '../php/db_connect.php';

	if (isset($_POST['left'], $_POST['top'], $_POST['timefrom'], $_POST['timeto'], $_POST['visible'], $_POST['overlay'])) {
        
    	$left = filter_input(INPUT_POST, 'left', FILTER_SANITIZE_STRING);
    	$top = filter_input(INPUT_POST, 'top', FILTER_SANITIZE_STRING);
        $from = $_POST['timefrom'];
    	$to = $_POST['timeto'];
        $visible = filter_input(INPUT_POST, 'visible', FILTER_SANITIZE_STRING);
    	$overlay = filter_input(INPUT_POST, 'overlay', FILTER_SANITIZE_STRING);

		$sql = "INSERT INTO timestamps (video_time_from, video_time_to, position_x, position_y, visible, overlays_id) VALUES (".$from.", ".$to.", ".$left.", ".$top.", ".$visible.", ".$overlay.")";
        
		if ($mysqli->query($sql) === TRUE) {
    		echo "si";
		} else {
    		echo $mysqli->error;
		}
	}else{
		echo "no";
	}