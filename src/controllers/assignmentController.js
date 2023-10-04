import * as assignmentService from './../services/assignmentService.js';

export const getAll = async (req, res) => {
    try{
        const todoTask = await assignmentService.getAllAssignment(req,res);
        console.log("after controller")
       
    }catch(error){
        console.log("inside get controller")
    }
}

export const get = async (req, res) => {
    try{
        const todoTask = await assignmentService.getAssignmnet(req,res);
        console.log("after controller")
       
    }catch(error){
        console.log("inside get controller")
    }
}

export const post = async (req, res) => {
    try{
        console.log(req.body)
        const todoTask = await assignmentService.createAssignment(req,res);
        console.log("after controller")
       
    }catch(error){
        console.log("inside get controller")
    }
}

export const put = async (req, res) => {
    try{
        const todoTask = await assignmentService.updateAssignment(req,res);
        console.log("after controller")
       
    }catch(error){
        console.log("inside get controller")
    }
}

export const deleteAss = async (req, res) => {
    try{
        const todoTask = await assignmentService.deleteAssignment(req,res);
        console.log("after controller")
       
    }catch(error){
        console.log("inside get controller")
    }
}

