<?php
include_once 'constant.php';

$hostname = "192.168.5.5";
$username = "root";
$password = PWD;
$db = "keller_sensor";

$dbconnect = mysqli_connect($hostname, $username, $password, $db);

if ($dbconnect->connect_error) {
    die("Database connection failed: " . $dbconnect->connect_error);
}

$result = mysqli_query($dbconnect, "SELECT * FROM messungen")
or die (mysqli_error($dbconnect));

$data = array();
foreach ($result as $row) {
    $data[] = $row;
}

print json_encode($data);

