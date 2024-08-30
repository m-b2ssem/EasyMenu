async function changePass(event) {
    event.preventDefault();
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const userId = document.getElementById('userId').value;
    const errorLabel = document.getElementById('errorLabel');
    const from = document.getElementById('changePass');
    
    const response = await fetch('/change-pass', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ currentPassword, newPassword, userId })
    });

    const result = await response.json();

    if (result.success) {
        alert('Password changed successfully!');
        errorLabel.style.display = 'none';
        window.location.reload();
    } else {
        errorLabel.style.display = 'block';
    }
}

async function changeSubscrption(event) {
    event.preventDefault();
    const subscription = document.getElementById('subscription').value;
    const billing_period = document.querySelector('input[name="billing_period"]:checked').value;
    var userId = document.getElementById('userId').value;

    try {
        const response = await fetch('/create-checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ subscription, userId, billing_period })
        });

        const { url } = await response.json();
        window.location = url;
    } catch (err) {
        console.error(err);
    }
}

async function deleteAccount(event) {
    event.preventDefault();
    const userId = event.target.userId.value;

    try {
        const response = await fetch('/delete-account', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId })
        });

        const result = await response.json();

        if (result.success) {
            alert('Account deleted successfully!');
            window.location = '/';
        } else {
            alert('An error occurred. Please try again.');
        }
    } catch (err) {
        console.error(err);
    }
}



function sendVerificationCode(event) {
    event.preventDefault();
    var newEmail = document.getElementById('newEmail').value;
    var userId = document.getElementById('userId').value;


    // Send the new email to the server to trigger the sending of the verification code
    fetch('/sendVerificationCode', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: newEmail, userId: userId })
    }).then(response => response.json())
    .then(data => {
        if (data.success) {
            $('#changeEmailModal').modal('hide');
            $('#pendingEmail').val(newEmail);
            $('#verifyEmailModal').modal('show');
        } else {
            alert('Failed to send verification code. Please try again.');
        }
    });
}

function verifyEmail(event) {
    event.preventDefault();
    var verificationCode = document.getElementById('verificationCode').value;
    var pendingEmail = document.getElementById('pendingEmail').value;
    var userId = document.getElementById('userId').value;
    var errorLabel = document.getElementById('errorLabel2');

    // Send the verification code and the new email to the server for verification
    try {
        fetch('/verifyEmailCode', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: pendingEmail, code: verificationCode, userId: userId })
        }).then(response => response.json())
        .then(data => {
            if (data.success) {
                $('#verifyEmailModal').modal('hide');
                location.reload(); // Refresh the page to reflect the new email address
            } else {
                errorLabel.textContent = data.message;
                errorLabel.style.display = 'block';
                setTimeout(() => {
                    errorLabel.style.display = 'none';
                }, 5000);
            }
        });
    } catch (error) {
        errorLabel.textContent = 'An error occurred. Please try again.';
        errorLabel.style.display = 'block';
        setTimeout(() => {
            errorLabel.style.display = 'none';
        }, 5000);
    }
}
