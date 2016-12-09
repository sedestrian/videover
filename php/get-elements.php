<?php

include_once 'db_connect.php';

if ($_REQUEST['project']) {

    $project = filter_input(INPUT_POST, 'project', FILTER_SANITIZE_STRING);

    $sql = "SELECT timestamps.overlays_id, overlay_name, overlay_type, video_time_from, video_time_to, timestamps_id FROM overlays INNER JOIN timestamps ON overlays.overlays_id = timestamps.overlays_id WHERE visible = 1 AND project_id = ".$project;

    $result = $mysqli->query($sql);
    $output = array(array());
    $i = 0;

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $output[$i]['id'] = $row["overlays_id"];
            $output[$i]['type'] = $row["overlay_type"];
            $output[$i]['name'] = $row["overlay_name"];
            $output[$i]['from'] = $row["video_time_from"];
            $output[$i]['to'] = $row["video_time_to"];
            $output[$i]['tid'] = $row["timestamps_id"];
            $i++;
        }
        echo json_encode($output);
    } else {
        echo "0";
    }
}else{
    echo "nosset";
}