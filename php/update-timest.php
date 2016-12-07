<?php
	include_once '../php/db_connect.php';

	if (isset($_POST['property'], $_POST['value'], $_POST['id'])) {
        
    	$property = filter_input(INPUT_POST, 'property', FILTER_SANITIZE_STRING);
    	$value = filter_input(INPUT_POST, 'value', FILTER_SANITIZE_STRING);
        $id = filter_input(INPUT_POST, 'id', FILTER_SANITIZE_STRING);

		$sql = "UPDATE timestamps SET ".$property." = ".$value." WHERE timestamps_id = ".$id;
        
		if ($mysqli->query($sql) === TRUE) {
    		echo "si";
		} else {
    		echo $mysqli->error;
		}
	}else{
		echo "no";
	}