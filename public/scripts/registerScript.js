function register() {
    const email = document.getElementById("username").value
    const name = document.getElementById("name").value
    const password = document.getElementById("password").value

    const formData = new FormData();
    formData.append('email', email);
    formData.append('name', name);
    formData.append('password', password);


    if(email.substr(email.length - 12) == "@dlsu.edu.ph") {
        if (document.getElementById("student").checked) {
            checkUser(email, formData, "student");
        }
        else if (document.getElementById("technician").checked) {
            checkUser(email, formData, "technician");
        }
        else {
            document.getElementById("errorMessage").innerHTML = "You must choose between Student and Technician!";
        }
    }
    else {
        document.getElementById("errorMessage").innerHTML = "You must use a DLSU Email!";
    }
}

function checkUser(emailValue, formData, role) {
    const response = fetch('/email?email=' + emailValue, {method: 'GET'})

    if(response == 200) {
        document.getElementById("errorMessage").innerHTML = "Account already Exists!";
    }
    else {
        if (role == "student") {
            document.getElementById("errorMessage").innerHTML = "";
            registerStudent(formData);
            document.getElementById("errorMessage").innerHTML = "Successfully Registered Student!";
        }
        else if (role == "technician") {
            checkTechnician(emailValue, formData);
        }
    }

}

function checkTechnician(emailValue, formData) {
    fetch('/email/technician?email=' + emailValue, {method: 'GET'})
        .then(res => res.json())
        .then(data => {
            if(Object.keys(data).length != 0) {
                document.getElementById("errorMessage").innerHTML = "There is already a Technician!";
            }
            else {
                document.getElementById("errorMessage").innerHTML = "";
                registerTechnician(formData);
                document.getElementById("errorMessage").innerHTML = "Successfully Registered Technician!";
            }
        })

}

function registerStudent(formData) {
    const data = new URLSearchParams(formData);

    fetch('/register/student', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: data
    })
}

function registerTechnician(formData) {
    const data = new URLSearchParams(formData);

    fetch('/register/technician', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: data
    })
}