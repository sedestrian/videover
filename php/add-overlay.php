<?php
include_once 'includes/db_connect.php';

if (isset($_POST['time_from'], $_POST['time_to'], $_POST['x'], $_POST['y'], $_POST['overlay'])) {
    $text = filter_input(INPUT_POST, 'text', FILTER_SANITIZE_STRING);
    $id = filter_input(INPUT_POST, 'id', FILTER_SANITIZE_STRING);

    $sql = "INSERT INTO timestamps (video_time_from, video_time_to, visible, position_x, position_y, overlays_id) VALUES ('".$text."', ".$id.")";

    if ($mysqli->query($sql) === TRUE) {
        echo "si";
    } else {
        echo "no - query";
    }
}else{
    echo "no - set";
}