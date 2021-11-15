const express =require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')
const story = require('../models/story')


//login 
router.get('/add', ensureAuth,  (req, res) => {
    res.render('stories/add')
})

//post 
router.post('/', ensureAuth, async  (req, res) => {
    try {
        req.body.user = req.user.id
        await story.create(req.body)
        res.redirect('/dashboard')
    } catch (err) {
        console.log(err);
        res.render('error/500')
    }
})

//show stories 
router.get('/', ensureAuth, async (req, res) => {
    try {
        const stories = await story.find({ status: 'public'})
        .populate('user')
        .sort({ createdAt : 'desc'})
        .lean()

        res.render('stories/index',{
            stories,
        })
    } catch (err) {
        console.log(err);
        res.render('error/500')
    }
})
//sjow diit page
router.get('/edit/:id', ensureAuth, async (req, res) => {
   const story1 = await story.findOne({
       _id: req.params.id
   }).lean()

   if(!story1){
       res.render('error/400')
   }

   if(story1.user != req.user.id){
       res.redirect('/stories')
   }else{
       res.render('/stories/edit', {
           story1
       })
   }

})

module.exports = router