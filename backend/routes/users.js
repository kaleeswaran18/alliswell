var express = require('express');
var router = express.Router();
var adminaccountController = require('../controller/index')
const upload = require('../utills/multer');
const verifyToken = require('../utills/verifyToken');


router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});



//login both admin & superadmin
router.post('/login', adminaccountController.Login)
router.post('/verifyToken', adminaccountController.LoginVerifyToken)


router.post('/createscheme', adminaccountController.createscheme)
router.get('/todayallcustomer', adminaccountController.todayallcustomer)
router.get('/filterbasecustomer', adminaccountController.filterbasecustomer)
router.put('/todaycustomerupdate', adminaccountController.todaycustomerupdate)
router.put('/todayindividualcustomerupdate', adminaccountController.todayindividualcustomerupdate)
router.get('/customerdetails', adminaccountController.customerdetails)


// router.post('/fileUpload', verifyToken, upload.fields([{
//   name: 'image', maxCount: 1
// }]), adminaccountController.fileUpload)


router.post('/fileUpload', verifyToken, upload.single("image"), adminaccountController.fileUpload)

//temMem
router.get('/adminList', verifyToken, adminaccountController.adminList)

router.post('/create',upload.single("profilePicture"), adminaccountController.createaccount)//superadmincreatesadmin
router.post('/edit', verifyToken, adminaccountController.superAdminsEditsAdminUser)
router.post('/delete', verifyToken, adminaccountController.superAdminsDeletesAdminUser)

//customers upload.single('profile_pic'),
router.post('/createcustomer',upload.single("profilePicture"), adminaccountController.createcustomeraccount)
router.get('/customersList',adminaccountController.customersUsersList)

router.post('/createbranch', adminaccountController.createbranch)
router.get('/getexecuteofficer', adminaccountController.getexecuteofficer)
router.post('/createrateofinterest', adminaccountController.createrateofinterest)
router.get('/getrateofinterest', adminaccountController.getrateofinterest)
router.get('/getbranchName', adminaccountController.getbranchName)

router.post('/addextracustomerplan',upload.single("profilePicture"),adminaccountController.addextracustomerplan)
router.get('/particularcustomerallaccount', adminaccountController.particularcustomerallaccount) //plan api
router.get('/viewallhistroy', adminaccountController.viewallhistroy)

router.get('/carddetails', adminaccountController.carddetails)
router.get('/transationhistroy', adminaccountController.transationhistroy)
router.post('/dailycollectionamountandfilter', adminaccountController.dailycollectionamountandfilter)
router.post('/allduedashboardview', adminaccountController.allduedashboardview)
router.post('/createform', adminaccountController.createform)
router.put('/updateform', adminaccountController.updateform)
router.get('/chanepassword',adminaccountController.changepassword)
router.delete('/deleteemployee',adminaccountController.deleteemployee)
router.get('/getverificationform',adminaccountController.verification)
router.put('/verificationapprovel',adminaccountController.verificationapprovel)
router.get('/approvelaccount',adminaccountController.approvelaccount)
router.post('/createcheet', adminaccountController.createcheet)
router.put('/updatecheet', adminaccountController.updatecheet)
router.get('/getallcheet',adminaccountController.getallcheet)
router.delete('/deletecheet',adminaccountController.deletecheet)

module.exports = router;

router.post('/transationhistroy', adminaccountController.transationhistroy)

