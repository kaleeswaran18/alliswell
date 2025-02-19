const mongoose = require("mongoose")

const adminaccountmodel = new mongoose.Schema({
    userName: { type: String },
    Email: { type: String, default: null },
    phoneNo: { type: Number, default: null },
    password: { type: String },
    role: { type: String },
    token: { type: String },
    profilePicture: { type: String },
    branchid:{ type: String },
    isactive: { type: Boolean, default: true },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: { type: Date }

})
const customeraccountmodel = new mongoose.Schema({
    customerName: { type: String },
    password:{type:String},
    Email:{type:String},
    role:{type:String},
    profilePicture :{type:String},
    Landmark: { type: String },
    phoneNo: { type: Number },
    LandMark: { type: String },
    scheme: { type: String },
    picture:{ type: String },
    amount: { type: Number },
    pendingamount:{type:Number},
    dueamount: { type: Number },
    previousduedate: { type: String },
    duedate: { type: String },
    nextduedate: { type: String },
    startdate: { type: String },
    enddate: { type: String },
    amountclose: { type: String },
    givenamount:{ type: Number },
    branchid:{type: String},
    executeofficerId:{type: String},
    isactive: { type: Boolean, default: true },
    isextraplan: { type: String },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: { type: Date }
})
const addextracustomeraccountmodel = new mongoose.Schema({
    customerName: { type: String },

    customer_id: { type: String },
    branchid:{type: String},
    executeofficerId:{type: String},
    
 givenamount:{type: String},
    scheme: { type: String },
    amount: { type: Number },
    pendingamount:{type:Number},
    dueamount: { type: Number },
    previousduedate: { type: String },
    duedate: { type: String },
    nextduedate: { type: String },
    startdate: { type: String },
    enddate: { type: String },
    amountclose: { type: String },
    amountclose: { type: String },
    isactive: { type: Boolean, default: true },
    isextraplan: { type: String },
    profilePicture: { type: String }
})
const customerschememodel = new mongoose.Schema({


    type: { type: String },



})
const branchschememodel = new mongoose.Schema({


    Name: { type: String },
    totalinvestmentamount:{ type: String },
    currentAmount:{ type: String},
    collectionlist:{type:Array},
    stuffamountlist:{type:Array},
    collectionamount:{type:Number},
    stuffamount:{type:Number}


})
const rateofinterestschememodel = new mongoose.Schema({


    interest: { type: Number },



})
const customerpaylist = new mongoose.Schema({
    customer_id: { type: String },
    status: { type: String },
    alreadypayment: { type: String },
    customername: { type: String },
    profilePicture:{ type: String },
    branchid:{type: String},
    executeofficerId:{type: String},
    LandMark: { type: String },
    // Dueamount:{type:String},
    customerphonenumber: { type: String },
    customerscheme: { type: String },
    customerdueamount: { type: Number },
    coustomerduedate: { type: String },
    customerpayamount: { type: Number },
    maincustomer_id: { type: String },
    extraplan: { type: String },
    adminname: { type: String },
    admin_id: { type: String }

})
const formverification = new mongoose.Schema({
    Name: { type: String },
    location: { type: String },
    branchid: { type: String },
    verficationofficer: { type: String },
    isapprove:{ type: String ,default:"false"},
    phoneNo:{ type: String },
    Email: { type: String },
    // Dueamount:{type:String},
   

})
const stufftranscation=new mongoose.Schema({
   
    branchid: { type: String },
    type:{ type: String },
    isapprove:{ type: String ,default:"false"},
   amount:{type: Number }
})
const Adminaccountmodel = mongoose.model("Admin", adminaccountmodel, "Admin")
const Customerpaylist = mongoose.model("Customerpaylist", customerpaylist, "Customerpaylist")
const Customeraccountmodel = mongoose.model("Customer", customeraccountmodel, "Customer")

const Addextracustomeraccountmodel = mongoose.model("Addextracustomeraccountmodel", addextracustomeraccountmodel, "Addextracustomeraccountmodel")
const Customerschememodel = mongoose.model("Customerscheme", customerschememodel, "Customerscheme")
const Branchschememodel=mongoose.model("Branchschememodel", branchschememodel, "Branchschememodel")
const Rateofinterestschememodel=mongoose.model("Rateofinterestschememodel", rateofinterestschememodel, "Rateofinterestschememodel")
const Formverification=mongoose.model("Formverification", formverification, "Formverification")
const Stufftranscation=mongoose.model("Stufftranscation", stufftranscation, "Stufftranscation")
module.exports = {Formverification,Stufftranscation, Adminaccountmodel, Customeraccountmodel, Customerschememodel, Customerpaylist,Rateofinterestschememodel, Addextracustomeraccountmodel,Branchschememodel }