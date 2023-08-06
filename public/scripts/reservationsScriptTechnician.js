// SETUP PAGE ELEMENTS
// calendar restrictions

console.log("technician view activated")
let dateToday = new Date();
let year = String(dateToday.getFullYear());
let month = dateToday.getMonth() < 10 ? "0" + String(dateToday.getMonth() + 1): String(dateToday.getMonth() + 1);
let day = dateToday.getDate() < 10 ? "0" + String(dateToday.getDate()) : String(dateToday.getDate());
// set dateinput min attribute to today
document.getElementById("dateInput").setAttribute("min", `${year}-${month}-${day}`);
// set dateinput max attribute to 7 days from now
dateToday.setDate(dateToday.getDate() + 7);
let year_2 = String(dateToday.getFullYear());
let month_2 = dateToday.getMonth() < 10 ? "0" + String(dateToday.getMonth() + 1): String(dateToday.getMonth() + 1);
let day_2 = dateToday.getDate() < 10 ? "0" + String(dateToday.getDate()) : String(dateToday.getDate());
document.getElementById("dateInput").setAttribute("max", `${year_2}-${month_2}-${day_2}`);
// set dateinput value to today
document.getElementById("dateInput").setAttribute("value", `${year}-${month}-${day}`);

// set slot ID's
let seats = document.getElementsByTagName("tr")
for (var i=1; i < seats.length; i+=1) {
    console.log('seats')
    let times = seats[i].children

    hour = 8;

    for (let j=1; j < times.length; j+=1) {
        
        if(j%2 == 1) {
            times[j].id = i + "-" + hour + "00";
        }
        else {
            times[j].id = i + "-" + hour + "30";
            hour = hour + 1;
        }
    }
}

// BACKEND FUNCTIONS
let currentLab = 1;
let currentUser = "";
let currentDate = document.getElementById("dateInput").value;
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

updateAll();
}

function setProfilePicture() {
let img = document.getElementById("pp");
img.onerror = function() {
    img.src = "images/default.png";
}
img.src = "/images/" + currentUser + ".jpg";
}

function updateAll() {
updateSlots();
updateReservationList();
}

function resetSlots() {
var seats = document.getElementsByTagName("tr")
for (var i=1; i < seats.length; i+=1) {
    console.log('seats')
    let times = seats[i].children

    for (let j=1; j < times.length; j+=1) {
        
        times[j].className = "unReserved";
    }
}
}

function updateSlots() {
fetch('/get/reservations?' + new URLSearchParams({
    lab: currentLab,
    date: currentDate    
}), {method: 'GET'})
    .then(res => res.json())
    .then(data => {
        resetSlots();
        console.log(data)
        data.forEach(reservation => { 
            reservation.slots.forEach(slot => {
                document.getElementById(reservation.seat + "-" + slot).className = "reserved";
            })
        })
    })
}

function resetReservationList() {
document.getElementById("list").innerHTML = "";
}

function updateReservationList() {
fetch('/get/reservations/all', {method: 'GET'})
    .then(res => res.json())
    .then(data => {
        resetReservationList();
        data.forEach(reservation => { 
            let listItemContainer  = document.createElement("div");
            let listItem = document.createElement("div");
            let reserver = document.createElement("p");
            let requested = document.createElement("p");
            let date = document.createElement("p");
            let lab = document.createElement("p");
            let seat = document.createElement("p");
            let slots = document.createElement("div");


            
            
            // set class of reserver to someReserver
            reserver.setAttribute("class", "someReserver")
            requested.setAttribute("class", "someReserver")

            reserver.textContent = String(reservation.email)
            console.log(reservation.requested)
            let newdate = new Date();
            console.log("newdate" + newdate)
            
            const dateString_now = String(reservation.requested);
            const year_now = dateString_now.slice(0, 4);
            const month_now = dateString_now.slice(5, 7);
            const day_now = dateString_now.slice(8, 10);
            const hours_now = dateString_now.slice(11, 13);
            const minutes_now = dateString_now.slice(14, 16);
            const seconds_now = dateString_now.slice(17, 19);

            const formattedDate_now = `${year_now}-${month_now}-${day_now} ${hours_now}:${minutes_now}:${seconds_now}`;

            // console.log(formattedDate_now);


            requested.textContent = "Requested on " + formattedDate_now;
            date.textContent = "Date: " + String(reservation.date).substring(0, 10)
            lab.textContent = "Lab: " + String(reservation.lab)
            seat.textContent = "Seat: " + String(reservation.seat)

            // listItem.setAttribute("class", "#listItem");
            listItem.setAttribute("class", "unhighlighted");
            
            //listItem.innerHTML = "Date: " + String(reservation.date).substring(0, 10) + "<br>Lab " + reservation.lab + "<br>Seat " + reservation.seat + "<br>Slots: ";
            
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
            
            // add functionalities here
            listItem.addEventListener("click", (e) => {
                // display #dialogueBox
                let dialogueBox = document.getElementById("dialogueBox")
                dialogueBox.style.display = "block"


                // set dialogueBoxBodyText to the textContent of the clicked list and add new line to each child
                let dialogueBoxBodyText = document.getElementById("dialogueBoxBodyText")
                dialogueBoxBodyText.innerHTML = ""
                dialogueBoxBodyText.innerHTML = "Date: " + String(reservation.date).substring(0, 10) + "<br>Lab " + reservation.lab + "<br>Seat " + reservation.seat + "<br>Slots: ";
                reservation.slots.forEach(slot => {
                    dialogueBoxBodyText.innerHTML = dialogueBoxBodyText.innerHTML + slot.substring(0, slot.length - 2) + ":" + slot.substring(slot.length - 2, slot.length);
                    if (reservation.slots.indexOf(slot) != reservation.slots.length - 1) {
                        dialogueBoxBodyText.innerHTML = dialogueBoxBodyText.innerHTML + ", ";
                    }
                })


                // the selected li could now be either edited or deleted


            })

            listItemContainer.append(reserver)
            listItemContainer.append(requested)
            listItemContainer.append(listItem)

            console.log(listItem);
            document.getElementById("list").append(listItemContainer);
        })
    })
}

// get reserver of slot
function getReserver(seatID) {
console.log(seatID);

fetch('/get/reservations/reserver?' + new URLSearchParams({
    date: currentDate,
    lab: currentLab,
    seat: seatID.substring(0,1),
    slot: seatID.substring(2, seatID.length)
}), {method: 'GET'})
    .then(res => res.json())
    .then(data => {
        console.log(data);
        if(data.name == "anonymous") {
            document.getElementById("reserverName").innerHTML = "Anonymous";
            document.getElementById("reserverEmail").innerHTML = "";
        }
        else {
            document.getElementById("reserverName").innerHTML = data.name;
            document.getElementById("reserverName").style.cursor = "pointer";
            document.getElementById("reserverEmail").innerHTML = data.email;
        }
        
    })

}

function searchProfile() {
if(document.getElementById("reserverName").innerHTML != "Anonymous") {
    window.location.href = "/profile/search?searchUser=" + document.getElementById("reserverEmail").innerHTML;
}
}

//go to profile of current user
function goToProfile() {
window.location.href = '/profile';
}

// logout user
function signout() {
window.location.href = "/signout"
}

// FRONT END FUNCTIONS

// switch lab
// document.getElementById("next").addEventListener("click", () => {
//     if (currentLab < 3) {
//         currentLab += 1;
//         document.getElementById("labNum").innerHTML = String(currentLab);
//         updateAll();
//     } 
// });
// document.getElementById("prev").addEventListener("click", () => {
//     if (currentLab > 1) {
//         currentLab -= 1;
//         document.getElementById("labNum").innerHTML = String(currentLab);
//         updateAll();
//     } 
// });

document.getElementById("labSelect").addEventListener("change", () => {
currentLab = document.getElementById("labSelect").value;
document.getElementById("labNum").innerHTML = String(currentLab);
updateAll();
});

// switch date
document.getElementById("dateInput").addEventListener("change", () => {
currentDate = document.getElementById("dateInput").value
updateAll();
});

// add event listeners to seats
seats = document.querySelectorAll("td.reserved, td.unReserved, td.selected");
for (let i=0; i < seats.length; i+=1) {
seats[i].style.cursor = "pointer";
seats[i].addEventListener("click", (e) => {
    let seat = e.target;
   
    console.log(i);
    // if seat is not reserved and a time slot is chosen, select it
    if (seat.getAttribute("class") === "unReserved") {
        seat.setAttribute("class", "selected");
    }
    // if seat is selected, unselect
    else if (seat.getAttribute("class") === "selected") {
        seat.setAttribute("class", "unReserved");
    }
    else if (seat.getAttribute("class") === "reserved") {
        document.getElementById("reserverBox").style.display = "flex";
        getReserver(seat.id);
    }
});
}

// close button
document.getElementById("closeBtn").addEventListener("click", (e) => {
document.getElementById("reserverBox").style.display = "none";



}); 

// search button -- opens search modal
document.getElementById("searchBtn").addEventListener("click", (e) => {
let searchDialog = document.getElementById("searchDialog");
searchDialog.showModal();
searchDialog.style.display = "flex";

//set min attribute of searchslotinput to today
let today = new Date();
let dd = today.getDate();
let mm = today.getMonth()+1; //January is 0!
let yyyy = today.getFullYear();
if(dd<10){
    dd='0'+dd;
}
if(mm<10){
    mm='0'+mm;
}
let todayString = yyyy+'-'+mm+'-'+dd;
document.getElementById("searchSlotInput").setAttribute("min", todayString);

// set max attribute of searchslot input to 7 days from today
let todayPlus7 = new Date();
todayPlus7.setDate(todayPlus7.getDate() + 7);
dd = todayPlus7.getDate();
mm = todayPlus7.getMonth()+1; //January is 0!
yyyy = todayPlus7.getFullYear();
if(dd<10){
    dd='0'+dd;
}
if(mm<10){
    mm='0'+mm;
}
let todayPlus7String = yyyy+'-'+mm+'-'+dd;
document.getElementById("searchSlotInput").setAttribute("max", todayPlus7String);

// set value of searchslotinput to today
document.getElementById("searchSlotInput").setAttribute("value", todayString);
});

document.getElementById("searchTypeUser").addEventListener("change", (e) => {    
if (e.target.checked) {
    document.getElementById("userSearchInputDiv").style.display = "block"
    document.getElementById("timeSlotSearchInputDiv").style.display = "none"
}
})

document.getElementById("searchTypeTimeslot").addEventListener("change", (e) => {    
if (e.target.checked) {
    document.getElementById("userSearchInputDiv").style.display = "none"
    document.getElementById("timeSlotSearchInputDiv").style.display = "block"
}
})

// event listener for when the user confirms search params
document.getElementById("search").addEventListener("click", () => {

// delete search results 
document.getElementById("resultsContainer").innerHTML = ""

// get values of input elements
let nameInput = document.getElementById("searchInput").value

let dateInput = document.getElementById("searchSlotInput").value
let timeInput = document.getElementById("timeSlotSearchInput").value
let labInput = (document.getElementById("searchLabSelect").value)

let params
let url
// if "search user" is selected
if (document.getElementById("searchTypeUser").checked) {
    params = new URLSearchParams({
        name: nameInput
    })
    url = '/users?'

    fetch(url + params, {method: 'GET'})
    .then(res => res.json())
    .then(data => {
        console.log(data);

        // add elements to dialog
        let div = document.createElement("div")
        div.setAttribute("id", "searchResults")

        let h = document.createElement("div")
        h.setAttribute("class", "searchHeader")
        h.textContent = "Results:"
        div.appendChild(h)

        // if no results found print no results, else, print results
        if (data.length == 0) {
            let resultElement = document.createElement("div")
            resultElement.textContent = "No results found"
            div.appendChild(resultElement)
        }

        data.forEach(user => {
            let resultElement = document.createElement("div")
            resultElement.setAttribute("class", "searchResult")
            resultElement.textContent = user.name + " | " + user.email
            div.appendChild(resultElement)

            // add event listener to each result
            resultElement.addEventListener("click", () => {
                // redirect to profile of user
                window.location.href = "/profile/search?searchUser=" + user.email;
            })
            
        })
        document.getElementById("resultsContainer").appendChild(div)
        // empty user search input field
        document.getElementById("searchInput").value = ""
    })

}
else {

    params = new URLSearchParams({
        date: dateInput,
        time: timeInput,
        lab: labInput,
        seat: [1, 2, 3, 4, 5, 6, 7, 8]
    })
    url = '/slot/isTaken?'

    fetch(url + params, {method: 'GET'})
    .then(res => res.json())
    .then(data => {
        console.log(data);

        let div = document.createElement("div")
            div.setAttribute("id", "searchResults")

            let h = document.createElement("div")
            h.textContent = "Results:"
            div.appendChild(h)

            
        if (data.length == 0) {
            let resultElement = document.createElement("div")
            resultElement.textContent = "No results found"
            div.appendChild(resultElement)
        }
        else {
            for(let i = 0; i < data.length; i++) {
                // add elements to dialog
                let resultElement = document.createElement("div")
                resultElement.setAttribute("class", "seatResult")
                resultElement.textContent = "Seat " + data[i];
                div.appendChild(resultElement)
                document.getElementById("resultsContainer").appendChild(div)
                // empty user search input field
                document.getElementById("searchInput").value = ""
            }
        }
        
    })
}


})


// event listener that closes modal 
document.getElementById("closeSearchDialog").addEventListener("click", () => {
// delete search results
// let resultsCont = document.getElementById("resultsContainer")
// resultsCont.removeChild(resultsCont.firstChild)
// close modal
let dialog = document.getElementById("searchDialog")
dialog.close()
dialog.style.display = "none"
// delete search results 
document.getElementById("resultsContainer").innerHTML = ""
})

// submit button
document.getElementById("submitBtn").addEventListener("click", (e) => {
// add all selected to reservations list
submitReservation();

});

function checkValidReservation() {
let selectedSlots = document.getElementsByClassName("selected");   

// return false if not all the slots have the same seat
let foo = selectedSlots[0].getAttribute("id").charAt(0)
for (let i=1; i < selectedSlots.length; i+=1) {
    if (selectedSlots[i].getAttribute("id").charAt(0) != foo)
        return false
}
return true
}

function submitReservation() {
let li;
let labNum = document.getElementById("labNum").textContent;
let curDate = currentDate;

let seats = [[],[],[],[],[],[],[],[]];


let selectedSlots = document.getElementsByClassName("selected");   

if(selectedSlots.length == 0) {
    window.alert("You must select at least one slot.")
    return
}

if (!checkValidReservation()) {
    window.alert("You may only reserve slots for a single seat in a single reservation.")
    return
}

if (document.getElementById("emailInput").value == "") {
    window.alert("You must input the email address of the student you are reserving for!")
    return
}

for(var i = 0; i < selectedSlots.length; i++) {
    console.log(String(selectedSlots[i].id.substring(2, selectedSlots[i].id.length)));
   seats[parseInt(selectedSlots[i].id.substring(0, 1)) - 1].push(String(selectedSlots[i].id.substring(2, selectedSlots[i].id.length)));
}

console.log(seats);

for(var i = 0; i < seats.length; i++) {
    if(seats[i].length != 0) {
        
        const formData = new FormData();
        formData.append('email', document.getElementById("emailInput").value);
        formData.append('date', currentDate);
        formData.append('lab', currentLab);
        formData.append('seat', i+1);
        formData.append('slots', seats[i]);
        formData.append('isAnonymous', document.getElementById("anonymous").checked);

        const data = new URLSearchParams(formData);

        console.log(data);

        fetch('/submit/reservation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: data
        })
        updateAll();
    }
}
}

// add functionalty to dialogueBoxEdit (edit reservation)
document.getElementById("dialogueBoxEdit").addEventListener("click", (e) => {
// show editItems
let editItems = document.getElementById("editItems")
editItems.style.display = "flex"
// selected reservation will become unreserved
let dialogueBoxBodyText = document.getElementById("dialogueBoxBodyText").innerHTML
console.log(dialogueBoxBodyText)
var oldDate = dialogueBoxBodyText.substring(6, 16)
var oldLab = dialogueBoxBodyText.substring(24, 25)
var oldSeat = dialogueBoxBodyText.substring(34, 35)
var oldSlots = dialogueBoxBodyText.substring(46, dialogueBoxBodyText.length)
oldSlots = oldSlots.replaceAll(":", "");
oldSlots = oldSlots.replaceAll(" ", "");




// user will select new seats
// user will then click confirmEditBtn
});

// add functionality to dialogueBoxDelete (delete reservation)
document.getElementById("dialogueBoxDelete").addEventListener("click", (e) => {
    // delete reservation from reservations
    // selected reservation will become unreserved
    let dialogueBoxBodyText = document.getElementById("dialogueBoxBodyText").innerHTML
    console.log(dialogueBoxBodyText)
    var oldDate = dialogueBoxBodyText.substring(6, 16)
    var oldLab = dialogueBoxBodyText.substring(24, 25)
    var oldSeat = dialogueBoxBodyText.substring(34, 35)
    var oldSlots = dialogueBoxBodyText.substring(46, dialogueBoxBodyText.length)
    oldSlots = oldSlots.replaceAll(":", "");
    oldSlots = oldSlots.replaceAll(" ", "");

    // window.alert(oldDate); //yyyy-mm-dd
    // window.alert(oldSlots); //hhmm,hhmm,hhmm...  could also be hmm if the hour is 1 digit

    // get the first hour and minute of oldslots, add a condition if the hour is 1 digit
    // if the 4th character is a comma, then the hour is 1 digit
    if (oldSlots.charAt(3) == ",") {
        // get hour and add one padding zero
        var hour = oldSlots.charAt(0);
        hour = "0" + hour;
        // get minutes
        var minutes = oldSlots.charAt(1) + oldSlots.charAt(2);
    }
    else { //2 digit hrs
        var hour = oldSlots.charAt(0) + oldSlots.charAt(1);
        var minutes = oldSlots.charAt(2) + oldSlots.charAt(3);
    }
    // YYYY-MM-DD HH:MM:SS

    let dateDeleteAttempt = oldDate + " " + hour + ":" + minutes + ":00";

    // window.alert("date delete attempt: " + dateDeleteAttempt);
    // window.alert(getPhilippineStandardTime());
    


    if (compareDateTime(getPhilippineStandardTime(), dateDeleteAttempt)) {

        fetch('/delete/reservation?' + new URLSearchParams({
            date: oldDate,
            lab: oldLab,
            seat: oldSeat,
            slots: oldSlots
        }), {method: 'DELETE'})
            .then(res => res.json())
            .then(data => {
                updateAll();
            })

        updateAll();


        //hide #dialogueBox afterwards
        let dialogueBox = document.getElementById("dialogueBox")
        dialogueBox.style.display = "none"
    }
    else {
        window.alert("You can only delete reservations 10 minutes after the reservation has started.")
    }

});


//add functionality of confirmEditBtn
document.getElementById("confirmEditBtn").addEventListener("click", (e) => {
    // add functionality here



    let slots = [];

    let selectedSlots = document.getElementsByClassName("selected");

    if(selectedSlots.length == 0) {
        window.alert("You must select at least one slot.")
        return
    }

    if (!checkValidReservation()) {
        window.alert("You may only reserve slots for a single seat in a single reservation.")
        return
    }

    if(document.getElementById("submitBtn").disabled) {
        window.alert("Email does not exist.")
        return
    }

    for(var i = 0; i < selectedSlots.length; i++) {
        console.log(String(selectedSlots[i].id.substring(2, selectedSlots[i].id.length)));
        slots.push(String(selectedSlots[i].id.substring(2, selectedSlots[i].id.length)));
    }

    let newSeat = selectedSlots[0].id.substring(0, 1);

    console.log(slots)

    // add all selected to reservations list
    let dialogueBoxBodyText = document.getElementById("dialogueBoxBodyText").innerHTML
    console.log(dialogueBoxBodyText)
    var oldDate = dialogueBoxBodyText.substring(6, 16)
    var oldLab = dialogueBoxBodyText.substring(24, 25)
    var oldSeat = dialogueBoxBodyText.substring(34, 35)
    var oldSlots = dialogueBoxBodyText.substring(46, dialogueBoxBodyText.length)
    oldSlots = oldSlots.replaceAll(":", "");
    oldSlots = oldSlots.replaceAll(" ", "");

    fetch('/update/reservation?' + new URLSearchParams({
        oldDate: oldDate,
        oldLab: oldLab,
        oldSeat: oldSeat,
        oldSlots: oldSlots,
        newDate: currentDate,
        newLab: currentLab,
        newSeat: newSeat,
        newSlots: slots
    }), {method: 'PATCH'})
        .then(res => res.json())
        .then(data => {
            updateAll();
        })

    // clear dialogueBoxBodyText
    document.getElementById("dialogueBoxBodyText").innerHTML = ""
    // hide #dialogueBox
    let dialogueBox = document.getElementById("dialogueBox")
    dialogueBox.style.display = "none"
    // hide #editItems
    let editItems = document.getElementById("editItems")
    editItems.style.display = "none"

    updateAll();
});

// add functionality of cancelEditBtn
document.getElementById("cancelEditBtn").addEventListener("click", (e) => {
    // undos the changes made by the user

    // hide #editItems
    let editItems = document.getElementById("editItems")
    editItems.style.display = "none"
});

// window.alert(compareDateTime("2023-07-25 15:30:31", "2023-07-25 15:41:31"))

//compare datetime function, date1 and date 2 is a string in the format of "YYYY-MM-DD HH:MM:SS" 
function compareDateTime(date1, date2) {
    // if date2 is within after 10 mins after date1 has started, return true
    // else return false
    const dateString_now = String(date1);
    const year_now = dateString_now.slice(0, 4);
    const month_now = dateString_now.slice(5, 7);
    const day_now = dateString_now.slice(8, 10);
    const hours_now = dateString_now.slice(11, 13);
    const minutes_now = dateString_now.slice(14, 16);
    const seconds_now = dateString_now.slice(17, 19);
    

    const dateString_10mins = String(date2);
    const year_10mins = dateString_10mins.slice(0, 4);
    const month_10mins = dateString_10mins.slice(5, 7);
    const day_10mins = dateString_10mins.slice(8, 10);
    const hours_10mins = dateString_10mins.slice(11, 13);
    const minutes_10mins = dateString_10mins.slice(14, 16);
    const seconds_10mins = dateString_10mins.slice(17, 19);

    // if year, month day, hour is equal, compare the minutes
    if (year_now == year_10mins && month_now == month_10mins && day_now == day_10mins && hours_now == hours_10mins) {
        if (Number(minutes_10mins) - Number(minutes_now) <= 10) {
            return true;
        }
    }
    return false;
}

function getPhilippineStandardTime() {
    const localDate = new Date();
  
    // const offsetInMinutes = 480; // GMT+8 offset in minutes
    // const philippineDate = new Date(localDate.getTime() + offsetInMinutes * 60 * 1000);

    let philippineDate = new Date();
  
    const year = philippineDate.getFullYear();
    const month = String(philippineDate.getMonth() + 1).padStart(2, '0');
    const day = String(philippineDate.getDate()).padStart(2, '0');
    const hours = String(philippineDate.getHours()).padStart(2, '0');
    const minutes = String(philippineDate.getMinutes()).padStart(2, '0');
    const seconds = String(philippineDate.getSeconds()).padStart(2, '0');
  
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

document.getElementById("emailInput")?.addEventListener("keyup", async function (e) {
    // write your code here
    const email = document.getElementById("emailInput").value;
    const response = await fetch('/email?email=' + email, {method: 'GET'});
    
    console.log("OIJSDKOJSDF")
    if (response.status == 200) {
        document.getElementById("submitBtn").disabled = false;
        document.getElementById("emailInput").style.backgroundColor = 'white';
        document.getElementById("errorMessage").innerText = "";
    } else if (response.status == 204){
        document.getElementById("submitBtn").disabled = true;
        document.getElementById("emailInput").style.backgroundColor = '#ec4c56';
        document.getElementById("errorMessage").innerText = "Email does not exist!";
    }
});

