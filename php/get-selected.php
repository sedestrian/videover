<?php

include_once 'db_connect.php';

if ($_REQUEST['id']) {

    $timestamp = filter_input(INPUT_POST, 'id', FILTER_SANITIZE_STRING);

    $sql = "SELECT overlays.overlays_id, overlay_name, overlay_type, overlay_props, video_time_from, video_time_to, visible, position_x, position_y FROM overlays INNER JOIN timestamps ON overlays.overlays_id = timestamps.overlays_id WHERE timestamps_id = ".$timestamp;

    $result = $mysqli->query($sql);
    $output = array(array());
    $i = 0;

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $output[$i]['id'] = $row["overlays_id"];
            $output[$i]['type'] = $row["overlay_type"];
            $output[$i]['props'] = $row["overlay_props"];
            $output[$i]['name'] = $row["overlay_name"];
            $output[$i]['from'] = $row["video_time_from"];
            $output[$i]['to'] = $row["video_time_to"];
            $output[$i]['x'] = $row["position_x"];
            $output[$i]['y'] = $row["position_y"];
            $i++;
        }
        echo json_encode($output);
    } else {
        echo "0";
    }
}else{
    echo "nosset";
}