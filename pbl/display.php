<?php
session_start();
include 'db.php';

// Fetch all registered students from database
$sql = "SELECT * FROM student ORDER BY id DESC";
$result = mysqli_query($con, $sql);
$students = [];

if ($result && mysqli_num_rows($result) > 0) {
    while ($row = mysqli_fetch_assoc($result)) {
        $students[] = $row;
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>All Registered Students | Student System</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 40px 20px;
        }

        .container {
            width: 100%;
            max-width: 1200px;
            margin: 0 auto;
        }

        .back-link {
            margin-bottom: 20px;
        }

        .back-link a {
            color: white;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            font-weight: 500;
            opacity: 0.9;
            transition: opacity 0.3s;
        }

        .back-link a:hover {
            opacity: 1;
        }

        .card {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.2);
            overflow: hidden;
        }

        .card-header {
            background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }

        .card-header h1 {
            font-size: 28px;
            margin-bottom: 8px;
        }

        .card-header .badge {
            display: inline-block;
            background: rgba(255,255,255,0.2);
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 14px;
        }

        .card-body {
            padding: 35px;
        }

        .stats {
            background: #f7fafc;
            padding: 20px;
            border-radius: 12px;
            margin-bottom: 30px;
            text-align: center;
        }

        .stats .count {
            font-size: 36px;
            font-weight: bold;
            color: #667eea;
        }

        .students-table {
            width: 100%;
            border-collapse: collapse;
            overflow-x: auto;
            display: block;
        }

        .students-table thead {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }

        .students-table th,
        .students-table td {
            padding: 15px;
            text-align: left;
            border-bottom: 1px solid #e2e8f0;
        }

        .students-table th {
            font-weight: 600;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .students-table tbody tr:hover {
            background: #f7fafc;
        }

        .empty-state {
            text-align: center;
            padding: 60px 20px;
            color: #a0aec0;
        }

        .empty-state .icon {
            font-size: 64px;
            margin-bottom: 20px;
            opacity: 0.5;
        }

        .empty-state h3 {
            font-size: 20px;
            margin-bottom: 10px;
            color: #4a5568;
        }

        .action-buttons {
            display: flex;
            gap: 15px;
            margin-top: 30px;
            justify-content: center;
        }

        .btn {
            padding: 12px 24px;
            border: none;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            text-decoration: none;
            text-align: center;
            transition: all 0.3s;
            display: inline-block;
        }

        .btn-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }

        .btn-secondary {
            background: #e2e8f0;
            color: #4a5568;
        }

        .btn-secondary:hover {
            background: #cbd5e0;
        }

        .delete-btn {
            background: #fc8181;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 12px;
            transition: background 0.3s;
        }

        .delete-btn:hover {
            background: #f56565;
        }

        @media (max-width: 768px) {
            .students-table th,
            .students-table td {
                padding: 10px;
                font-size: 14px;
            }
            
            .card-body {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="back-link">
            <a href="index.php">← Back to Registration Form</a>
        </div>

        <div class="card">
            <div class="card-header">
                <h1>📋 All Registered Students</h1>
                <span class="badge">Student Database</span>
            </div>
            <div class="card-body">
                <?php if (count($students) > 0): ?>
                    <div class="stats">
                        <div class="count"><?php echo count($students); ?></div>
                        <p>Total Students Registered</p>
                    </div>

                    <div class="students-table">
                        <table style="width: 100%; border-collapse: collapse;">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Course</th>
                                    <th>Registration Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach($students as $student): ?>
                                <tr>
                                    <td><?php echo htmlspecialchars($student['id']); ?></td>
                                    <td><?php echo htmlspecialchars($student['name']); ?></td>
                                    <td><?php echo htmlspecialchars($student['email']); ?></td>
                                    <td><?php echo htmlspecialchars($student['course']); ?></td>
                                    <td><?php echo date('d-m-Y H:i', strtotime($student['registration_date'])); ?></td>
                                </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                <?php else: ?>
                    <div class="empty-state">
                        <div class="icon">📭</div>
                        <h3>No Students Registered Yet</h3>
                        <p>There are currently no students in the database.</p>
                        <p style="margin-top: 10px; font-size: 14px;">Fill out the registration form to add students.</p>
                    </div>
                <?php endif; ?>

                <div class="action-buttons">
                    <a href="index.php" class="btn btn-primary">Register New Student</a>
                </div>
            </div>
        </div>

        <div style="text-align: center; margin-top: 20px; color: rgba(255,255,255,0.8); font-size: 14px;">
            <p>© 2026 Student Registration System | PBL Project</p>
        </div>
    </div>
</body>
</html>