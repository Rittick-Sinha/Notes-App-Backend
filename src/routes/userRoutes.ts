import { Router, Request, Response } from "express";
import User from "../models/User";

const router = Router();

router.post('/test', async(req: Request, res: Response)=>{
    try{
        const {name, email, mobile, password} = req.body;

        const user = new User({name, email, mobile, password});
        await user.save();

        res.status(201).json({message: 'User created', user});
    }catch(error){
        console.log(error);
        res.status(500).json({message: 'Something went wrong '});
    }
});

export default router;