const mongoose = require('mongoose')

const ReservationSchema = new mongoose.Schema({
    email: String,
    lab: String,
    seat: String,
    date: Date,
    requested: Date,
    slots: [String],
    isAnonymous: Boolean
})

const Reservation = mongoose.model('Reservation', ReservationSchema)

module.exports = Reservation