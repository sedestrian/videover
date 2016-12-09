<?php

include_once 'db_connect.php';

if ($_REQUEST['id']) {

    $project = filter_input(INPUT_POST, 'id', FILTER_SANITIZE_STRING);

    $sql = "UPDATE timestamps SET visible = 0 WHERE timestamps_id = ".$project;

    $result = $mysqli->query($sql);
}else{
    echo "nosset";
}