<?php

include_once 'db_connect.php';

if ($_REQUEST['project']) {

    $project = filter_input(INPUT_POST, 'project', FILTER_SANITIZE_STRING);

    $sql = "SELECT timestamps.overlays_id, overlay_name, overlay_type, timestamps_id, video_time_from, video_time_to, visible, position_x, position_y, width, height, font_size, font_color, font_family, font_style, background, background_color, elevation, text FROM overlays INNER JOIN timestamps ON overlays.overlays_id = timestamps.overlays_id WHERE visible = 1 AND project_id = ".$project;

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
            $output[$i]['visible'] = $row["visible"];
            $output[$i]['x'] = $row["position_x"];
            $output[$i]['y'] = $row["position_y"];
            $output[$i]['width'] = $row["width"];
            $output[$i]['height'] = $row["height"];
            $output[$i]['font_size'] = $row["font_size"];
            $output[$i]['font_color'] = $row["font_color"];
            $output[$i]['font_family'] = $row["font_family"];
            $output[$i]['font_style'] = $row["font_style"];
            $output[$i]['background'] = $row["background"];
            $output[$i]['background_color'] = $row["background_color"];
            $output[$i]['elevation'] = $row["elevation"];
            $output[$i]['text'] = $row["text"];
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