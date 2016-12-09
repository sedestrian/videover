<?php

include_once 'db_connect.php';


    $overlay = filter_input(INPUT_POST, 'overlay', FILTER_SANITIZE_STRING);

    $sql = "SELECT timestamps_id, video_time_from, video_time_to, visible, position_x, position_y, overlays_id, width, height, font_size, font_color, font_family, font_style, background, background_color, elevation, text FROM timestamps WHERE visible = 1 ORDER BY overlays_id, video_time_from ASC";

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
            $output[$i]['overlays'] = $row["overlays_id"];
            $i++;
        }
        echo json_encode($output);
    } else {
        echo "0";
    }