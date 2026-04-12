<?php
session_start();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Online Student Registration System</title>
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
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }

        .container {
            width: 100%;
            max-width: 550px;
        }

        .success-message {
            background: #d4edda;
            color: #155724;
            padding: 15px 20px;
            border-radius: 10px;
            margin-bottom: 25px;
            border-left: 5px solid #28a745;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .success-message .icon {
            font-size: 24px;
        }

        .success-message .text {
            flex: 1;
            font-weight: 500;
        }

        .success-message .close-btn {
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            color: #155724;
            opacity: 0.7;
            transition: opacity 0.3s;
        }

        .success-message .close-btn:hover {
            opacity: 1;
        }

        .form-card {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.2);
            overflow: hidden;
        }

        .card-header {
            background: linear-gradient(135deg, #4a5568 0%, #2d3748 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }

        .card-header h1 {
            font-size: 28px;
            font-weight: 600;
            margin-bottom: 8px;
        }

        .card-header p {
            opacity: 0.9;
            font-size: 16px;
        }

        .card-body {
            padding: 35px;
        }

        .form-group {
            margin-bottom: 25px;
        }

        .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #2d3748;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .form-group label i {
            margin-right: 8px;
            color: #667eea;
        }

        .form-control {
            width: 100%;
            padding: 14px 16px;
            border: 2px solid #e2e8f0;
            border-radius: 12px;
            font-size: 16px;
            transition: all 0.3s ease;
            font-family: inherit;
        }

        .form-control:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .form-control:hover {
            border-color: #a0aec0;
        }

        select.form-control {
            appearance: none;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%232d3748' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: right 16px center;
            background-size: 16px;
            cursor: pointer;
        }

        .btn {
            width: 100%;
            padding: 16px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 12px;
            font-size: 18px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.3s, box-shadow 0.3s;
            margin-bottom: 15px;
        }

        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }

        .btn:active {
            transform: translateY(0);
        }

        .view-link {
            text-align: center;
            margin-top: 10px;
        }

        .view-link a {
            color: #667eea;
            text-decoration: none;
            font-weight: 500;
            transition: color 0.3s;
            font-size: 15px;
        }

        .view-link a:hover {
            color: #764ba2;
            text-decoration: underline;
        }

        .error-message {
            background: #fed7d7;
            color: #c53030;
            padding: 12px 16px;
            border-radius: 10px;
            margin-bottom: 20px;
            font-size: 14px;
            border-left: 4px solid #c53030;
        }

        .display-section {
            background: #f7fafc;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 25px;
        }

        .display-section h3 {
            color: #2d3748;
            margin-bottom: 15px;
            font-size: 18px;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 10px;
        }

        .info-row {
            display: flex;
            padding: 10px 0;
            border-bottom: 1px solid #e2e8f0;
        }

        .info-row:last-child {
            border-bottom: none;
        }

        .info-label {
            font-weight: 600;
            color: #4a5568;
            width: 100px;
        }

        .info-value {
            color: #2d3748;
            flex: 1;
        }

        .clear-btn {
            background: #e2e8f0;
            color: #4a5568;
            border: none;
            padding: 10px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 500;
            transition: background 0.3s;
        }

        .clear-btn:hover {
            background: #cbd5e0;
        }

        @media (max-width: 480px) {
            .card-header h1 {
                font-size: 22px;
            }
            
            .card-body {
                padding: 25px;
            }
            
            .form-control {
                padding: 12px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <?php if(isset($_SESSION['message'])): ?>
        <div class="success-message" id="successMessage">
            <span class="icon">✅</span>
            <span class="text"><?php echo htmlspecialchars($_SESSION['message']); ?></span>
            <button class="close-btn" onclick="this.parentElement.style.display='none'">&times;</button>
        </div>
        <?php 
        unset($_SESSION['message']);
        endif; 
        ?>

        <?php if(isset($_SESSION['registered_data'])): ?>
        <div class="display-section">
            <h3>📋 Current Registration Details</h3>
            <div class="info-row">
                <span class="info-label">Name:</span>
                <span class="info-value"><?php echo htmlspecialchars($_SESSION['registered_data']['name']); ?></span>
            </div>
            <div class="info-row">
                <span class="info-label">Email:</span>
                <span class="info-value"><?php echo htmlspecialchars($_SESSION['registered_data']['email']); ?></span>
            </div>
            <div class="info-row">
                <span class="info-label">Course:</span>
                <span class="info-value"><?php echo htmlspecialchars($_SESSION['registered_data']['course']); ?></span>
            </div>
            <div style="margin-top: 15px; text-align: right;">
                <form method="POST" action="clear.php" style="display: inline;">
                    <button type="submit" class="clear-btn">Clear Registration</button>
                </form>
            </div>
        </div>
        <?php endif; ?>

        <div class="form-card">
            <div class="card-header">
                <h1>🎓 Student Registration</h1>
                <p>Enter your details to enroll</p>
            </div>
            <div class="card-body">
                <form action="register.php" method="POST" id="registrationForm">
                    <div class="form-group">
                        <label for="name">
                            <i>👤</i> Full Name
                        </label>
                        <input 
                            type="text" 
                            id="name" 
                            name="name" 
                            class="form-control" 
                            placeholder="Enter your full name"
                            required
                            value="<?php echo isset($_SESSION['form_data']['name']) ? htmlspecialchars($_SESSION['form_data']['name']) : ''; ?>"
                        >
                    </div>

                    <div class="form-group">
                        <label for="email">
                            <i>📧</i> Email Address
                        </label>
                        <input 
                            type="email" 
                            id="email" 
                            name="email" 
                            class="form-control" 
                            placeholder="student@example.com"
                            required
                            value="<?php echo isset($_SESSION['form_data']['email']) ? htmlspecialchars($_SESSION['form_data']['email']) : ''; ?>"
                        >
                    </div>

                    <div class="form-group">
                        <label for="course">
                            <i>📚</i> Select Course
                        </label>
                        <select id="course" name="course" class="form-control" required>
                            <option value="">-- Choose your course --</option>
                            <option value="B.Sc Computer Science" <?php echo (isset($_SESSION['form_data']['course']) && $_SESSION['form_data']['course'] == 'B.Sc Computer Science') ? 'selected' : ''; ?>>B.Sc Computer Science</option>
                            <option value="B.Com" <?php echo (isset($_SESSION['form_data']['course']) && $_SESSION['form_data']['course'] == 'B.Com') ? 'selected' : ''; ?>>B.Com (Bachelor of Commerce)</option>
                            <option value="B.A. English" <?php echo (isset($_SESSION['form_data']['course']) && $_SESSION['form_data']['course'] == 'B.A. English') ? 'selected' : ''; ?>>B.A. English Literature</option>
                            <option value="BBA" <?php echo (isset($_SESSION['form_data']['course']) && $_SESSION['form_data']['course'] == 'BBA') ? 'selected' : ''; ?>>BBA (Business Administration)</option>
                            <option value="B.Sc Mathematics" <?php echo (isset($_SESSION['form_data']['course']) && $_SESSION['form_data']['course'] == 'B.Sc Mathematics') ? 'selected' : ''; ?>>B.Sc Mathematics</option>
                            <option value="BCA" <?php echo (isset($_SESSION['form_data']['course']) && $_SESSION['form_data']['course'] == 'BCA') ? 'selected' : ''; ?>>BCA (Computer Applications)</option>
                        </select>
                    </div>

                    <button type="submit" class="btn">Register Now</button>
                </form>

                <div class="view-link">
                    <a href="display.php">📄 View All Registered Students →</a>
                </div>
            </div>
        </div>

        <div style="text-align: center; margin-top: 20px; color: rgba(255,255,255,0.8); font-size: 14px;">
            <p>© 2026 Student Registration System | PBL Project</p>
        </div>
    </div>

    <script>
        document.getElementById('registrationForm').addEventListener('submit', function(e) {
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const course = document.getElementById('course').value;
            
            let errorMessage = '';
            
            if (name === '') {
                errorMessage += '• Please enter your full name\n';
            } else if (name.length < 3) {
                errorMessage += '• Name must be at least 3 characters long\n';
            }
            
            if (email === '') {
                errorMessage += '• Please enter your email address\n';
            } else if (!isValidEmail(email)) {
                errorMessage += '• Please enter a valid email address\n';
            }
            
            if (course === '') {
                errorMessage += '• Please select a course\n';
            }
            
            if (errorMessage !== '') {
                e.preventDefault();
                alert('Please fix the following errors:\n\n' + errorMessage);
            }
        });
        
        function isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }
        
        setTimeout(function() {
            const successMsg = document.getElementById('successMessage');
            if (successMsg) {
                successMsg.style.transition = 'opacity 0.5s';
                successMsg.style.opacity = '0';
                setTimeout(() => successMsg.style.display = 'none', 500);
            }
        }, 5000);
    </script>
</body>
</html>
<?php
if(isset($_SESSION['form_data'])) {
    unset($_SESSION['form_data']);
}
?>