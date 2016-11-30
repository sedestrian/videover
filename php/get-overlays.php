<?php

include_once 'db_connect.php';

if ($_REQUEST['project']) {

    $project = filter_input(INPUT_POST, 'project', FILTER_SANITIZE_STRING);

    $sql = "SELECT overlays_id, overlay_type, overlay_props FROM overlays WHERE project_id = ".$project;

    $result = $mysqli->query($sql);
    $output = array(array());
    $i = 0;

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $output[$i]['id'] = $row["overlays_id"];
            $output[$i]['type'] = $row["overlay_type"];
            $output[$i]['props'] = $row["overlay_props"];
            $i++;
        }
        echo json_encode($output);
    } else {
        echo "0";
    }
}else{
    echo "nosset";
}