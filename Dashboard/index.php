<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
    <title>HomeCinema Dashboard</title>
    <link rel="stylesheet" href="style.css">
</head>

<body>

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

?>

<div class="chart-container">
    <canvas id="mycanvas"></canvas>
</div>

<table border="1" align="center">
    <tr>
        <th>Timestamp</th>
        <th>Temperature in Celcius</th>
        <th>Relative Humidity</th>
    </tr>


    <?php

    $query = mysqli_query($dbconnect, "SELECT * FROM messungen")
    or die (mysqli_error($dbconnect));

    while ($row = mysqli_fetch_array($query)) {
        echo
        "<tr>
    <td>{$row['zeit']}</td>
    <td>{$row['temperatur']}</td>
    <td>{$row['luftfeuchtigkeit']}</td>
   </tr>\n";
    }
    ?>

</table>

<!-- javascript -->
<script src="//ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script type="text/javascript" src="js/linegraph.js"></script>

</body>
</html>