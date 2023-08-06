let currentUser = "";
let dateToday = new Date();
let year = String(dateToday.getFullYear());
let month = dateToday.getMonth() < 10 ? "0" + String(dateToday.getMonth() + 1): String(dateToday.getMonth() + 1);
let day = dateToday.getDate() < 10 ? "0" + String(dateToday.getDate()) : String(dateToday.getDate());
let thisday = year + "-" + month + "-" + day;


fetch('/get/currentuser', {method: 'GET'})
    .then(res => res.text())
    .then(data => {
        setUser(data);  
    })

function setUser(user) {
    currentUser = user;
    
    if(currentUser == "") {
        window.location.href = '/';
    }

    setProfilePicture();
    setProfileDetails();
    document.getElementById("nameAndDescriptionForm").setAttribute("action", "/update/user/profile?email=" + currentUser)
    updateReservationList();
}

function setProfileDetails() {
    console.log("running")
    fetch('/get/user/profile?email=' + currentUser, {method: 'GET'})
    .then(res => res.json())
    .then(data => {
        document.getElementById("profileEmail").innerHTML = data[0].email
        document.getElementById("profileName").innerHTML = data[0].name
        document.getElementById("profileDescription").innerHTML = data[0].description
        document.getElementById("name").value = data[0].name
        document.getElementById("description").value = data[0].description
    })
    let description = document.getElementById("profileDescription");
    if (description.innerHTML == "undefined") {
        description.innerHTML = "";
    }
}

function updateProfileDetails() {

    const formData = new FormData();
    formData.append('email', currentUser);
    formData.append('name', document.getElementById("name").value);
    formData.append('description', document.getElementById("description").value);

    const data = new URLSearchParams(formData);

    fetch('/update/user/profile', {
            method: 'PATCH',
            body: data,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        })
  .then((response) => response.json())
  .then((json) => console.log(json));

  setProfileDetails();
}

function updateReservationList() {
    fetch('/get/reservations/user?' + new URLSearchParams({
        user: currentUser,
        dateToday: thisday    
    }), {method: 'GET'})
        .then(res => res.json())
        .then(data => {
            console.log("updating reservations list")
            data.forEach(reservation => { 
                let listItem = document.createElement("div");
                let date = document.createElement("p");
                let lab = document.createElement("p");
                let seat = document.createElement("p");
                let slots = document.createElement("div");

                date.textContent = "Date: " + String(reservation.date).substring(0, 10)
                lab.textContent = "Lab: " + String(reservation.lab)
                seat.textContent = "Seat: " + String(reservation.seat)

                listItem.setAttribute("class", "#unhighlighted");
                                
                reservation.slots.forEach(slot => {
                    let newSlot = document.createElement("p");
                    newSlot.textContent = slot.substring(0, slot.length - 2) + ":" + slot.substring(slot.length - 2, slot.length);
                    
                    if (reservation.slots.indexOf(slot) != reservation.slots.length - 1) {
                        newSlot.textContent = newSlot.textContent + ", ";
                    }
                    slots.appendChild(newSlot)
                })

                listItem.appendChild(date)
                listItem.appendChild(lab)
                listItem.appendChild(seat)
                listItem.appendChild(slots)

                listItem.style.marginBottom = "10px";

                document.getElementById("reservationsContainer").append(listItem);
            })
        })
}


document.addEventListener("DOMContentLoaded", function () {
    const editPfpBtn = document.getElementById("editPfp");
    const profilePictureForm = document.getElementById("profilePictureForm");

    profilePictureForm.style.display = "none"; 

    editPfpBtn.addEventListener("click", function () {
        profilePictureForm.style.display = (profilePictureForm.style.display === "none") ? "block" : "none";
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const editPfpBtn = document.getElementById("editName");
    const profilePictureForm = document.getElementById("nameAndDescriptionForm");

    profilePictureForm.style.display = "none"; 

    editPfpBtn.addEventListener("click", function () {
            profilePictureForm.style.display = (profilePictureForm.style.display === "none") ? "block" : "none";
    });
});

function setProfilePicture() {
    let img = document.getElementById("pp");
    img.onerror = function() {
        img.src = "images/default.png";
    }
    img.src = "/images/" + currentUser + ".jpg";
}

function signout() {
    window.location.href = '/'
}

function deleteAccount() {
    fetch('/delete/user?' + new URLSearchParams({
        user: currentUser
    }), {method: 'DELETE'})
    window.location.href = "/"
}

function goBack() {
    fetch('/get/role', {method: 'GET'})
        .then(res => res.json())
        .then(data => {
            if(data.role == "technician") {
                window.location.href = "reservation-technician"
            }
            else if (data.role == "student") {
                window.location.href = "reservation-student"
            }
        })
}

