import express from "express";
import Sequelize from "sequelize";
import logger from '../../logger.js';
import AWS from 'aws-sdk';

import { Assignment, Submission } from "../models/index.js";

import { config } from 'dotenv';

config();


export const createAssignment = async (req, res) => {
  try {
    console.log(req.body);

    const keys = ["name", "points", "num_of_attempts", "deadline"];

    for (const key in req.body) {
      console.log(key);
      if (!keys.includes(key)) {
        return res.status(400).json({ error: "Req body param is wrong" });
        
      }
    }


    if(req.body.name == ""){
      logger.error("Req body param is wrong")
      return res.status(400).json({ error: "Req body param is wrong" });
    }


    if(!Number.isInteger(req.body.points) || !Number.isInteger(req.body.num_of_attempts)){
      return res.status(400).json({ error: "points and num attempt are integer type" });
    }


    const assignment = await Assignment.create({
      ...req.body,
      creatorId: req.user.id,
    });
    delete assignment.dataValues.creatorId;
    delete assignment.dataValues.createdAt;
    delete assignment.dataValues.updatedAt;
    logger.info(assignment)
    res.status(201).json(assignment);
  } catch (error) {
    logger.error(error.message)
    if (error instanceof Sequelize.ValidationError) {
      res.status(400).json({ error: error.message });
    } else if (
      error.name === "SequelizeDatabaseError" &&
      error.message.includes("Incorrect integer value")
    ) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

export const getAssignmnet = async (req, res) => {
  try {
    if (req.headers["content-length"] > 0) {
      res.set("Cache-Control", "no-cache");
      return res.status(400).end();
    }
    if (Object.keys(req.query).length > 0) {
      res.set("Cache-Control", "no-cache");
      return res.status(400).end();
    }

    const assignment = await Assignment.findByPk(req.params.id, {
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    if (assignment) {
      delete assignment.dataValues.creatorId;
      logger.info(assignment)
      res.status(200).json(assignment);
    } else {
      res.status(404).json({ error: "Assignment not found" });
    }
  } catch (error) {
    logger.error(error.message)
    res.status(500).json({ error: error.message });
  }
};

export const updateAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findByPk(req.params.id);
    if (assignment) {
      if (assignment.creatorId !== req.user.id) {
        return res.status(403).json({ error: "Not authorized" });
      }

      const keys = ["name", "points", "num_of_attempts", "deadline"];
      logger.info(assignment)
      let count =0
      for (const key in req.body) {
        console.log(key);
        count+=1
        if (!keys.includes(key)) {
          res.status(400).json({ error: "Req body param is wrong" });
          logger.error("Req body param is wrong")
          break; // You may want to break out of the loop after the first invalid key is encountered.
        }
      }

      if(count<4){
       return res.status(400).json({ error: "Req body all param should present" });
      }

      if(req.body.name == ""){
        return res.status(400).json({ error: "Req body param is wrong" });
      }

      if(!Number.isInteger(req.body.points) || !Number.isInteger(req.body.num_of_attempts)){
        return res.status(400).json({ error: "points and num attempt are integer type" });
      }



      await assignment.update(req.body);
      delete assignment.dataValues.creatorId;
      delete assignment.dataValues.createdAt;
      delete assignment.dataValues.updatedAt;
      res.status(204).end();
    } else {
      res.status(404).json({ error: "Assignment not found" });
    }
  } catch (error) {
    logger.error(error.message)
    if (error instanceof Sequelize.ValidationError) {
      res.status(400).json({ error: error.message });
    } else if (
      error.name === "SequelizeDatabaseError" &&
      error.message.includes("Incorrect integer value")
    ) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

export const deleteAssignment = async (req, res) => {
  try {

    if (req.headers["content-length"] > 0) {
      res.set("Cache-Control", "no-cache");
      return res.status(400).end();
    }

    if (Object.keys(req.query).length > 0) {
      res.set("Cache-Control", "no-cache");
      return res.status(400).end();
    }


    const assignment = await Assignment.findByPk(req.params.id);
    if (assignment) {
      if (assignment.creatorId !== req.user.id) {
        logger.info(assignment)

        return res.status(403).json({ error: "Not authorized" });
      }
      await assignment.destroy();
      res.status(204).end();
    } else {
      res.status(404).end();
    }
  } catch (error) {
    logger.error(error.message)
    res.status(500).json({ error: error.message });
  }
};
export const getAllAssignment = async (req, res) => {
  try {
    if (req.headers["content-length"] > 0) {
      res.set("Cache-Control", "no-cache");
      return res.status(400).end();
    }
    if (Object.keys(req.query).length > 0) {
      res.set("Cache-Control", "no-cache");
      return res.status(400).end();
    }

    console.log("Get all")

    const assignments = await Assignment.findAll({
      attributes: { exclude: ["creatorId", "createdAt", "updatedAt"] },
    });

    res.status(200).json(assignments);
  } catch (error) {
    logger.error(error.message)
    res.status(500).json({ error: error.message });
  }
};


export const submitAssignment = async (req, res) => {

try {
  const assignmentId = req.params.id
const userId = req.user.id
const submissionUrl = req.body.submission_url


const assignment = await Assignment.findByPk(assignmentId);

if(assignment){

  console.log(assignment)
const existingSubmissions = await Submission.findAll({
  where: {
    assignment_id: assignmentId,
    creatorId: userId,
  },
});

const maxRetries = assignment.num_of_attempts;
if (existingSubmissions.length >= maxRetries) {
  logger.error("Exceeded maximum number of retries.")
  res.status(400).json({ error: "Exceeded maximum number of retries." });
}

const deadline = new Date(assignment.deadline);
      const currentDate = new Date();
      if (currentDate > deadline) {
        res.status(400).json({ error: "Submission deadline has passed." });
      }


      const newSubmission = await Submission.create({
        submission_url: submissionUrl,
        assignment_id: assignmentId,
        submission_date: new Date(),
        creatorId: userId,
        assignment_updated: new Date()
      });

    delete newSubmission.dataValues.creatorId;
    delete newSubmission.dataValues.createdAt;
    delete newSubmission.dataValues.updatedAt;

    // Configure the AWS region
    //AWS.config.update({ region: 'us-east-1' });

    // AWS.config.update({
    //   accessKeyId: 'AKIAX5OJ2S7PTMPMVVH3',
    //   secretAccessKey: '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',
    //   region: 'us-east-1'
    // });
    

    const arn =  process.env.SNS_TOPIC
    const sns = new AWS.SNS()
    const snsMessage = {
      Message: JSON.stringify({
          userEmail: req.user.email,
          githubRepo: submissionUrl,
          releaseTag: "webapp-v1"
      }),
      TopicArn: arn
      // MessageGroupId: 'YourMessageGroupId' 
  };
  logger.info("snstopic", arn)
  sns.publish(snsMessage, function(err, data) {
    if (err) {
        logger.error("Error publishing SNS message", err);
        console.error("Error publishing SNS message", err);
    } else {
      logger.info("SNS message sent:", data)
        console.log("SNS message sent:", data);
    }
});

    res.status(201).json(newSubmission);


}
else{
  res.status(404).end();
}





  
} catch (error) {

  logger.error(error.message)
  if (error instanceof Sequelize.ValidationError) {
    res.status(400).json({ error: error.message });
  } else if (
    error.name === "SequelizeDatabaseError" &&
    error.message.includes("Incorrect integer value")
  ) {
    res.status(400).json({ error: error.message });
  } else {
    res.status(500).json({ error: error.message });
  }
  
}



};