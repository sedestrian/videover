<?php

include_once 'db_connect.php';

if ($_REQUEST['id']) {

    $project = filter_input(INPUT_POST, 'id', FILTER_SANITIZE_STRING);

    $sql = "SELECT video_time_from, video_time_to, overlays.overlays_id FROM timestamps INNER JOIN overlays ON timestamps.overlays_id = overlays.overlays_id WHERE timestamps_id = ".$project;

    $result = $mysqli->query($sql);
    $output = array(array());
    $i = 0;

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $output[$i]['from'] = $row["video_time_from"];
            $output[$i]['to'] = $row["video_time_to"];
            $output[$i]['ov_id'] = $row["overlays_id"];
            $i++;
        }
        echo json_encode($output);
    } else {
        echo "0";
    }
}else{
    echo "nosset";
}