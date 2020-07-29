<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$students=file_get_contents("uploads/data.json");
$courses=file_get_contents("uploads/courses.json");


echo json_encode(array_merge([json_decode($courses, true)], [json_decode($students, true)]),JSON_UNESCAPED_UNICODE);
?>