function login() {
    var email = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    var rememberMe = document.getElementById("rememberMe").checked;

    fetch('/login?' + new URLSearchParams({
        email: email,
        password: password,    
        rememberMe: rememberMe
    }), {method: 'GET'})
        .then(res => res.json())
        .then(data => {
            if(data.status == "success") {
                document.getElementById("errorMessage").innerHTML = "";
                if(data.role == "technician") {
                    
                    redirectTechnician();
                }
                else if(data.role == 'student') {
                    redirectStudent();
                }
            }
            else {
                document.getElementById("errorMessage").innerHTML = "Wrong login information!";
            }
        })
}

function redirectStudent() {
    window.location.href = '/reservation-student';
}

function redirectTechnician() {
    window.location.href = '/reservation-technician';
}