const express = require("express"); // Use 'require' for importing express
const Job = require("../models/job.model.js");

const postJob = async (req, res) => {
    try {
        const {
            title,
            description,
            requirements,
            salary,
            location,
            jobType,
            experience,
            position,
            companyId // Assuming userId is coming from the request
        } = req.body;
        const userId = req.id;
        // Check if any required field is missing
        if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            });
        }

        // Create the job if all fields are provided
        const job = await Job.create({
            title,
            description,
            requirements: requirements.split(","),
            salary: Number(salary),
            location,
            jobType,
            experienceLevel: experience,
            position,
            company: companyId,
            created_by: userId
        });

        return res.status(201).json({
            job,
            success: true
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            message: "An error occurred while creating the job",
            success: false
        });
    }
};

const getAllJobs = async(req,res)=>{
    try {
       const keyword=req.query.keyword || "";
       const query={
        $or:[
            {title:{$regex:keyword,$options:"i"}},
            {description:{$regex:keyword,$options:"i"}}
        ]
       }
       const jobs = await Job.find(query);
       if(!jobs){
        return res.status(404).json({
            message:"Job not found",
            success:true
        })
       }
       return res.status(201).json({
        jobs,
        success:true
    })
    } catch (error) {
        console.log(error.message)
        
    }
}
const getJobById = async(req,res)=>{
    try {
        const jobId = req.params.id;

        const job= await Job.findById(jobId);
        if(!job){
            return res.status(404).jason({
                message:"Job Not Found",
                success:false
            })
        }
        return res.status(200).json({
          job,
            success:true
        })
    
     } catch (error) {
        console.log(error.message)
      
        
    }
}
const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await Job.find({ created_by: adminId }).populate({
            path:'company',
            createdAt:-1
        });
        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
module.exports = {
    postJob,
    getAllJobs,
    getJobById,
    getAdminJobs

};
