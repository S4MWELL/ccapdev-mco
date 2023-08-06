const mongoose = require('mongoose')
const bcrypt = require('bcrypt')


const SALT_WORK_FACTOR = 10;
const UserSchema = new mongoose.Schema({
    email: String,
    password:{
        type: String,
        required: true
    },
    name: String,
   
    description: String,
    role: String,

   
});

 UserSchema.pre('save', async function(next){
    const User = this;

    if (!User.isModified('password'))
    {
        return(next);
    }
    try{
        const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
        const hash = await bcrypt.hash(User.password,salt);
        User.password=hash
        next();
    }
    catch (err){
        console.error(err);
        return next(err);
    }
 });

 UserSchema.method('comparePassword', function(candidatePassword)
 {
    return bcrypt.compare(candidatePassword,this.password);
 })

 const User = mongoose.model('User', UserSchema)
module.exports = User