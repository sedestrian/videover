<?php
	include_once '../php/db_connect.php';

	if (isset($_POST['project'], $_POST['type'], $_POST['props'])) {
    	$project = filter_input(INPUT_POST, 'project', FILTER_SANITIZE_STRING);
    	$type = $_POST['type'];
		$props = filter_input(INPUT_POST, 'props', FILTER_SANITIZE_STRING);

		$sql = "INSERT INTO overlays (project_id, overlay_type) VALUES (".$project.", '".$type."')";

		if ($mysqli->query($sql) === TRUE) {
    		$nid = $mysqli->insert_id;
			echo $nid;
		} else {
    		echo "no";
		}
	}else{
		echo "no";
	}
