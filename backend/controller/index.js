const { Adminaccountmodel,collection,Chitsnewmodel, Customeraccountmodel,Companylogomodel,Stufftranscation,Formverification, Customerschememodel, Customerpaylist, Addextracustomeraccountmodel,Branchschememodel,Rateofinterestschememodel } = require('../model/model')
const bcrypt = require('bcryptjs');
const { userSockets } = require('../socket');
const jwt = require('jsonwebtoken');
const { HelperService } = require('../services/index')
const moment = require('moment');
const mongoose = require("mongoose")
const ObjectId = mongoose.Types.ObjectId;
require('dotenv').config();
// verificationapprovel
const adminaccountSchema = () => {
  const createaccount = async (req, res) => {
    console.log("1")
    try {
      console.log("12")
      console.log(req.body, "body")


      const existingUser = await Adminaccountmodel.findOne({ userName: req.body.userName });
      if (existingUser) {
        return res.status(200).send({
        
          message: "name already exists"
        })
        
      }
      const existingEmail = await Adminaccountmodel.findOne({ Email: req.body.Email });
      if (existingEmail) {
        return res.status(200).send({
        
          message: "email already exists"
        })
      }
      const existingphone = await Adminaccountmodel.findOne({ phoneNo: req.body.phoneNo });
      if (existingphone) {
        return res.status(200).send({
        
          message: "phonenumber already exists"
        })
        
      }
      
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      var value = await Adminaccountmodel.create({
        userName: req.body.userName,
        Email: req.body.Email == "" ? null : req.body.Email,
        phoneNo: req.body.phoneNo,
        password: hashedPassword,
        role: req.body.role ? req.body.role : "admin",
        branchid: req.body.branchid,
        profilePicture: req.body.profilePicture,
        //profilePicture:req.file.originalname?`https://alliswell-2.onrender.com/${req.file.originalname}`:null,
        isactive: true
      })
      res.status(200).send({
        data: value,
        message: `${req.body.userName}promted a ${req.body.role} Adminaccount created Successfully!`
      })
    }
    catch (err) {
      console.log("Something went wrong  post!!!", err)
    }
  }
  const getbrachbasedonexecuter=async(req,res)=>{
    const existingUser = await Adminaccountmodel.find(
      { 
        branchid: req.query.id, 
        role: "executeofficer", 
        _id: { $ne: req.query.executeid } // Exclude matching executeid
      }
    ).select("_id userName");
    
    res.status(200).send({
        data:existingUser,
      message: "companyimage upload sucessfully"
    })
  }
  const companyimage=async(req,res)=>{
    var value = await Companylogomodel.create({
      
      profilePicture: req.file.originalname?`https://alliswell-2.onrender.com/images/${req.file.originalname}`
: null,
     
      
     
    })
     res.status(200).send({
        
      message: "companyimage upload sucessfully"
    })
  }
 const getcompanyimage=async(req,res)=>{
  var value = await Companylogomodel.find()
  let find=value[value.length-1]
  let check=[find]
  res.status(200).send({
        data:check,
    message: "companyimage get sucessfully"
  })
 }
  const createcustomeraccount = async (req, res) => {
    
    try {
      // console.log(req.files,"reqqq")


      // Get the current date
      const currentDate = moment();
      req.body.startdate=moment(req.body.startdate).format('YYYY-MM-DD')
      if(req.body.scheme=='daily'){
        req.body.enddate= moment(req.body.startdate).add(100, 'days');
        req.body.enddate = moment(req.body.enddate).format('YYYY-MM-DD');
      }
      else{
        req.body.enddate= moment(req.body.startdate).add(77, 'days');
        req.body.enddate = moment(req.body.enddate).format('YYYY-MM-DD');
      }
      // Calculate the date after 7 days

      // Format the dates as desired
      const currentFormatted = currentDate.format('YYYY-MM-DD');
console.log(currentFormatted,req.body.startdate,req.body.enddate,"req.body.enddate")


      if (currentFormatted <= req.body.startdate) {

      }
      else {
        console.log("hellochennai")
        return res.status(200).send({ message: 'please enter current start date' });
      }
      if (req.body.startdate < req.body.enddate) {

      }
      else {
        console.log("hellomadurai")
        return res.status(200).send({ message: 'please enter current end date' });
      }
      console.log("12")
      console.log(req.body, "body")
      const existingUser = await Customeraccountmodel.findOne({ customerName: req.body.customerName });
      if (existingUser) {
        return res.status(200).send({ message: 'name already exists' });
      }
      // const existingEmail = await Customeraccountmodel.findOne({ Email: req.body.Email });
      // if (existingEmail) {
      //   return res.status(400).json({ error: 'email already exists' });
      // }
      const existingphone = await Customeraccountmodel.findOne({ phoneNo: req.body.phoneNo });
      if (existingphone) {
        return res.status(200).send({ message: 'phonenumber already exists' });
      }
      const existingemail = await Customeraccountmodel.findOne({ Email: req.body.Email });
      if (existingemail) {
        return res.status(200).send({ message: 'Email already exists' });
      }
      //   dueamount:{type:String},
      //   duedate:{type:Date},
      //   nextduedate:{type:Date},
      req.body.dueamount = ''
      req.body.duedate = ''
      req.body.nextduedate = ''


      if (req.body.scheme == "daily") {
        console.log("daily")
        console.log(req.body.startdate, "startdate---")

        let dueDate = moment(req.body.startdate).add(1, 'days');
        let nextdueDate = moment(req.body.startdate).add(2, 'days');
        req.body.duedate = dueDate.format('YYYY-MM-DD');
        req.body.nextduedate = nextdueDate.format('YYYY-MM-DD');
        console.log(req.body.duedate, req.body.nextduedate, "----")
        req.body.dueamount = req.body.amount / 100
        req.body.givenamount= req.body.amount-(req.body.amount*req.body.interest/100)
        // req.body.duedate=
        // req.body.nextduedate=
      }
      if (req.body.scheme == "weekly") {
        let dueDate = moment(req.body.startdate).add(7, 'days');
        let nextdueDate = moment(req.body.startdate).add(14, 'days');
        req.body.duedate = dueDate.format('YYYY-MM-DD');
        req.body.nextduedate = nextdueDate.format('YYYY-MM-DD');
        req.body.dueamount = req.body.amount / 10
        req.body.givenamount=  req.body.amount-(req.body.amount*req.body.interest/100)
      }
      if (req.body.scheme == "monthly") {
        // req.body.dueamount=req.body.amount/100
      }
      console.log(req.body.duedate, req.body.nextduedate, 'add')
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      var value = await Customeraccountmodel.create({
        customerName: req.body.customerName,
        Landmark: req.body.Landmark,
        Email:req.body.Email,
        phoneNo: req.body.phoneNo,
        //profilePicture:req.file.originalname?`https://alliswell-2.onrender.com/${req.file.originalname}`:null,
        profilePicture: req.body.profilePicture,
        scheme: req.body.scheme,
        amount: req.body.amount,
        password:hashedPassword,
        givenamount:req.body.givenamount,
        startdate: req.body.startdate,
        enddate: req.body.enddate,
        dueamount: req.body.dueamount,
        previousduedate: req.body.duedate,
        duedate: req.body.duedate,
        nextduedate: req.body.nextduedate,
        branchid:req.body.branchid,
        executeofficerId:req.body.executeofficerId,
        isextraplan: 'false',
        amountclose: 'false',
        role:"customer"
       
      })
      if(value.id!=''){
        const adminUsers = await Branchschememodel.find({_id:req.body.branchid}); 
        let balanceamount=adminUsers[0].currentAmount-req.body.givenamount
        if(adminUsers.length!=0){
          const value1 = await Branchschememodel.findOneAndUpdate(
            { _id:req.body.branchid }, 
            { currentAmount: balanceamount }, 
            { new: true }
          );
          const currentDate =moment();
          const currentFormatted = currentDate.format('YYYY-MM-DD');
          const currentFormattedtime = new Date().toLocaleTimeString("en-US", { timeZone: "Asia/Kolkata" });; 
          var value = await Stufftranscation.create({
            branchid: req.body.branchid,
            type:"reduce",
            authorid:req.body.admin_id,
            amount:req.body.givenamount,
            reason:"newcustomerCreate",
            isapprove:"true",
             currentAmount:balanceamount,
  approveldate:currentFormatted,
        approveltime:currentFormattedtime,  
        requestdate:currentFormatted,
        requesttime:currentFormattedtime
          })
        }

      }
      res.status(200).send({
        data: value,
        message: "Customer account created Successfully!"
      })
    }
    catch (err) {
      console.log(err, 'craete customer ')
      console.log("Something went wrong  post!!!", err)
    }
  }
  const addextracustomerplan = async (req, res) => {
    console.log("1hello")
    try {



      // Get the current date
    
      const currentDate = moment();
      req.body.startdate=moment(req.body.startdate).format('YYYY-MM-DD')
      if(req.body.scheme=='daily'){
        req.body.enddate= moment(req.body.startdate).add(100, 'days');
        req.body.enddate = moment(req.body.enddate).format('YYYY-MM-DD');
      }
      else{
        req.body.enddate= moment(req.body.startdate).add(77, 'days');
        req.body.enddate = moment(req.body.enddate).format('YYYY-MM-DD');
      }
      // Calculate the date after 7 days

      // Format the dates as desired
      const currentFormatted = currentDate.format('YYYY-MM-DD');
console.log(currentFormatted,req.body.startdate,req.body.enddate,"req.body.enddate")  
            if (currentFormatted <= req.body.startdate) {
      
            }
            else {
              return res.status(200).send({ message: 'please enter current start date' });
            }
            if (req.body.startdate < req.body.enddate) {
      
            }
            else {
              return res.status(200).send({ message: 'please enter current end date' });
            }
      const existingUser = await Customeraccountmodel.find({ _id: req.body.id });
      if (existingUser.length == 0) {
        return res.status(200).send({ message: 'id doesnot match' });
      }

      req.body.dueamount = ''
      req.body.duedate = ''
      req.body.nextduedate = ''
      let givenamount=''
      if (req.body.scheme == "daily") {
        console.log("daily",typeof(req.body.closeoldaccount))

        let dueDate = moment(req.body.startdate).add(1, 'days');
        let nextdueDate = moment(req.body.startdate).add(2, 'days');
        req.body.duedate = dueDate.format('YYYY-MM-DD');
        req.body.nextduedate = nextdueDate.format('YYYY-MM-DD');
        req.body.dueamount = req.body.amount / 100
        givenamount= req.body.amount-(req.body.amount*req.body.interest/100)
        if(req.body.closeoldaccount=="true"&&req.body.level==2){
          await Customeraccountmodel.updateMany(
            { _id: req.body.id, amountclose: "false" },
            { $set: { amountclose: "true" } }
        );
        
        await Addextracustomeraccountmodel.updateMany(
            { customer_id: req.body.id, amountclose: "false" },
            { $set: { amountclose: "true" } }
        );
        givenamount=req.body.balanceamount
        }
        if(req.body.closeoldaccount=="true"&&req.body.level==1){
          await Customeraccountmodel.updateMany(
            { _id: req.body.id, amountclose: "false" },
            { $set: { amountclose: "true" } }
        );
        
        await Addextracustomeraccountmodel.updateMany(
            { customer_id: req.body.id, amountclose: "false" },
            { $set: { amountclose: "true" } }
        );
        
        req.body.amount=req.body.amount+req.body.balanceamount
        givenamount=0
        req.body.dueamount=req.body.amount/100
        }
        // req.body.duedate=
        // req.body.nextduedate=
      }
      if (req.body.scheme == "weekly") {
        let dueDate = moment(req.body.startdate).add(7, 'days');
        let nextdueDate = moment(req.body.startdate).add(14, 'days');
        req.body.duedate = dueDate.format('YYYY-MM-DD');
        req.body.nextduedate = nextdueDate.format('YYYY-MM-DD');
        req.body.dueamount = req.body.amount / 10
        givenamount= req.body.amount-(req.body.amount*req.body.interest/100)
        if(req.body.closeoldaccount=="true"&&req.body.level==2){
          await Customeraccountmodel.updateMany(
            { _id: req.body.id, amountclose: "false" },
            { $set: { amountclose: "true" } }
        );
        
        await Addextracustomeraccountmodel.updateMany(
            { customer_id: req.body.id, amountclose: "false" },
            { $set: { amountclose: "true" } }
        );
        givenamount=req.body.balanceamount
        }
        if(req.body.closeoldaccount=="true"&&req.body.level==1){
          await Customeraccountmodel.updateMany(
            { _id: req.body.id, amountclose: "false" },
            { $set: { amountclose: "true" } }
        );
        
        await Addextracustomeraccountmodel.updateMany(
            { customer_id: req.body.id, amountclose: "false" },
            { $set: { amountclose: "true" } }
        );
        
        req.body.amount=req.body.amount+req.body.balanceamount
        givenamount=0
        req.body.dueamount=req.body.amount/10
        }
       
      }
      if (req.body.scheme == "monthly") {
        // req.body.dueamount=req.body.amount/100
      }
      let valueverify=await Customeraccountmodel.find({_id:req.body.id})
      console.log(req.body.duedate,givenamount,req.body.nextduedate, 'add')
      var value = await Addextracustomeraccountmodel.create({
        customerName: req.body.customerName,

        customer_id: req.body.id,
        givenamount:givenamount,
        // Email: req.body.Email,
        // phoneNo: req.body.phoneNo,
        scheme: req.body.scheme,
        amount: req.body.amount,
        LandMark:valueverify[0].LandMark,
        startdate: req.body.startdate,
        enddate: req.body.enddate,
        dueamount: req.body.dueamount,
        previousduedate: req.body.duedate,
        duedate: req.body.duedate,
        nextduedate: req.body.nextduedate,
        branchid:req.body.branchid,
        executeofficerId:req.body.executeofficerId,
        isextraplan: 'true',
        amountclose: 'false',

      })
      console.log("finish")
      if(value.id!=''){
        const adminUsers = await Branchschememodel.find({_id:req.body.branchid}); 
        let balanceamount=adminUsers[0].currentAmount-givenamount
        if(adminUsers.length!=0){
          const value1 = await Branchschememodel.findOneAndUpdate(
            { _id:req.body.branchid }, 
            { currentAmount: balanceamount }, 
            { new: true }
          );
          const currentDate = moment();
          const currentFormatted = currentDate.format('YYYY-MM-DD');
          const currentFormattedtime = new Date().toLocaleTimeString("en-US", { timeZone: "Asia/Kolkata" });
          var value = await Stufftranscation.create({
            branchid: req.body.branchid,
            type:"reduce",
            authorid:req.body.admin_id,
            amount:givenamount,
            reason:"addcustomerCreate",
            currentAmount:balanceamount,
            isapprove:"true",
            approveldate:currentFormatted,
            approveltime:currentFormattedtime,  
            requestdate:currentFormatted,
            requesttime:currentFormattedtime
           
          })
        }

      }
      res.status(200).send({
        data: value,
        message: "extraplanCustomer account created Successfully!"
      })
    }
    catch (err) {
      console.log("Something went wrong  post!!!", err)
    }
  }
const extraaccountbalance=async (req,res)=>{
  console.log("check")
    console.log(req.query.amount,req.query.interest,req.query.id)
    let givenamount=''
    givenamount= req.query.amount-(req.query.amount*req.query.interest/100)
    const existingUser = await Customeraccountmodel.find({_id: req.query.id,amountclose:"false"});
    const existingUser1 = await Addextracustomeraccountmodel.find({customer_id: req.query.id,amountclose:"false"});

    let finalcheck=[]
    if(existingUser.length==0&&existingUser1.length==0){
     let check={
        balanceamount:0,
        level:3
      }
      const existingUser = await Customeraccountmodel.find({_id: req.query.id});
     return res.status(200).send({
        
        data:[check],
        message:  `${customerName}, you have no pending amounts. Proceeding to the next process.`
      });
     }
    if(existingUser.length!=0){
      const result1 = await Customerpaylist.aggregate([
        { $match: { customer_id: req.query.id, status: "paid" } },
        { $group: { _id: "$customer_id", totalPaidAmount: { $sum: "$customerpayamount" } } }
      ]);

      if(result1.length!=0){

        finalcheck.push({totalPendingAmount:existingUser[0].amount-result1[0].totalPaidAmount})
      } 
      else{
        finalcheck.push({totalPendingAmount:existingUser[0].amount})

      }
    }
    if(existingUser1.length!=0){
      for (const user of existingUser1) {
        const result1 = await Customerpaylist.aggregate([
          { $match: { customer_id: user._id, status: "paid" } },
          { $group: { _id: "$customer_id", totalPaidAmount: { $sum: "$customerpayamount" } } }
        ]);
      
        let totalPaidAmount = 0;
      
        // Check if customer has any paid amount
        if (result1.length !== 0) {
          totalPaidAmount = user.amount-result1[0].totalPaidAmount;
        }
        else{
          totalPaidAmount=user.amount
        }
      
        finalcheck.push({
          customer_id: user.customer_id,
          totalPendingAmount:totalPaidAmount
        });
      }
      
    }
    const totalSum = finalcheck.reduce((sum, item) => {
      return sum + (item.totalPendingAmount || 0); // Ignore objects without `totalPendingAmount`
    }, 0);
    console.log(finalcheck,"finalcheck",totalSum)
    let balanceamount=0
   
    let level=0
    let check={}
    if(givenamount>=totalSum){
      balanceamount=givenamount-totalSum
      level=2
      check={
        balanceamount:balanceamount,
        level:2
      }
    }
    else{
      balanceamount=totalSum-givenamount
      level=1
      check={
        balanceamount:balanceamount,
        level:1
      }

    }
    let message=""
    let amounts = finalcheck.map(item => item.totalPendingAmount);
    console.log(amounts,'amounts')
    if(level==1){
      return res.status(200).send({
        
        data:[check],
        level:1,
        message : ` you currently have ${finalcheck.length} accounts. Total Pending Amount: ${totalSum}.Here is the breakdown of pending amounts: wise ${amounts} Your  given amount is ${givenamount} .so still you have pay ${balanceamount}  Do you want to proceed to the next process? Yes or No?`
        
      });
   

    }
    else{
      return res.status(200).send({
      data:[check],
      level:2,
      message : ` you currently have ${finalcheck.length} accounts. Total Pending Amount: ${totalSum}. Here is the breakdown of pending amounts: wise ${amounts}.Your  given amount is ${givenamount}, Your remaining balance amount is ${balanceamount}. Do you want to proceed to the next process? Yes or No?`
     
    });
    }
}
  const createscheme = async (req, res) => {
    console.log("1")
    try {
      console.log("12")
      console.log(req.body, "body")
      const existingUser = await Customerschememodel.findOne({ type: req.body.type });
      if (existingUser) {
        return res.status(200).send({ message: 'scheme already exists' });
      }

      var value = await Customerschememodel.create({
        type: req.body.type,

      })
      res.status(200).send({
        data: value,
        message: "scheme created Successfully!"
      })
    }
    catch (err) {
      console.log("Something went wrong  post!!!", err)
    }
  }
  const todayallcustomer = async (req, res) => {
    console.log("1")
    try {
      console.log("12")
      console.log(req.query.branchid,req.query.role, "body")
      const currentDate = moment();
      const currentFormatted = currentDate.format('YYYY-MM-DD');
      console.log(currentFormatted, "currentFormatted")
      req.query.branchid=req.query.branchid==undefined?'':req.query.branchid
let data=""
let data1=''
if(req.query.role=="Superadmin"){
  if(req.query.branchid==''){
    console.log("checkall")
    data = await Customerpaylist.find({ coustomerduedate: currentFormatted }).populate("executeofficerId") // Populating from Adminaccount
    .populate("branchid");
    data1=await Customeraccountmodel.find()
    data1=data1.length
  }
  else{
    data = await Customerpaylist.find({ coustomerduedate: currentFormatted,branchid:req.query.branchid}).populate("executeofficerId") // Populating from Adminaccount
    .populate("branchid");
    data1=await Customeraccountmodel.find({branchid:req.query.branchid})
    data1=data1.length
  }
  
}
if(req.query.role=="admin"){
  console.log("admin")
  data = await Customerpaylist.find({ coustomerduedate: currentFormatted,branchid:req.query.branchid})
   data1=await Customeraccountmodel.find({branchid:req.query.branchid}).populate("executeofficerId") // Populating from Adminaccount
   .populate("branchid");
    data1=data1.length
}
if(req.query.role=='executeofficer'){
  data = await Customerpaylist.find({ coustomerduedate: currentFormatted ,branchid:req.query.branchid,executeofficerId:req.query.executeofficerId}).populate("executeofficerId") // Populating from Adminaccount
  .populate("branchid");
}
const todayfullAmount = data.reduce((sum, customer) => sum + customer.customerdueamount, 0);
const todayreceivedAmount = data
    .filter(customer => customer.status === "paid")
    .reduce((sum, customer) => sum + customer.customerpayamount, 0);
const todaypendingAmount = data
    .filter(customer => customer.status === "unpaid")
    .reduce((sum, customer) => sum + customer.customerdueamount, 0);
      
      res.status(200).send({
        data: data,
       
        message: "All customer listed Successfully!",
        todayfullAmount:todayfullAmount,
        todayreceivedAmount:todayreceivedAmount,
        todaypendingAmount:todaypendingAmount,
        totalcustomer:data1
      })
    }
    catch (err) {
      console.log("Something went wrong  post!!!", err)
    }
  }
  const collectionvalue = async (req, res) => {
    const currentDate = moment();
    const currentFormatted = currentDate.format("YYYY-MM-DD");
  
    let data = await Customerpaylist.find({ coustomerduedate: currentFormatted }).populate("branchid");
  
    const branchSummary = {};
  
    data.forEach(customer => {
      const branchId = customer.branchid._id;
      const branchName = customer.branchid.Name;
      const customerDueDate = customer.coustomerduedate; // Adding due date
  
      if (!branchSummary[branchId]) {
        branchSummary[branchId] = {
          branchid: branchId,
          branchName: branchName,
          totalAmount: 0,
          receivedAmount: 0,
          pendingAmount: 0,
          customerDueDate: customerDueDate // Storing due date
        };
      }
  
      // Add total due amount
      branchSummary[branchId].totalAmount += customer.customerdueamount;
  
      // Add received amount if status is 'paid'
      if (customer.status === "paid") {
        branchSummary[branchId].receivedAmount += customer.customerpayamount;
      }
    });
  
    // Calculate pending amount
    for (const branch in branchSummary) {
      branchSummary[branch].pendingAmount =
        branchSummary[branch].totalAmount - branchSummary[branch].receivedAmount;
    }
  
    const result = Object.values(branchSummary);
  
    console.log(result);
    result.forEach(async(value)=>{
      var value = await collection.create({
        branchid: value.branchid,
        
        branchName:value.branchName,
        receivedAmount: value.receivedAmount,
        totalAmount: value.totalAmount,
        pendingAmount: value.pendingAmount,
        customerDueDate: value.customerDueDate,
      })
    })
  };
  const collectionlistall=async(req,res)=>{
    let data=await collection.find()
    res.status(200).send({
      data: data,
      message: "all customer listed Successfully!"
    })
  }


  const filterbasecustomer = async (req, res) => {
    console.log("1")
    try {
      const currentDate = moment();
      const currentFormatted = currentDate.format('YYYY-MM-DD');
      // console.log(currentFormatted, "currentFormatted")
      // const existingUser = await Customerpaylist.find({duedate: currentFormatted });\
      let existingUser=''
      if(req.body.branchid=="All"){
         existingUser = await Customerpaylist.find({  coustomerduedate: currentFormatted });
      }
      else{
        existingUser = await Customerpaylist.find({  coustomerduedate: currentFormatted,branchid:req.body.branchid});
      }
      
     


      res.status(200).send({
        data: existingUser,
        message: "all customer listed Successfully!"
      })
    }
    catch (err) {
      console.log("Something went wrong  post!!!", err)
    }
  }
  const particularcustomertransaction = async (req, res) => {
    console.log("1")
    try {
     
      // console.log(currentFormatted, "currentFormatted")
      // const existingUser = await Customerpaylist.find({duedate: currentFormatted });\
      let { id, status } = req.query;
     
     
     
     
       let existingUser = await Customerpaylist.find(
        {customer_id:id,status:status}
       ).populate("executeofficerId") // Populating from Adminaccount
       .populate("branchid"); // Populating from Branchschememodel;;
    
      
      
     


      res.status(200).send({
        data: existingUser,
        message: "all customer listed Successfully!"
      })
    }
    catch (err) {
      console.log("Something went wrong  post!!!", err)
    }
  }
  const viewcustomertransaction = async (req, res) => {
    console.log("1")
    try {
     
      // console.log(currentFormatted, "currentFormatted")
      // const existingUser = await Customerpaylist.find({duedate: currentFormatted });\
       
     
       let existingUser = await Customerpaylist.find({_id:req.query.id}).populate("executeofficerId") // Populating from Adminaccount
       .populate("branchid"); // Populating from Branchschememodel;;
    
      
      
     


      res.status(200).send({
        data: existingUser,
        message: "all customer listed Successfully!"
      })
    }
    catch (err) {
      console.log("Something went wrong  post!!!", err)
    }
  }
  const customerdetails = async (req, res) => {
    console.log("*********>>>>>><<<<<<", req.body)
    try {
      const existingUsers = await Customerpaylist.find({ customer_id: req.query.customer_id });
      
      if (existingUsers[0].extraplan == 'true') {
        let findone = await Addextracustomeraccountmodel.find({ _id: req.query.customer_id })
        console.log(findone, "findone")
        const existingUsers = await Customerpaylist.find({ customer_id: req.query.customer_id });
        let payedamount = 0;
        let pendingamount = 0;
        existingUsers.forEach(val => {
          if (val.customerpayamount) {
            payedamount = payedamount + parseInt(val.customerpayamount)
          }
        })


        const existingUser = await Customerpaylist.find({ _id: req.query.id })
        console.log(existingUser, "customr paylist .....*******&&&&&&")

        pendingamount = findone[0].amount - payedamount
        console.log(findone[0].amount, payedamount, pendingamount, "existingUser")
        let result = {}

        let goodresult = []
        result["_id"] = existingUser[0]._id
        result["customer_id"] = existingUser[0].customer_id
        result["status"] = existingUser[0].status
        result["alreadypayment"] = existingUser[0].alreadypayment
        result["customername"] = existingUser[0].customername
        result["customerphonenumber"] = existingUser[0].customerphonenumber
        result["customerscheme"] = existingUser[0].customerscheme
        result["customerdueamount"] = existingUser[0].customerdueamount
        result["coustomerduedate"] = existingUser[0].coustomerduedate
        result["extraplan"] = existingUser[0].extraplan
        // result[]

        result["payedamount"] = payedamount
        result["pendingamount"] = pendingamount
        result["Dueamount"] = payedamount + pendingamount;
        result["Landmark"] = existingUser[0].LandMark;
        result["profilePicture"] = existingUser[0].profilePicture;
        goodresult.push(result)

        res.status(200).send({
          data: goodresult,
          message: "****** customer listed Successfully!"
        })
      }
      else {
        let findone = await Customeraccountmodel.find({ _id: req.query.customer_id })
        const existingUsers = await Customerpaylist.find({ customer_id: req.query.customer_id });
        let payedamount = 0;
        let pendingamount = 0;
        existingUsers.forEach(val => {
          if (val.customerpayamount) {
            payedamount = payedamount + parseInt(val.customerpayamount)
          }
        })



        const existingUser = await Customerpaylist.find({ _id: req.query.id })

        pendingamount = findone[0].amount - payedamount
        console.log(payedamount, pendingamount, "existingUser")
        let result = {}

        let goodresult = []
        result["_id"] = existingUser[0]._id
        result["customer_id"] = existingUser[0].customer_id
        result["status"] = existingUser[0].status
        result["alreadypayment"] = existingUser[0].alreadypayment
        result["customername"] = existingUser[0].customername
        result["customerphonenumber"] = existingUser[0].customerphonenumber
        result["customerscheme"] = existingUser[0].customerscheme
        result["customerdueamount"] = existingUser[0].customerdueamount
        result["coustomerduedate"] = existingUser[0].coustomerduedate
        result["extraplan"] = "false"
        result["payedamount"] = payedamount
        result["pendingamount"] = pendingamount
        result["Dueamount"] = payedamount + pendingamount
        result["Landmark"] = existingUser[0].LandMark
       result["profilePicture"] = existingUser[0].profilePicture;

        goodresult.push(result)


        res.status(200).send({
          data: goodresult,
          message: "<<<<<<<<all customer listed Successfully!"
        })
      }





    }
    catch (err) {
      console.log("Something went wrong  post!!!", err)
    }
  }
  const todaycustomerupdate = async (req, res) => {
    console.log("1")
    try {
      const currentDate = moment();
      const currentFormatted = currentDate.format('YYYY-MM-DD');
      const existingUser = await Customeraccountmodel.find({ duedate: currentFormatted });
      const existingextraUser = await Addextracustomeraccountmodel.find({ duedate: currentFormatted });
      console.log(existingUser, "existingUser")

      existingUser.forEach(async val => {

        console.log(val, "vallllll")
        if (val.scheme == 'daily' && val.amountclose != 'true') {

          var value = await Customerpaylist.create({
            customer_id: val._id,
            status: 'unpaid',
            alreadypayment: 'false',
            profilePicture: val.profilePicture,
            LandMark: val.Landmark,
            customername: val.customerName,
            customerphonenumber: val.phoneNo,
            customerscheme: val.scheme,
            coustomerduedate: val.previousduedate,
            customerdueamount: val.dueamount,
            customerpayamount: 0,
            branchid:val.branchid,
            executeofficerId:val.executeofficerId,

            extraplan: "false"
          })
          let dueDate = moment().add(2, 'days');
          let final = dueDate.format('YYYY-MM-DD');
          console.log(final, "final")
          await Customeraccountmodel.findOneAndUpdate({ _id: val._id }, { previousduedate: val.duedate, duedate: val.nextduedate, nextduedate: final }, { new: true })

        }
        else if (val.scheme == 'weekly' && val.amountclose != 'true') {
          var value = await Customerpaylist.create({
            customer_id: val._id,
            status: 'unpaid',
            alreadypayment: 'false',
            customername: val.customerName,
            profilePicture: val.profilePicture,
            branchid:val.branchid,
            executeofficerId:val.executeofficerId,
            LandMark: val.Landmark,
            customerphonenumber: val.phoneNo,
            customerscheme: val.scheme,
            coustomerduedate: val.previousduedate,
            customerdueamount: val.dueamount,
            customerpayamount: 0,
            extraplan: "false",
           
          })
          let dueDate = moment().add(14, 'days');
          let final = dueDate.format('YYYY-MM-DD');
          console.log(final, "final")
          await Customeraccountmodel.findOneAndUpdate({ _id: val._id }, { previousduedate: val.duedate, duedate: val.nextduedate, nextduedate: final }, { new: true })
        }
        else {

        }
      })

      existingextraUser.forEach(async val => {
        if (val.scheme == 'daily' && val.amountclose != 'true') {

          var value = await Customerpaylist.create({
            customer_id: val._id,
            maincustomer_id: val.customer_id,
            status: 'unpaid',
            alreadypayment: 'false',
            customername: val.customerName,
            customerphonenumber: val.phoneNo,
            customerscheme: val.scheme,
            coustomerduedate: val.previousduedate,
            customerdueamount: val.dueamount,
            customerpayamount: 0,
            extraplan: "true",
            profilePicture: val.profilePicture,
            branchid:val.branchid,
            executeofficerId:val.executeofficerId,
          })
          let dueDate = moment().add(2, 'days');
          let final = dueDate.format('YYYY-MM-DD');
          console.log(final, "final")
          await Addextracustomeraccountmodel.findOneAndUpdate({ _id: val._id }, { previousduedate: val.duedate, duedate: val.nextduedate, nextduedate: final }, { new: true })

        }
        else if (val.scheme == 'weekly' && val.amountclose != 'true') {
          var value = await Customerpaylist.create({
            customer_id: val._id,
            status: 'unpaid',
            alreadypayment: 'false',
            customername: val.customerName,
            customerphonenumber: val.phoneNo,
            customerscheme: val.scheme,
            coustomerduedate: val.previousduedate,
            customerdueamount: val.dueamount,
            customerpayamount: 0,
            maincustomer_id: val.customer_id,
            extraplan: "true",
            profilePicture: val.profilePicture,
            branchid:val.branchid,
            executeofficerId:val.executeofficerId,
          })
          let dueDate = moment().add(14, 'days');
          let final = dueDate.format('YYYY-MM-DD');
          // console.log(final, "final")
          await Addextracustomeraccountmodel.findOneAndUpdate({ _id: val._id }, { previousduedate: val.duedate, duedate: val.nextduedate, nextduedate: final }, { new: true })
        }
        else {

        }
      })
      res.status(200).send({

        message: "all customer listed Successfully!"
      })
    }
    catch (err) {
      console.log("Something went wrong  post!!!", err)
    }
  }
  const todayindividualcustomerupdate = async (req, res) => {

    try {
      const currentDate = moment();
      const currentFormatted = currentDate.format('YYYY-MM-DD');
      const existingUser = await Customerpaylist.find({ _id: req.body.id });
      console.log(existingUser, "exist---")
      if (existingUser[0].extraplan == 'true') {
        if (existingUser[0].alreadypayment == 'true') {

          let User = await Customerpaylist.find({ customer_id: existingUser[0].customer_id, coustomerduedate: { $gte: currentFormatted } });
          console.log(User.length, "length")
          User.forEach(async (val, i) => {
            if (i == 0) {

            }
            else {
              console.log("delete")
              let dele = await Customerpaylist.deleteOne({ _id: val._id })
              await Customerpaylist.find();
              console.log(dele, "delete")
            }

          })
        }


        const existingUser1 = await Customerpaylist.find({ _id: req.body.id });
        console.log("existingUser1", existingUser1)

        let extrapayment = 2 * existingUser1[0].customerdueamount
        if (req.body.payamount < extrapayment) {
          if (existingUser1[0].alreadypayment == 'true' && existingUser1[0].customerscheme == 'daily') {
            await Customerpaylist.findOneAndUpdate({ _id: existingUser1[0]._id }, { customerpayamount: req.body.payamount, status: "paid", alreadypayment: "true" }, { new: true })
            let dueDate = moment(existingUser1[0].coustomerduedate).add(2, 'days');
            let final = dueDate.format('YYYY-MM-DD');
            let nextdueDate = moment(existingUser1[0].coustomerduedate).add(1, 'days');
            let nextfinal = nextdueDate.format('YYYY-MM-DD');
            let v = await Addextracustomeraccountmodel.findOneAndUpdate({ _id: existingUser1[0].customer_id }, { previousduedate: existingUser1[0].coustomerduedate, duedate: nextfinal, nextduedate: final }, { new: true })
          }
          else if (existingUser1[0].alreadypayment == 'true' && existingUser1[0].customerscheme == 'weekly') {
            await Customerpaylist.findOneAndUpdate({ _id: existingUser1[0]._id }, { customerpayamount: req.body.payamount, status: "paid", alreadypayment: "true" }, { new: true })
            let dueDate = moment(existingUser1[0].coustomerduedate).add(14, 'days');
            let final = dueDate.format('YYYY-MM-DD');
            let nextdueDate = moment(existingUser1[0].coustomerduedate).add(7, 'days');
            let nextfinal = nextdueDate.format('YYYY-MM-DD');
            let v = await Addextracustomeraccountmodel.findOneAndUpdate({ _id: existingUser1[0].customer_id }, { previousduedate: existingUser1[0].coustomerduedate, duedate: nextfinal, nextduedate: final }, { new: true })
          }
          else {
            await Customerpaylist.findOneAndUpdate({ _id: existingUser1[0]._id }, { customerpayamount: req.body.payamount, status: "paid", alreadypayment: "true" }, { new: true })
            await Customerpaylist.find();
          }

        }
        else {
          console.log("3")
          let extraamount = req.body.payamount - existingUser1[0].customerdueamount
          console.log("extraamount", extraamount, existingUser1[0].customerdueamount, "existingUser[0].customerdueamount")
          await Customerpaylist.findOneAndUpdate({ _id: existingUser1[0]._id }, { customerpayamount: existingUser1[0].customerdueamount, status: "paid", alreadypayment: "true" }, { new: true })
          let remaining = extraamount / existingUser1[0].customerdueamount;

          let countremaining = parseInt(remaining)

          for (i = 0; i < countremaining; i++) {
            let corretremaining = extraamount

            if (existingUser1[0].customerscheme == 'daily') {
              let paymentvalue = ''
              if (corretremaining < extrapayment) {
                console.log("4")
                paymentvalue = corretremaining
              }
              else {
                console.log("5")
                extraamount = corretremaining - existingUser1[0].customerdueamount

                paymentvalue = existingUser1[0].customerdueamount
              }

              if (existingUser1[0].alreadypayment == 'true' && existingUser1[0].customerscheme == 'daily') {
                const existingUser = await Customerpaylist.find({ customer_id: existingUser1[0].customer_id });
                const userfinal = existingUser[existingUser.length - 1];
                console.log(userfinal, "userfinal")
                let dueDate = moment(userfinal.coustomerduedate).add(2, 'days');
                let nextdueDate = moment(userfinal.coustomerduedate).add(3, 'days');
                req.body.duedate = dueDate.format('YYYY-MM-DD');
                req.body.nextduedate = nextdueDate.format('YYYY-MM-DD');
                console.log(userfinal, "userfinal")
                let previousdueDate = moment(userfinal.coustomerduedate).add(1, 'days');
                req.body.preduedate = previousdueDate.format('YYYY-MM-DD');
                let finalcheck = await Addextracustomeraccountmodel.find({ _id: existingUser1[0].customer_id })
                let v = await Addextracustomeraccountmodel.findOneAndUpdate({ _id: userfinal.customer_id }, { previousduedate: req.body.preduedate, duedate: req.body.duedate, nextduedate: req.body.nextduedate }, { new: true })
                var value = await Customerpaylist.create({
                  customer_id: existingUser1[0].customer_id,
                  status: 'paid',
                  alreadypayment: 'true',
                  customername: finalcheck[0].customerName,
                  customerphonenumber: finalcheck[0].phoneNo,
                  customerscheme: finalcheck[0].scheme,
                  coustomerduedate: v.previousduedate,
                  customerdueamount: finalcheck[0].dueamount,
                  customerpayamount: paymentvalue
                })
              }
              else {
                let finalcheck = await Addextracustomeraccountmodel.find({ _id: existingUser1[0].customer_id })
                let dueDate = moment(finalcheck[0].nextduedate).add(1, 'days');
                let final = dueDate.format('YYYY-MM-DD');

                let v = await Addextracustomeraccountmodel.findOneAndUpdate({ _id: existingUser1[0].customer_id }, { previousduedate: finalcheck[0].duedate, duedate: finalcheck[0].nextduedate, nextduedate: final }, { new: true })
                var value = await Customerpaylist.create({
                  customer_id: existingUser1[0].customer_id,
                  status: 'paid',
                  alreadypayment: 'true',
                  customername: finalcheck[0].customerName,
                  customerphonenumber: finalcheck[0].phoneNo,
                  customerscheme: finalcheck[0].scheme,
                  coustomerduedate: v.previousduedate,
                  customerdueamount: finalcheck[0].dueamount,
                  customerpayamount: paymentvalue
                })
              }



            }
            if (existingUser1[0].customerscheme == 'weekly') {
              let paymentvalue = ''
              if (corretremaining < extrapayment) {
                console.log("4")
                paymentvalue = corretremaining
              }
              else {
                console.log("5")
                extraamount = corretremaining - existingUser1[0].customerdueamount

                paymentvalue = existingUser1[0].customerdueamount
              }

              if (existingUser1[0].alreadypayment == 'true' && existingUser1[0].customerscheme == 'daily') {
                const existingUser = await Customerpaylist.find({ customer_id: existingUser1[0].customer_id });
                const userfinal = existingUser[existingUser.length - 1];
                console.log(userfinal, "userfinal")
                let dueDate = moment(userfinal.coustomerduedate).add(8, 'days');
                let nextdueDate = moment(userfinal.coustomerduedate).add(9, 'days');
                req.body.duedate = dueDate.format('YYYY-MM-DD');
                req.body.nextduedate = nextdueDate.format('YYYY-MM-DD');
                console.log(userfinal, "userfinal")
                let previousdueDate = moment(userfinal.coustomerduedate).add(7, 'days');
                req.body.preduedate = previousdueDate.format('YYYY-MM-DD');
                let finalcheck = await Addextracustomeraccountmodel.find({ _id: existingUser1[0].customer_id })
                let v = await Addextracustomeraccountmodel.findOneAndUpdate({ _id: userfinal.customer_id }, { previousduedate: req.body.preduedate, duedate: req.body.duedate, nextduedate: req.body.nextduedate }, { new: true })
                var value = await Customerpaylist.create({
                  customer_id: existingUser1[0].customer_id,
                  status: 'paid',
                  alreadypayment: 'true',
                  customername: finalcheck[0].customerName,
                  customerphonenumber: finalcheck[0].phoneNo,
                  customerscheme: finalcheck[0].scheme,
                  coustomerduedate: v.previousduedate,
                  customerdueamount: finalcheck[0].dueamount,
                  customerpayamount: paymentvalue
                })
              }
              else {
                let finalcheck = await Addextracustomeraccountmodel.find({ _id: existingUser1[0].customer_id })
                let dueDate = moment(finalcheck[0].nextduedate).add(7, 'days');
                let final = dueDate.format('YYYY-MM-DD');

                let v = await Addextracustomeraccountmodel.findOneAndUpdate({ _id: existingUser1[0].customer_id }, { previousduedate: finalcheck[0].duedate, duedate: finalcheck[0].nextduedate, nextduedate: final }, { new: true })
                var value = await Customerpaylist.create({
                  customer_id: existingUser1[0].customer_id,
                  status: 'paid',
                  alreadypayment: 'true',
                  customername: finalcheck[0].customerName,
                  customerphonenumber: finalcheck[0].phoneNo,
                  customerscheme: finalcheck[0].scheme,
                  coustomerduedate: v.previousduedate,
                  customerdueamount: finalcheck[0].dueamount,
                  customerpayamount: paymentvalue
                })
              }



            }
          }
        }
        const checkingstatus = await Customerpaylist.find({ _id: req.body.id });
        const checkingvalue = await Addextracustomeraccountmodel.find({ _id: checkingstatus[0].customer_id })
        console.log(checkingvalue, "checkingvalue")
        const checkingfind = await Customerpaylist.find({ customer_id: checkingstatus[0].customer_id });
        let totolpayedamount = 0
        checkingfind.forEach(val => {
          if (val.customerpayamount) {
            totolpayedamount = totolpayedamount + val.customerpayamount
          }
        })
        console.log(totolpayedamount, checkingvalue[0].amount, 'total')

        if (totolpayedamount == checkingvalue[0].amount) {
          await Addextracustomeraccountmodel.findOneAndUpdate({ _id: checkingvalue[0]._id }, { amountclose: "true" }, { new: true })
        }
        else {
          await Addextracustomeraccountmodel.findOneAndUpdate({ _id: checkingvalue[0]._id }, { amountclose: "false" }, { new: true })
        }
      }
      else {
        console.log("all are welcome")
        if (existingUser[0].alreadypayment == 'true') {

          let User = await Customerpaylist.find({ customer_id: existingUser[0].customer_id, coustomerduedate: { $gte: currentFormatted } });
          console.log(User.length, "length")
          User.forEach(async (val, i) => {
            if (i == 0) {

            }
            else {
              console.log("delete")
              let dele = await Customerpaylist.deleteOne({ _id: val._id })
              await Customerpaylist.find();
              console.log(dele, "delete")
            }

          })
        }


        const existingUser1 = await Customerpaylist.find({ _id: req.body.id });
        console.log("existingUser1", existingUser1)

        let extrapayment = 2 * existingUser1[0].customerdueamount
        if (req.body.payamount < extrapayment) {
          if (existingUser1[0].alreadypayment == 'true' && existingUser1[0].customerscheme == 'daily') {
            await Customerpaylist.findOneAndUpdate({ _id: existingUser1[0]._id }, { customerpayamount: req.body.payamount, status: "paid", alreadypayment: "true", admin_id: req.body.admin_id, adminname: req.body.adminname }, { new: true })
            let dueDate = moment(existingUser1[0].coustomerduedate).add(2, 'days');
            let final = dueDate.format('YYYY-MM-DD');
            let nextdueDate = moment(existingUser1[0].coustomerduedate).add(1, 'days');
            let nextfinal = nextdueDate.format('YYYY-MM-DD');
            let v = await Customeraccountmodel.findOneAndUpdate({ _id: existingUser1[0].customer_id }, { previousduedate: existingUser1[0].coustomerduedate, duedate: nextfinal, nextduedate: final }, { new: true })
          }
          else if (existingUser1[0].alreadypayment == 'true' && existingUser1[0].customerscheme == 'weekly') {
            await Customerpaylist.findOneAndUpdate({ _id: existingUser1[0]._id }, { customerpayamount: req.body.payamount, status: "paid", alreadypayment: "true", admin_id: req.body.admin_id, adminname: req.body.adminname }, { new: true })
            let dueDate = moment(existingUser1[0].coustomerduedate).add(14, 'days');
            let final = dueDate.format('YYYY-MM-DD');
            let nextdueDate = moment(existingUser1[0].coustomerduedate).add(7, 'days');
            let nextfinal = nextdueDate.format('YYYY-MM-DD');
            let v = await Customeraccountmodel.findOneAndUpdate({ _id: existingUser1[0].customer_id }, { previousduedate: existingUser1[0].coustomerduedate, duedate: nextfinal, nextduedate: final }, { new: true })
          }
          else {
            await Customerpaylist.findOneAndUpdate({ _id: existingUser1[0]._id }, { customerpayamount: req.body.payamount, status: "paid", alreadypayment: "true", admin_id: req.body.admin_id, adminname: req.body.adminname }, { new: true })
            await Customerpaylist.find();
          }

        }
        else {
          console.log("3")
          let extraamount = req.body.payamount - existingUser1[0].customerdueamount
          console.log("extraamount", extraamount, existingUser1[0].customerdueamount, "existingUser[0].customerdueamount")
          await Customerpaylist.findOneAndUpdate({ _id: existingUser1[0]._id }, { customerpayamount: existingUser1[0].customerdueamount, status: "paid", alreadypayment: "true", admin_id: req.body.admin_id, adminname: req.body.adminname }, { new: true })
          let remaining = extraamount / existingUser1[0].customerdueamount;

          let countremaining = parseInt(remaining)

          for (i = 0; i < countremaining; i++) {
            let corretremaining = extraamount

            if (existingUser1[0].customerscheme == 'daily') {
              let paymentvalue = ''
              if (corretremaining < extrapayment) {
                console.log("4")
                paymentvalue = corretremaining
              }
              else {
                console.log("5")
                extraamount = corretremaining - existingUser1[0].customerdueamount

                paymentvalue = existingUser1[0].customerdueamount
              }

              if (existingUser1[0].alreadypayment == 'true' && existingUser1[0].customerscheme == 'daily') {
                const existingUser = await Customerpaylist.find({ customer_id: existingUser1[0].customer_id });
                const userfinal = existingUser[existingUser.length - 1];
                console.log(userfinal, "userfinal")
                let dueDate = moment(userfinal.coustomerduedate).add(2, 'days');
                let nextdueDate = moment(userfinal.coustomerduedate).add(3, 'days');
                req.body.duedate = dueDate.format('YYYY-MM-DD');
                req.body.nextduedate = nextdueDate.format('YYYY-MM-DD');
                console.log(userfinal, "userfinal")
                let previousdueDate = moment(userfinal.coustomerduedate).add(1, 'days');
                req.body.preduedate = previousdueDate.format('YYYY-MM-DD');
                let finalcheck = await Customeraccountmodel.find({ _id: existingUser1[0].customer_id })
                let v = await Customeraccountmodel.findOneAndUpdate({ _id: userfinal.customer_id }, { previousduedate: req.body.preduedate, duedate: req.body.duedate, nextduedate: req.body.nextduedate }, { new: true })
                var value = await Customerpaylist.create({
                  customer_id: existingUser1[0].customer_id,
                  status: 'paid',
                  alreadypayment: 'true',
                  customername: finalcheck[0].customerName,
                  customerphonenumber: finalcheck[0].phoneNo,
                  customerscheme: finalcheck[0].scheme,
                  coustomerduedate: v.previousduedate,
                  customerdueamount: finalcheck[0].dueamount,
                  customerpayamount: paymentvalue,
                  admin_id: req.body.admin_id,
                  adminname: req.body.adminname
                })
              }
              else {
                let finalcheck = await Customeraccountmodel.find({ _id: existingUser1[0].customer_id })
                let dueDate = moment(finalcheck[0].nextduedate).add(1, 'days');
                let final = dueDate.format('YYYY-MM-DD');

                let v = await Customeraccountmodel.findOneAndUpdate({ _id: existingUser1[0].customer_id }, { previousduedate: finalcheck[0].duedate, duedate: finalcheck[0].nextduedate, nextduedate: final }, { new: true })
                var value = await Customerpaylist.create({
                  customer_id: existingUser1[0].customer_id,
                  status: 'paid',
                  alreadypayment: 'true',
                  customername: finalcheck[0].customerName,
                  customerphonenumber: finalcheck[0].phoneNo,
                  customerscheme: finalcheck[0].scheme,
                  coustomerduedate: v.previousduedate,
                  customerdueamount: finalcheck[0].dueamount,
                  customerpayamount: paymentvalue,
                  admin_id: req.body.admin_id,
                  adminname: req.body.adminname
                })
              }



            }
            if (existingUser1[0].customerscheme == 'weekly') {
              let paymentvalue = ''
              if (corretremaining < extrapayment) {
                console.log("4")
                paymentvalue = corretremaining
              }
              else {
                console.log("5")
                extraamount = corretremaining - existingUser1[0].customerdueamount

                paymentvalue = existingUser1[0].customerdueamount
              }

              if (existingUser1[0].alreadypayment == 'true' && existingUser1[0].customerscheme == 'daily') {
                const existingUser = await Customerpaylist.find({ customer_id: existingUser1[0].customer_id });
                const userfinal = existingUser[existingUser.length - 1];
                console.log(userfinal, "userfinal")
                let dueDate = moment(userfinal.coustomerduedate).add(8, 'days');
                let nextdueDate = moment(userfinal.coustomerduedate).add(9, 'days');
                req.body.duedate = dueDate.format('YYYY-MM-DD');
                req.body.nextduedate = nextdueDate.format('YYYY-MM-DD');
                console.log(userfinal, "userfinal")
                let previousdueDate = moment(userfinal.coustomerduedate).add(7, 'days');
                req.body.preduedate = previousdueDate.format('YYYY-MM-DD');
                let finalcheck = await Customeraccountmodel.find({ _id: existingUser1[0].customer_id })
                let v = await Customeraccountmodel.findOneAndUpdate({ _id: userfinal.customer_id }, { previousduedate: req.body.preduedate, duedate: req.body.duedate, nextduedate: req.body.nextduedate }, { new: true })
                var value = await Customerpaylist.create({
                  customer_id: existingUser1[0].customer_id,
                  status: 'paid',
                  alreadypayment: 'true',
                  customername: finalcheck[0].customerName,
                  customerphonenumber: finalcheck[0].phoneNo,
                  customerscheme: finalcheck[0].scheme,
                  coustomerduedate: v.previousduedate,
                  customerdueamount: finalcheck[0].dueamount,
                  customerpayamount: paymentvalue,
                  admin_id: req.body.admin_id, adminname: req.body.adminname
                })
              }
              else {
                let finalcheck = await Customeraccountmodel.find({ _id: existingUser1[0].customer_id })
                let dueDate = moment(finalcheck[0].nextduedate).add(7, 'days');
                let final = dueDate.format('YYYY-MM-DD');

                let v = await Customeraccountmodel.findOneAndUpdate({ _id: existingUser1[0].customer_id }, { previousduedate: finalcheck[0].duedate, duedate: finalcheck[0].nextduedate, nextduedate: final }, { new: true })
                var value = await Customerpaylist.create({
                  customer_id: existingUser1[0].customer_id,
                  status: 'paid',
                  alreadypayment: 'true',
                  customername: finalcheck[0].customerName,
                  customerphonenumber: finalcheck[0].phoneNo,
                  customerscheme: finalcheck[0].scheme,
                  coustomerduedate: v.previousduedate,
                  customerdueamount: finalcheck[0].dueamount,
                  customerpayamount: paymentvalue,
                  admin_id: req.body.admin_id, adminname: req.body.adminname
                })
              }



            }
          }
        }
        const checkingstatus = await Customerpaylist.find({ _id: req.body.id });
        const checkingvalue = await Customeraccountmodel.find({ _id: checkingstatus[0].customer_id })
        console.log(checkingvalue, "checkingvalue")
        const checkingfind = await Customerpaylist.find({ customer_id: checkingstatus[0].customer_id });
        let totolpayedamount = 0
        checkingfind.forEach(val => {
          if (val.customerpayamount) {
            totolpayedamount = totolpayedamount + val.customerpayamount
          }
        })
        console.log(totolpayedamount, checkingvalue[0].amount, 'total')
        if (totolpayedamount == checkingvalue[0].amount) {
          await Customeraccountmodel.findOneAndUpdate({ _id: checkingvalue[0]._id }, { amountclose: "true" }, { new: true })
        }
        else {
          await Customeraccountmodel.findOneAndUpdate({ _id: checkingvalue[0]._id }, { amountclose: "false" }, { new: true })
        }

      }




      res.status(200).send({

        message: "all customer listed Successfully!"
      })
    }
    catch (err) {
      console.log("Something went wrong  post!!!", err)
    }
  }
  const Login = async (req, res) => {
    try {
      const { Email, password } = req.body;
      const phoneNo= req.body.phone
      console.log(phoneNo,"find")
      let a=""
      let b=""
     if(req.body.Email){
      
      a=await Adminaccountmodel.find({Email: Email})
      b=await Customeraccountmodel.find({Email:Email})
      
      if(a.length==0&&b.length==0){
        return res.status(201).send({ status: false, message: 'Invalid Email please check your gmail' })
      }
      // if(a[0]?.role=="customer"||b[0]?.role=="customer"){
      //  const passwordMatch= await bcrypt.compare(password, b[0].password);
      //   if (!passwordMatch) {
      //   return res.status(401).json({ status: false, msg: 'Invalid password' })
      // }
      // }
      // else{
      //   const passwordMatch= await bcrypt.compare(password, a[0].password);
      //   if (!passwordMatch) {
      //     return res.status(401).json({ status: false, msg: 'Invalid password' })
      //   }
      // }
      if(a.length>0){
        const expiresInMinutes = 30
        const token = jwt.sign({ a }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: `${expiresInMinutes}m` });
  console.log(a,"checkalll")
        res.status(200).json({
          userId: a[0]['_id'],
          username: a[0]['userName'],
          role: a[0]['role'],
          profilePicture: a[0]['profilePicture'] ? a[0]['profilePicture'] : null,
          message: 'logged In Successfully!',
          token
        });
      }
      else{
        const expiresInMinutes = 30
        const token = jwt.sign({ b }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: `${expiresInMinutes}m` });
  
        res.status(200).json({
          status:true,
          userId: b[0]['_id'].toString(),
          username: b[0]['customerName'],
          role: b[0]['role'],
          profilePicture: b[0]['profilePicture'] ? b[0]['profilePicture'] : null,
          message: 'logged In Successfully!',
          token
        });
      }
       
     }
    else{
      console.log("check")
      a=await Adminaccountmodel.find({phoneNo: phoneNo}).populate("branchid")
      b=await Customeraccountmodel.find({phoneNo:phoneNo}).populate("branchid")
      
      if(a.length==0&&b.length==0){
        return res.status(201).json({ status: false, message: 'Invalid Phoneno please check ' })
      }
      if(a[0]?.role=="customer"||b[0]?.role=="customer"){
       const passwordMatch= await bcrypt.compare(password, b[0].password);
        if (!passwordMatch) {
        return res.status(201).json({ status: false, message: 'Invalid password' })
      }
      }
      else{
        const passwordMatch= await bcrypt.compare(password, a[0].password);
        if (!passwordMatch) {
          return res.status(201).json({ status: false, message: 'Invalid password' })
        }
      }
      if(a.length>0){
        const expiresInMinutes = 30
        const token = jwt.sign({ a }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: `${expiresInMinutes}m` });
       

        res.status(200).json({
         "status": true,
    "responsecode": 201,
    "message": "OTP generated successfully",
    "data": {
      a,
        "phone": a[0].phoneNo,
        "email": a[0].Email,
         "phoneOtp": "234176"
    }
          
        });
      }
      else{
        const expiresInMinutes = 30
        const token = jwt.sign({ b }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: `${expiresInMinutes}m` });
  
        res.status(200).json({
          status:true,
          userId: b[0]['_id'],
          username: b[0]['customerName'],
          role: b[0]['role'],
          profilePicture: b[0]['profilePicture'] ? b['profilePicture'] : null,
          message: 'logged In Successfully!',
          token
        });
      }
    }

      // const passwordMatch = await bcrypt.compare(password, existingUser.password);
      // if (!passwordMatch) {
      //   return res.status(401).json({ status: false, msg: 'Invalid password' })
      // }

      
    } catch (err) {
      console.log('Something went wrong', err);
      res.status(500).send({ status: false, message: 'Internal Server Error' });
    }
  }
  const particularcustomerallaccount = async (req, res) => {
    try {
      
      let { id, status } = req.query;
      let filter = {};
      let filter1={}
     
      if (id){
        // let check=await Branchschememodel.find({Name:branch})
        filter._id = id
       } 
       
      if (status && status == "Active"){
        // let check=await Branchschememodel.find({Name:branch})
        filter.amountclose = "false"
       } 
      

      console.log(filter, "filter");
      const checkingvalue = await Customeraccountmodel.find(filter).populate("executeofficerId") // Populating from Adminaccount
      .populate("branchid"); // Populating from Branchschememodel;
     let checking=''
      if(checkingvalue.length!=0){
        if (checkingvalue[0]._id){
          // let check=await Branchschememodel.find({Name:branch})
          filter1.customer_id = checkingvalue[0]._id
         } 
         
        if (status && status == "Active"){
          // let check=await Branchschememodel.find({Name:branch})
          filter1.amountclose = "false"
         } 
          checking = await Addextracustomeraccountmodel.find(filter1)
      }
      
      let finalvalue = [...checkingvalue, ...checking]
      
      res.status(200).send({
        data: finalvalue,
        message: "all customer listed Successfully!"
      })
    } catch (err) {
      console.log('Something went wrong', err);
      res.status(500).send({ status: false, message: 'Internal Server Error' });
    }
  }
  const particularcustomerallaccount1 = async (req, res) => {
    try {
      
      let { id, status,executeofficerId } = req.query;
      let filter = {};
      let filter1 = {};
     let totalcount=0
      if (id&&id!='All'){
        let check=await Branchschememodel.find({Name:id})
        totalcount=await Customeraccountmodel.find({branchid:check[0]._id})
        totalcount=totalcount.length
        // let check=await Branchschememodel.find({Name:branch})
        filter.branchid = check[0]._id
        filter1.branchid = check[0]._id
       } 
       else{
        totalcount=await Customeraccountmodel.find()
        totalcount=totalcount.length
       }
       
      if (status && status != "All"){
        // let check=await Branchschememodel.find({Name:branch})
        filter.status = status
       } 
       if(executeofficerId&&executeofficerId!=''){
        filter.executeofficerId=executeofficerId
        filter1.executeofficerId=executeofficerId
       }
       const currentDate = moment();
       const currentFormatted = currentDate.format('YYYY-MM-DD');
       filter.coustomerduedate=currentFormatted
       filter1.coustomerduedate=currentFormatted
      console.log(filter, "filter");
      const checkingvalue = await Customerpaylist.find(filter).populate("executeofficerId") // Populating from Adminaccount
      .populate("branchid"); // Populating from Branchschememodel;
      const checkingvalue1 = await Customerpaylist.find(filter1).populate("executeofficerId") // Populating from Adminaccount
      .populate("branchid");
      const todayfullAmount = checkingvalue1.reduce((sum, customer) => sum + customer.customerdueamount, 0);
      const todayreceivedAmount = checkingvalue1
          .filter(customer => customer.status === "paid")
          .reduce((sum, customer) => sum + customer.customerpayamount, 0);
      const todaypendingAmount = checkingvalue1
          .filter(customer => customer.status === "unpaid")
          .reduce((sum, customer) => sum + customer.customerdueamount, 0);
            
            res.status(200).send({
              data: checkingvalue,
             
              message: "All customer listed Successfully!",
              todayfullAmount:todayfullAmount,
              todayreceivedAmount:todayreceivedAmount,
              todaypendingAmount:todaypendingAmount,
              totalcustomer:totalcount
            })
      
     
    } catch (err) {
      console.log('Something went wrong', err);
      res.status(500).send({ status: false, message: 'Internal Server Error' });
    }
  }
  const viewallhistroy = async (req, res) => {
    try {
      var customerId = req.body.id
      const checkingvalue = await Customerpaylist.find({ customer_id: customerId })

      res.status(200).send({
        data: checkingvalue,
        message: "all customer listed Successfully!"
      })
    } catch (err) {
      console.log('Something went wrong', err);
      res.status(200).send({ status: false, message: 'Internal Server Error' });
    }
  }
  const LoginVerifyToken = async (req, res) => {
    try {

      const hs = new HelperService();
      let {
        token
      } = req['body']

      if (!token)
        return res.status(201).send({ message: "Access Denied!" })

      token = token.toString().replace(/^"(.*)"$/, '$1')
      const decodedToken = await hs.decodeToken(token)
      // console.log(decodedToken, "---")

      if (!decodedToken)
        return res
          .status(401)
          .json({ status: false, message: "Session out" });

      if (decodedToken.status) {
        // delete decodedToken['status']
        res
          .status(200)
          .json({ status: true, message: "Token valid", data: decodedToken['data'] })
      }
      else
        res
          .status(400)
          .json({ status: false, message: "Invalid Token" })

    }
    catch (err) {
      console.log('Something went wrong', err);
      res.status(500).send({ status: false, message: 'Internal Server Error' });
    }
  }

  const fileUpload = async (req, res) => {
    try {
      console.log(req.file, "requst file upload")
      // let base_url = 'http://51.20.66.59:5000'
      let base_url='https://alliswell-1-cxjg.onrender.com'
      console.log(req.file.path, "req.file.path")
       console.log(base_url + req.file['path'].replaceAll('public', ''))
      res.status(200).json({
        // url: base_url + req.file['path'].replaceAll('public', '')
        url: `${base_url}/images/${req.file.filename}`,
        message:"fileUpload upload Successfully"
      })

    }
    catch (err) {
      console.log('fileeee.......', err);
      res.status(500).send({ status: false, message: 'Internal Server Error' });
    }
  }
  const createbranch=async(req,res)=>{
    try {
      console.log(req.body)
      const adminUsers = await Branchschememodel.find({Name:req.body.name});
      console.log(adminUsers.length,"check")
      if(adminUsers.length>0){
        return res.status(200).json({ message: 'the branchname already here' });
      }
      var value = await Branchschememodel.create({
        Name: req.body.name,
        totalinvestmentamount:req.body.totalInvestmentAmount,
        currentAmount:req.body.totalInvestmentAmount
       
      })
      res.status(200).send({
        data: value,
        message: `${req.body.name}branch created Successfully!`
      })
     
     
    }
    catch (err) {
      console.log('Something went wrong', err);
      res.status(500).send({ status: false, message: 'Internal Server Error' });
    }
  }
  const notificationlist = async (req, res) => {
    try {
      const moment = require("moment");
      const currentDate = moment();
      const currentFormatted = currentDate.format("YYYY-MM-DD");
  
      console.log(currentFormatted, "currentFormatted");
  
      // Step 1: Fetch unpaid customers with past due dates, sorted in descending order
      const adminUsers = await Customerpaylist.find(
        { coustomerduedate: { $lt: currentFormatted }, status: "unpaid" }
      ).sort({ coustomerduedate: -1 }); // Sorting by descending due date
  
      // Step 2: Group customers by dueDate
      const dueDateGroups = {};
  
      adminUsers.forEach((customer) => {
        const dueDate = customer.coustomerduedate;
  
        if (!dueDateGroups[dueDate]) {
          dueDateGroups[dueDate] = [];
        }
  
        dueDateGroups[dueDate].push(customer);
      });
  
      // Step 3: Convert to sorted array (optional)
      const sortedDueDateGroups = Object.keys(dueDateGroups)
        .sort((a, b) => new Date(b) - new Date(a)) // Sort descending
        .reduce((obj, key) => {
          obj[key] = dueDateGroups[key];
          return obj;
        }, {});
  
      res.status(200).send({
        data: sortedDueDateGroups,
      });
    } catch (err) {
      console.log("Something went wrong", err);
      res.status(500).send({ status: false, message: "Internal Server Error" });
    }
  };
  
  const getexecuteofficer=async(req,res)=>{
    try {
      console.log(req.query.id,"check")
      const adminUsers = await Adminaccountmodel.find({branchid:req.query.id,role:"executeofficer"});
      console.log(req.query.id,adminUsers,"adminUsersall")
      if(adminUsers.length==0){
        return res.status(200).send({ message: 'the branchname doesnot here' });
      }
     
      res.status(200).send({
        data: adminUsers,
        // message: `${req.body.name}branch created Successfully!`
      })
     
     
    }
    catch (err) {
      console.log('Something went wrong', err);
      res.status(500).send({ status: false, message: 'Internal Server Error' });
    }
  }
  const createform=async(req,res)=>{
    const adminUsers = await Customeraccountmodel.find({phoneNo:req.body.phoneNo});
    const adminUsers1 = await Customeraccountmodel.find({Email:req.body.Email});
      if(adminUsers.length!=0){
        return res.status(200).send({ message: 'phoneNo already here' });
      }
      if(adminUsers1.length!=0){
        return res.status(200).send({ message: 'Email already here' });
      }
      var value = await Formverification.create({
        Name: req.body.Name,
        location:req.body.location,
        branchid:req.body.branchid,
        verficationofficer:req.body.verficationofficer,
        phoneNo:req.body.phoneNo,
        Email:req.body.Email
       
      })
      res.status(200).send({
        data: value,
        message: `${req.body.Name} customer waitting for approvel!`
      })
  }
  const updateform=async(req,res)=>{
    const value = await Formverification.findOneAndUpdate(
      { _id: req.body.id }, 
      { verficationofficer: req.body.verficationofficer }, 
      { new: true }
  );
  
  if (!value) {
      return res.status(404).json({ success: false, message: "Record not found" });
  }
  
  console.log("Updated record:", value);
  
   
    res.status(200).send({
      
      message: "update Successfully!"
    })

  }
  const verificationapprovel = async (req, res) => {
    try {
      const value = await Formverification.findOneAndUpdate(
        { _id: req.body.id },
        { isapprove: true },
        { new: true }
      );
  
      if (!value) {
        return res.status(404).json({ success: false, message: "Record not found" });
      }
  
      console.log("Updated record:", value);
      
      // Emit update to ALL connected clients
      // req.app.get("io").emit("approvalUpdated", { id: req.body.id, isapprove: true });
  
      res.status(200).json({ message: "Update Successfully!", data: value });
    } catch (error) {
      console.error("Error in verificationapprovel:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };
  
  const updateverificationapprovel=async(req,res)=>{
    const value = await Formverification.findOneAndUpdate(
      { _id: req.query.id }, 
      { verficationofficer: req.query.verficationofficer }, 
      { new: true }
  );
  
  if (!value) {
      return res.status(404).json({ success: false, message: "Record not found" });
  }
  
  console.log("Updated record:", value);
  
   
    res.status(200).send({
      
      message: "update Successfully!"
    })
  }
  const updateverificationapprovel1=async(req,res)=>{
    const value = await Formverification.findOneAndUpdate(
      { _id: req.body.id }, 
      { verficationofficer: req.body.verficationofficer }, 
      { new: true }
  );
  
  if (!value) {
      return res.status(200).json({ success: false, message: "Record not found" });
  }
  
  console.log("Updated record:", value);
  
   
    res.status(200).send({
      
      message: "update Successfully!"
    })
  }
  const approvelaccount=async(req,res)=>{
    try {
      console.log(req.query.role,"check")
      let adminUsers=""
        if(req.query.role=="Superadmin"){
           adminUsers = await Formverification.find({isapprove:'true'})
           .populate("verficationofficer") // Populating from Adminaccount
           .populate("branchid"); // Populating from Branchschememodel
        }
        else if(req.query.role=="admin") {
           adminUsers = await Formverification.find({branchid:req.query.id,isapprove:'true'})
           .populate("verficationofficer") // Populating from Adminaccount
           .populate("branchid"); // Populating from Branchschememodel
        }
        else{
          adminUsers = await Formverification.find({verficationofficer:req.query.id,isapprove:'true'})
           .populate("verficationofficer") // Populating from Adminaccount
           .populate("branchid"); // Populating from Branchschememodel
        }
      
        res.status(200).send({
        data: adminUsers,
        message: "get all verfication  account Successfully!"
      })
     
     
    }
    catch (err) {
      console.log('Something went wrong', err);
      res.status(500).send({ status: false, message: 'Internal Server Error' });
    }
  }
  const verification = async (req, res) => {
    try {
        console.log(req.query.role, "req.body.role");
        let adminUsers = "";

        if (req.query.role == "Superadmin") {
            adminUsers = await Formverification.find({ isapprove: "false" })
                .populate("verficationofficer") // Populating from Adminaccount
                .populate("branchid"); // Populating from Branchschememodel
        } else if(req.query.role == "admin") {
          adminUsers = await Formverification.find({ branchid: req.query.id, isapprove: "false" })
          .populate("verficationofficer") 
          .populate("branchid"); 
           
        }else{
          adminUsers = await Formverification.find({ verficationofficer: req.query.id, isapprove: "false" })
          .populate("verficationofficer") 
          .populate("branchid"); 
        }

        res.status(200).send({
            data: adminUsers,
            message: "Get all verification accounts successfully!"
        });

    } catch (err) {
        console.log('Something went wrong', err);
        res.status(500).send({ status: false, message: 'Internal Server Error' });
    }
};

const getparticularverification=async(req,res)=>{
  try {
    const adminUsers = await Stufftranscation.find({_id:req.query.id});
   
    res.status(200).send({
      data: adminUsers,
      message: "get all branch name Successfully!"
    })
   
   
  }
  catch (err) {
    console.log('Something went wrong', err);
    res.status(500).send({ status: false, message: 'Internal Server Error' });
  }
}
  const getbranchName=async(req,res)=>{
    try {
      const adminUsers = await Branchschememodel.find();
     
      res.status(200).send({
        data: adminUsers,
        message: "get all branch name Successfully!"
      })
     
     
    }
    catch (err) {
      console.log('Something went wrong', err);
      res.status(500).send({ status: false, message: 'Internal Server Error' });
    }
  }

  const getrateofinterest=async(req,res)=>{
    try {
      const adminUsers = await Rateofinterestschememodel.find();
     
      res.status(200).send({
        data: adminUsers,
        message: "get all rateofinterest Successfully!"
      })
     
     
    }
    catch (err) {
      console.log('Something went wrong', err);
      res.status(500).send({ status: false, message: 'Internal Server Error' });
    }
  }
  const createrateofinterest=async(req,res)=>{
    try {
      const adminUsers = await Rateofinterestschememodel.find({interest:req.body.interest});

      if(adminUsers.length!=0){
        return res.status(200).json({ message: 'the rateofinterest already here' });
      }
      var value = await Rateofinterestschememodel.create({
        interest: req.body.interest,
       
      })
      res.status(200).send({
        data: value,
        message: `${req.body.interest}% rateofinterest created Successfully!`
      })

    }
    catch (err) {
      console.log('Something went wrong', err);
      res.status(500).send({ status: false, message: 'Internal Server Error' });
    }
  }
  const adminList = async (req, res) => {
    try {
      const adminUsers = await Adminaccountmodel.find({ isactive: true });

      // viewpassword
      // adminUsers.map(val=>{
      //   val['password']
      // })
      res.status(200).json({
        data: adminUsers,
        message: 'Admins Listed Successfully!'
      })

    }
    catch (err) {
      console.log('Something went wrong', err);
      res.status(500).send({ status: false, message: 'Internal Server Error' });
    }
  }
  // const transationhistroy = async (req, res) => {
  //   try {
     
  //   let data=""
  //     if(req.query.branchid=='All' && req.query.status=="All" && req.query.startdate==null){
        
  //       data=await Customerpaylist.find()
  //       console.log("1",data)
        
  //     }
  //     if(req.query.branchid=='All' && req.query.status=="All" && req.query.startdate!=null){
  //       data = await Customerpaylist.find({coustomerduedate: { $gte: req.query.startdate, $lte: req.query.enddate }})
  //       console.log("2",data)
  //     }
  //     if(req.query.branchid=='All' && req.query.status!="All" && req.query.startdate==null){
  //       data = await Customerpaylist.find({status:req.query.status})
  //       console.log("3",data)
  //     }
  //     if(req.query.branchid=='All' && req.query.status!="All" && req.query.startdate!=null){
  //       data = await Customerpaylist.find({status:req.query.status,coustomerduedate: { $gte: req.query.startdate, $lte: req.query.enddate }})
  //       console.log("4",data)
  //     }
  //     if(req.query.branchid !='All' && req.query.status=="All" && req.query.startdate==null){
  //       data = await Customerpaylist.find({branchid:req.query.branchid})
  //       console.log("extra",data)
  //     }
  //     if(req.query.branchid !='All' && req.query.status=="All" && req.query.startdate!=null){
  //       data = await Customerpaylist.find({branchid:req.query.branchid,coustomerduedate: { $gte: req.query.startdate, $lte: req.query.enddate }})
  //       console.log("5",data)
  //     }
  //     if(req.query.branchid !='All' && req.query.status!="All" && req.query.startdate==null){
  //       data = await Customerpaylist.find({status:req.query.status,branchid:req.query.branchid})
  //       console.log("6",data)
  //     }
  //     if(req.query.branchid !='All' && req.query.status!="All" && req.query.startdate!=null){
  //       data = await Customerpaylist.find({branchid:req.query.branchid,status:req.query.status,coustomerduedate: { $gte: req.query.startdate, $lte: req.query.enddate }})
  //       console.log("7",data)
  //     }
  //     console.log(data,'heloo')
  //     res.status(200).send({
  //       data: data,
  //       message: "all customer listed Successfully!"
  //     })
  //   }
  //   catch (err) {
  //     console.log("Something went wrong  post!!!", err)
  //   }
  // }

  const transationfind = async (req, res) => {
    try {
        let { selectedBranch, selectedStatus, startDate, endDate } = req.query;
        let filter = {};
        
        console.log(startDate, endDate);

        if (selectedBranch && selectedBranch !== "All"){
          let check=await Branchschememodel.find({Name:selectedBranch})
          filter.branchid = check[0]._id;
        } 
        if (selectedStatus && selectedStatus !== "All") {
          filter.status = selectedStatus;
        }
          
        if (startDate && startDate !== null||startDate!="") {
            filter["coustomerduedate"] = {
                $gte: startDate,
               
            };
        }
        if (endDate &&endDate !== null) {
          filter["coustomerduedate"] = {
              $lte: endDate,
             
          };
      }
        console.log(filter, "filter");
        const customers = await Customerpaylist.find(filter).populate("executeofficerId") // Populating from Adminaccount
        .populate("branchid"); // Populating from Branchschememodel;;
        // console.log(customers, "customers");

        res.status(200).send({
            data: customers,
            message: "All customers listed successfully!"
        });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching data", error });
    }
};




   const transationhistroy = async (req, res) => {
    try {
     
    let data=""
    req.query.role="Superadmin"
      if(req.query.role=='Superadmin'){
        
        data=await Customerpaylist.find().populate("executeofficerId") // Populating from Adminaccount
        .populate("branchid"); // Populating from Branchschememodel;
        
        
      }
     else{
      data=await Customerpaylist.find({branchid:req.query.id}).populate("executeofficerId") // Populating from Adminaccount
      .populate("branchid"); // Populating from Branchschememodel;
     }
      
      console.log(data,'heloo')
      res.status(200).send({
        data: data,
        message: "all customer listed Successfully!"
      })
    }
    catch (err) {
      console.log("Something went wrong  post!!!", err)
    }
  }
const stafftransationlist=async(req,res)=>{

  const currentDate = moment();
  const currentFormatted = currentDate.format('YYYY-MM-DD');
  const currentFormattedtime = new Date().toLocaleTimeString("en-US", { timeZone: "Asia/Kolkata" }); 
  
    var value = await Stufftranscation.create({
      branchid: req.body.branchid,
      type:req.body.type,
      authorid:req.body.authorid,
      amount:req.body.amount,
      reason:req.body.reason,
      isapprove:req.body.role=='Superadmin'?"true":"false",
      requestdate:currentFormatted,
   requesttime:currentFormattedtime,
   
    })
  console.log(value,'check')
  if(value.isapprove=="true"){
    if(value.type=="investment"){
      let check=await Branchschememodel.find({_id: req.body.branchid})
      let balanceamount=check[0].currentAmount+req.body.amount
      const value1 = await Branchschememodel.findOneAndUpdate(
        { _id:req.body.branchid }, 
        { currentAmount: balanceamount }, 
        { new: true }
      );

      let updatebalance=await Stufftranscation.findOneAndUpdate(
        { _id:value._id }, 
        { currentAmount: balanceamount,approveldate:currentFormatted,
        approveltime:currentFormattedtime }, 
        { new: true }
      );
      let check1=await Branchschememodel.find({_id: req.body.branchid})

      return res.status(200).send({
        
        message: `your currentAmount is ${check1[0].currentAmount}`
      })
    }
    else{
      let check=await Branchschememodel.find({_id: req.body.branchid})
      if(check[0].currentAmount<req.body.amount){
       return res.status(200).send({
        
          message: `currentAmount is only ${check[0].currentAmount}`
        })
      }
      let balanceamount=check[0].currentAmount-req.body.amount
      const value1 = await Branchschememodel.findOneAndUpdate(
        { _id:req.body.branchid }, 
        { currentAmount: balanceamount }, 
        { new: true }
      );

      let updatebalance=await Stufftranscation.findOneAndUpdate(
        { _id:value._id }, 
        { currentAmount: balanceamount,approveldate:currentFormatted,
          approveltime:currentFormattedtime }, 
        { new: true }
      );
      let check1=await Branchschememodel.find({_id: req.body.branchid})

      return res.status(200).send({
        
        message: `your currentAmount is ${check1[0].currentAmount}`
      })
    }
    
    


  }
  else{
    return res.status(200).send({
        
      message: `your trancation is waiting for superadmin`
    })
  }
  
 
  
}
const approveltransationlist=async(req,res)=>{
  const currentDate = moment();
  const currentFormatted = currentDate.format('YYYY-MM-DD');
  const currentFormattedtime = new Date().toLocaleTimeString("en-US", { timeZone: "Asia/Kolkata" }); 
 
  const value = await Stufftranscation.findOneAndUpdate(
    { _id: req.body.id }, 
    { isapprove: "true" }, 

    { new: true }
);
console.log(value,"check")
if (!value) {
    return res.status(200).send({
        
      message: "Record not found"
    })
}
let check=await Branchschememodel.find({_id: value.branchid})
let findall=await Stufftranscation.find({_id: req.body.id})
if(findall[0].type=="investment"){
  let balanceamount=check[0].currentAmount+value.amount
  const value1 = await Branchschememodel.findOneAndUpdate(
    { _id:value.branchid }, 
    { currentAmount: balanceamount }, 
    { new: true }
  );
  let updatebalance=await Stufftranscation.findOneAndUpdate(
    { _id:req.body.id }, 
    { currentAmount: balanceamount, approveldate:currentFormatted,
      approveltime:currentFormattedtime, }, 
    { new: true }
  );
}
else{
  let balanceamount=check[0].currentAmount-value.amount
  const value1 = await Branchschememodel.findOneAndUpdate(
    { _id:value.branchid }, 
    { currentAmount: balanceamount }, 
    { new: true }
  );
  let updatebalance=await Stufftranscation.findOneAndUpdate(
    { _id:req.body.id }, 
    { currentAmount: balanceamount, approveldate:currentFormatted,
      approveltime:currentFormattedtime, }, 
    { new: true }
  );
}



 
return res.status(200).send({
        
  message: `your currentAmount is ${check[0].currentAmount}`
})
}
const getstafftranstionlist=async(req,res)=>{
  if(req.query.role=='Superadmin'){
    let check=await Stufftranscation.find({isapprove:'false'}).populate("authorid").populate("branchid");
    return res.status(200).send({
        data:check,  
      message: `you getallrecord`
    })
  }
 else{
  let check=await Stufftranscation.find({authorid:req.query.id,isapprove:'false'}).populate("authorid").populate("branchid");
  return res.status(200).send({
      data:check,  
    message: `you getallrecord`
  })
 }
}
const getapprovelstafftranstionlist=async(req,res)=>{
  if(req.query.role=='Superadmin'){
    let check=await Stufftranscation.find({isapprove:'true'}).populate("authorid").populate("branchid");
    return res.status(200).send({
        data:check,  
      message: `you getallrecord`
    })
  }
 else{
  let check=await Stufftranscation.find({authorid:req.query.id,isapprove:'true'}).populate("authorid").populate("branchid");
  return res.status(200).send({
      data:check,  
    message:"you getallrecord"
  })
 }
}
const deletetafftranstionlist=async(req,res)=>{
  // let check=await Adminaccountmodel.find()
  const deletedEmployee = await Stufftranscation.deleteOne({ _id:req.query.id });
  res.status(200).send({
    // data: adminUsers,
    message: 'delete Stufftranscation  Successfully!'
  })
}
const updatetafftranstionlist=async(req,res)=>{
  const currentDate = moment();
  const currentFormatted = currentDate.format('YYYY-MM-DD');
  const currentFormattedtime = new Date().toLocaleTimeString("en-US", { timeZone: "Asia/Kolkata" }); 
  
    const value = await Stufftranscation.findOneAndUpdate(
      { _id: req.body.id }, 
      { reason: req.body.reason,type: req.body.type,branchid:req.body.branchid,amount: req.body.amount,requestdate: currentFormatted,requesttime:currentFormattedtime }, 
      { new: true }
    );
    res.status(200).send({
      // data: adminUsers,
      message: 'Update Successfully!'
    })
 

}


  const carddetails = async (req, res) => {
    console.log("1")
    try {
      const totalcustomer = await Customeraccountmodel.find()
      const totalcustomerlength = totalcustomer.length
      console.log(totalcustomerlength, "totalcustomerlength")
      let fullamount = 0
      totalcustomer.forEach(val => {
        fullamount = fullamount + val.amount
      })
      const totalcustomer1 = await Addextracustomeraccountmodel.find()
      console.log(totalcustomer1, "totalcustomer1")
      let fullamount1 = 0
      totalcustomer1.forEach(val => {
        fullamount1 = fullamount1 + val.amount
      })
      console.log(fullamount, fullamount1, "allvery")
      let fullamountall = fullamount + fullamount1
      let income = fullamountall * 10 / 100;
      let spendamount = fullamountall - income
      console.log(spendamount, income, income + spendamount, "allvalue")

      const CollectedAmount = await Customerpaylist.find();
      console.log(CollectedAmount)

      let totlamount = 0;

      CollectedAmount.forEach(val => {

        if (val.status === 'paid') {
          totlamount = totlamount + val.customerpayamount;

        }

      })



      let data =
      {
        totalcustomer: totalcustomerlength,
        spendamount: spendamount,
        income: income,
        totalcollectedamount: totlamount
      }

      res.status(200).send({
        data: data,
        message: "all customer listed Successfully!"
      })
    }
    catch (err) {
      console.log("Something went wrong  post!!!", err)
    }
  }
  const superAdminsEditsAdminUser = async (req, res) => {
    try {

      let { id, userName, Email, phoneNo, password, profilePicture } = req.body;

      const hashedPassword = await bcrypt.hash(password, 10);

      const existingUser = await Adminaccountmodel.findOne({ _id: { $ne: id }, userName, isactive: true });
      if (existingUser) {
        return res.status(200).send({ message: 'name already exists' });
      }

      if (Email) {
        const existingEmail = await Adminaccountmodel.findOne({ _id: { $ne: id }, Email, isactive: true });
        if (existingEmail) {
          return res.status(200).send({ message: 'email already exists' });
        }
      }

      const existingphone = await Adminaccountmodel.findOne({ _id: { $ne: id }, phoneNo, isactive: true });
      if (existingphone) {
        return res.status(200).send({ message: 'phonenumber already exists' });
      }

      const updatedAdminUsers = await Adminaccountmodel.findOneAndUpdate({ _id: id }, {
        userName, Email, phoneNo, password: hashedPassword,
        // profilePicture:,
        updatedAt: new Date()
      })
      res.status(200).json({
        data: updatedAdminUsers,
        message: `${userName} Updated Successfully!`
      })

    }
    catch (err) {
      console.log('Something went wrong', err);
      res.status(500).send({ status: false, message: 'Internal Server Error' });
    }
  }

  const superAdminsDeletesAdminUser = async (req, res) => {
    try {

      let { id } = req.body

      const adminUserlist = await Adminaccountmodel.find({ _id: id })
      if (adminUserlist.length == 0) {
        return res.status(200).send({ message: 'Invalid User' })
      }

      const updatedAdminUsers = await Adminaccountmodel.findOneAndUpdate({ _id: id }, {
        isactive: false,
        updatedAt: new Date()
      })

      res.status(200).json({
        data: updatedAdminUsers,
        message: `Deleted Successfully!`
      })

    }
    catch (err) {
      console.log('Something went wrong', err);
      res.status(500).send({ status: false, message: 'Internal Server Error' });
    }
  }

  const customersUsersList = async (req, res) => {
    try {
      const adminUsers = await Customeraccountmodel.find().populate("executeofficerId") // Populating from Adminaccount
      .populate("branchid"); // Populating from Branchschememodel;

      res.status(200).json({
        data: adminUsers,
        message: 'Customers Listed Successfully!'
      })

    }
    catch (err) {
      console.log('Something went wrong', err);
      res.status(500).send({ status: false, message: 'Internal Server Error' });
    }
  }
  const customersactiveList = async (req, res) => {
    try {
      let { branch, status } = req.query;
        let filter = {};
        
       

        if (branch && branch !== "All"){
         let check=await Branchschememodel.find({Name:branch})
         filter.branchid = check[0]._id
        } 
        if (status && status == "Active"){
          // let check=await Branchschememodel.find({Name:branch})
          filter.amountclose = "false"
         } 
        

        console.log(filter, "filter");
        
      const adminUsers = await Customeraccountmodel.find(filter).populate("executeofficerId") // Populating from Adminaccount
      .populate("branchid"); // Populating from Branchschememodel;

      res.status(200).json({
        data: adminUsers,
        message: 'Customers Listed Successfully!'
      })

    }
    catch (err) {
      console.log('Something went wrong', err);
      res.status(500).send({ status: false, message: 'Internal Server Error' });
    }
  }
  const changepassword=async(req,res)=>{
    try {
      const { Email, password,phoneNo } = req.body;
      let a=""
      let b=""
     if(req.body.Email){
      
      a=await Adminaccountmodel.find({Email: Email})
      b=await Customeraccountmodel.find({Email:Email})
      
      if(a.length==0&&b.length==0){
        return res.status(201).json({ status: false, message: 'Invalid Email please check your gmail' })
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      if(a[0]?.role=="customer"||b[0]?.role=="customer"){
        const value = await Customeraccountmodel.findOneAndUpdate(
          { Email: req.body.Email }, 
          { password: hashedPassword }, 
          { new: true }
      );
      }
      else{
        const hashedPassword = await bcrypt.hash(password, 10);
        const value = await Adminaccountmodel.findOneAndUpdate(
          { Email: req.body.Email }, 
          { password: hashedPassword }, 
          { new: true }
      );
      }
      
       
     }
    else{
      a=await Adminaccountmodel.find({phoneNo: phoneNo})
      b=await Customeraccountmodel.find({phoneNo:phoneNo})
      
      if(a.length==0&&b.length==0){
        return res.status(201).json({ status: false, message: 'Invalid Phoneno please check ' })
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      if(a[0]?.role=="customer"||b[0]?.role=="customer"){
        const value = await Customeraccountmodel.findOneAndUpdate(
          { phoneNo: req.body.phoneNo }, 
          { password: hashedPassword }, 
          { new: true }
      );
      }
      else{
        const hashedPassword = await bcrypt.hash(password, 10);
        const value = await Adminaccountmodel.findOneAndUpdate(
          { phoneNo: req.body.phoneNo }, 
          { password: hashedPassword }, 
          { new: true }
      );
      }

      
    }

    res.status(200).json({
      data: adminUsers,
      message: 'change password Successfully!'
    })

      
    } catch (err) {
      console.log('Something went wrong', err);
      res.status(500).send({ status: false, message: 'Internal Server Error' });
    }

  }

  const dailycollectionamountandfilter = async (req, res) => {

    try {

      console.log(req.body, 'request date')

      // const currentdate = await Customerpaylist.find({coustomerduedate:});
      console.log(currentdate, "dateeee")

      res.status(200).json({
        // data: adminUsers,
        message: 'Customers Listed Successfully!'
      })

    }
    catch (err) {
      console.log('Something went wrong', err);
      res.status(500).json({ status: false, message: 'Internal Server Error' });
    }
  }
  const deleteemployee=async(req,res)=>{
    // let check=await Adminaccountmodel.find()
    const deletedEmployee = await Adminaccountmodel.deleteOne({ _id:req.body.id });
    res.status(200).send({
      // data: adminUsers,
      message: 'delete Employee  Successfully!'
    })
  }
  const allduedashboardview = async (req, res) => {

    try {

      console.log(req.body, 'request date fromdate todate ')

      const start = new Date(req.body.fromdate);
      const end = new Date(req.body.todate);

      console.log(start, "startdate")
      console.log(end, "endataee");
      const query = {

        coustomerduedate
          : {
          $gte: req.body.fromdate,
          $lte: req.body.todate
        }
      };
      const documents = await Customerpaylist.find(query)

      console.log('Filtered documents:', documents);

      const filtereddata = documents.filter((item)=>{
        const schemefilter = req.body.duescheme.length === 0  || req.body.duescheme.some(option=>option===item.customerscheme)
        const duestatusfilter = req.body.duetype.length === 0  || req.body.duetype.some(option=>option===item.status)
        return schemefilter && duestatusfilter
      })




      res.status(200).send({
        // data: adminUsers,
        message: 'Customers Listed Successfully!',
        data:filtereddata
      })

    }
    catch (err) {
      console.log('Something went wrong', err);
      res.status(500).json({ status: false, message: 'Internal Server Error' });
    }
  }
  const deletecheet=async(req,res)=>{
    let dele = await Chitsnewmodel.deleteOne({ _id: req.query.id })
    res.status(200).send({
        
    message: "delete sucessfully"
  })
  }
  const getallcheet=async(req,res)=>{
let check=await Chitsnewmodel.find()
res.status(200).send({
    data:check,    
  message: "get all data sucessfully"
})
  }
  getparticularcheet=async(req,res)=>{
    let check=await Chitsnewmodel.find({_id:req.query.id})
    res.status(200).send({
        data:check,    
      message: "get data sucessfully"
    })
      }
  const updatecheet =async(req,res)=>{
let a=await Chitsnewmodel.findByIdAndUpdate({_id:req.body._id},{chitsimage: req.body.profilePicture,
  message:req.body.message},{new:true})
  res.status(200).send({
        
    message: "updatecheet sucessfully"
  })
  }
  const createcheet =async(req,res)=>{
    var value = await Chitsnewmodel.create({
      
      chitsimage: req.body.profilePicture,
      message:req.body.message
     
      
     
    })
     res.status(200).send({
        
      message: "createcheet sucessfully"
    })
  }
const dailyupdate=async()=>{
  const currentDate = moment();
  const currentFormatted = currentDate.format('YYYY-MM-DD');
   
  console.log(currentFormatted);
if(req.body.role=="Superadmin"){

data = await Customerpaylist.find({ coustomerduedate: currentFormatted })

}
}

  return {

    //superAdmin
    updateverificationapprovel,
    updateverificationapprovel1,
    createaccount,
    // loginaccount,
    notificationlist,
    createcustomeraccount,
    createscheme,
    todayallcustomer,
    Login,
    LoginVerifyToken,
    filterbasecustomer,
    todaycustomerupdate,
    todayindividualcustomerupdate,
    customerdetails,
    fileUpload,
    adminList,
    superAdminsEditsAdminUser,
    superAdminsDeletesAdminUser,
    customersUsersList,
    addextracustomerplan,
    particularcustomerallaccount,
    viewallhistroy,
    transationhistroy,
    collectionvalue,
    carddetails,
    dailycollectionamountandfilter,
    allduedashboardview,
    createbranch,
    createrateofinterest,
    getrateofinterest,
    getbranchName,
    getexecuteofficer,
    createform,
    updateform,
    changepassword,
    extraaccountbalance,
    deleteemployee,
    deletecheet,
    getallcheet,
    getparticularverification,
    updatecheet,
    updatetafftranstionlist,
    deletetafftranstionlist,
    createcheet,
    verification,
    verificationapprovel,
    dailyupdate,
    approvelaccount,
    transationfind,
    stafftransationlist,
    particularcustomertransaction,
    approveltransationlist,
    getstafftranstionlist,
    companyimage,
    viewcustomertransaction,
    getcompanyimage,
    getbrachbasedonexecuter,
    getapprovelstafftranstionlist,
    customersactiveList,
    particularcustomerallaccount1,
    collectionlistall,
    getparticularcheet
  }
}
module.exports = adminaccountSchema()