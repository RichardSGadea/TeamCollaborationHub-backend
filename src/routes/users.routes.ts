import express from "express"

const router = express.Router();

//Users routes
router.get('/profile',(req,res) => {
    res.send('get profile')
})
router.put('/profile',(req,res) => {
    res.send('put profile')
})

export default router;
