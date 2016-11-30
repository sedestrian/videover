<?php

include_once 'db_connect.php';


    $overlay = filter_input(INPUT_POST, 'overlay', FILTER_SANITIZE_STRING);

    $sql = "SELECT timestamps_id, video_time_from, video_time_to, visible, position_x, position_y, overlays_id FROM timestamps ORDER BY overlays_id, video_time_from ASC";

    $result = $mysqli->query($sql);
    $output = array(array());
    $i = 0;

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $output[$i]['id'] = $row["timestamps_id"];
            $output[$i]['from'] = $row["video_time_from"];
            $output[$i]['to'] = $row["video_time_to"];
            $output[$i]['visible'] = $row["visible"];
            $output[$i]['x'] = $row["position_x"];
            $output[$i]['y'] = $row["position_y"];
            $output[$i]['overlays'] = $row["overlays_id"];
            $i++;
        }
        echo json_encode($output);
    } else {
        echo "0";
    }