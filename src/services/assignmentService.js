import express from "express";
import Sequelize from "sequelize";
import { Assignment } from "../models/index.js";

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
    res.status(201).json(assignment);
  } catch (error) {
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
      res.status(200).json(assignment);
    } else {
      res.status(404).json({ error: "Assignment not found" });
    }
  } catch (error) {
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
      let count =0
      for (const key in req.body) {
        console.log(key);
        count+=1
        if (!keys.includes(key)) {
          res.status(400).json({ error: "Req body param is wrong" });
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

    const assignment = await Assignment.findByPk(req.params.id);
    if (assignment) {
      if (assignment.creatorId !== req.user.id) {
        return res.status(403).json({ error: "Not authorized" });
      }
      await assignment.destroy();
      res.status(204).end();
    } else {
      res.status(404).end();
    }
  } catch (error) {
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

    const assignments = await Assignment.findAll({
      attributes: { exclude: ["creatorId", "createdAt", "updatedAt"] },
    });

    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
