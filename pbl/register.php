<?php
session_start();
include 'db.php';

// Check if form was submitted
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: index.php');
    exit;
}

// Get form data and sanitize
$name = trim(mysqli_real_escape_string($con, $_POST['name'] ?? ''));
$email = trim(mysqli_real_escape_string($con, $_POST['email'] ?? ''));
$course = trim(mysqli_real_escape_string($con, $_POST['course'] ?? ''));

// Store in session for form repopulation if needed
$_SESSION['form_data'] = [
    'name' => $name,
    'email' => $email,
    'course' => $course
];

// Validation
$errors = [];

if (empty($name)) {
    $errors[] = "Name is required";
} elseif (strlen($name) < 3) {
    $errors[] = "Name must be at least 3 characters";
}

if (empty($email)) {
    $errors[] = "Email is required";
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = "Please enter a valid email address";
}

if (empty($course)) {
    $errors[] = "Please select a course";
}

// If no errors, process registration
if (empty($errors)) {
    // Check if email already exists
    $check_sql = "SELECT id FROM student WHERE email = '$email'";
    $check_result = mysqli_query($con, $check_sql);
    
    if (mysqli_num_rows($check_result) > 0) {
        $_SESSION['error'] = "This email is already registered!";
        header('Location: index.php');
        exit;
    }
    
    // Insert into database
    $sql = "INSERT INTO student (name, email, course, registration_date) 
            VALUES ('$name', '$email', '$course', NOW())";
    
    if (mysqli_query($con, $sql)) {
        // Store in session
        $_SESSION['registered_data'] = [
            'name' => $name,
            'email' => $email,
            'course' => $course,
            'registration_time' => date('Y-m-d H:i:s')
        ];
        
        $_SESSION['message'] = "Registration successful! Welcome, " . htmlspecialchars($name) . "!";
        
        // Clear form data
        unset($_SESSION['form_data']);
    } else {
        $_SESSION['error'] = "Database error: " . mysqli_error($con);
    }
} else {
    $_SESSION['error'] = implode('<br>', $errors);
}

// Redirect back to index
header('Location: index.php');
exit;
?>