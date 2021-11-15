const express =require('express')
const passport = require('passport')
const router = express.Router()

//login 
router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

//dashboard
router.get('/google/callback',  passport.authenticate('google',  { failureRedirect : '/' } ), 
 (req, res) => {
    res.redirect('/dashboard')
})
router.get('/logout', (req, res) =>{
  req.session.destroy()
  res.redirect('/')  
})

module.exports = router