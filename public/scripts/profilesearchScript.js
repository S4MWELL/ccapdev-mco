let searchUser = "";
let dateToday = new Date();
let year = String(dateToday.getFullYear());
let month = dateToday.getMonth() < 10 ? "0" + String(dateToday.getMonth() + 1): String(dateToday.getMonth() + 1);
let day = dateToday.getDate() < 10 ? "0" + String(dateToday.getDate()) : String(dateToday.getDate());
let thisday = year + "-" + month + "-" + day;

fetch('/get/searchuser', {method: 'GET'})
    .then(res => res.text())
    .then(data => {
        setUser(data);  
    })

function setUser(user) {
    searchUser = user;
    
    if(searchUser == "") {
        window.location.href = '/';
    }

    setProfilePicture();
    setProfileDetails();
    updateReservationList();
}

function setProfileDetails() {
    fetch('/get/user/profile?email=' + searchUser, {method: 'GET'})
    .then(res => res.json())
    .then(data => {
        document.getElementById("profileEmail").innerHTML = data[0].email
        document.getElementById("profileName").innerHTML = data[0].name
        document.getElementById("profileDescription").innerHTML = data[0].description
    })
    // if profile description is undefined, set it to empty string
    let description = document.getElementById("profileDescription");
    if (description.innerHTML == "undefined") {
        description.innerHTML = "";
    }
}

function updateReservationList() {
    fetch('/get/reservations/user?' + new URLSearchParams({
        user: searchUser,
        dateToday: thisday    
    }), {method: 'GET'})
        .then(res => res.json())
        .then(data => {
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


function setProfilePicture() {
    let img = document.getElementById("pp");
    img.onerror = function() {
        img.src = "/images/default.png";
    }
    img.src = "/images/" + searchUser + ".jpg";
}

function goBack() {
    fetch('/get/role', {method: 'GET'})
        .then(res => res.json())
        .then(data => {
            if(data.role == "technician") {
                window.location.href = "/reservation-technician"
            }
            else if (data.role == "student") {
                window.location.href = "/reservation-student"
            }
        })
}

