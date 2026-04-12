<?php
$s_n = 'localhost';
$u_n = 'root';
$password = '';
$db_n = 'pbl';

$con = mysqli_connect($s_n, $u_n, $password, $db_n);

if (!$con) {
    die("Connection failed: " . mysqli_connect_error());
}
// Don't echo "connection successful" here to avoid output issues
?>