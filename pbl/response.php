<?php
include 'db.php';

echo "<br>";
$name=$_POST["name"];
echo var_dump($name)."<br>";
$email=$_POST["email"];
echo var_dump($email)."<br>";
$course=$_POST["cousre"];
echo var_dump($course)."<br>";


$sql="insert into student(name,email,course) values('$name','$email','$course')";
mysqli_query($con,$sql);

  echo  "successful inserted";

?>