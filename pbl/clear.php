<?php
session_start();

// Clear all session data
if (isset($_SESSION['registered_data'])) {
    unset($_SESSION['registered_data']);
}

if (isset($_SESSION['message'])) {
    unset($_SESSION['message']);
}

$_SESSION['message'] = "Registration data cleared successfully!";

// Redirect back to index
header('Location: index.php');
exit;
?>