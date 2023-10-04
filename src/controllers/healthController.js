import * as heaalthservice from './../services/healthService.js';

export const get = async (req, res) => {
    try{
        const todoTask = await heaalthservice.dbConnect(req,res);
        console.log("after controller")
       
    }catch(error){
        
    }
}