import { get } from "http";
import Course from "../models/course.model.js";
import AppError from "../utils/error.util.js";
import fs from "fs/promises";
import cloudinary from "cloudinary";
import { config } from "dotenv";
config(); // Load environment variables from .env file

const getAllCourses = async (req, res) => {
  const courses = await Course.find({}).select("-lectures");
  res.status(200).json({
    success: true,
    message: "All courses fetched successfully",
    courses: courses,
  });
};

const getLecturesByCourseId = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Course lectures fetched successfully",
      lectures: course.lectures,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const createCourse = async (req, res, next) => {
  const { title, description, category, createdBy } = req.body;

  if (!title || !description || !category || !createdBy) {
    return next(new AppError("All field required", 400));
  }

  // create an instance of course model and save it to database
  const course = await Course.create({
    title,
    description,
    category,
    createdBy,
    thumbnail: {
      public_id: "DUMMY",
      secure_url: "DUMMY",
    },
  });
  // if course is not created then return error
  if (!course) {
    return new AppError("Course could not created, please try again", 500);
  }

  // if user upload thumbnail then upload it to cloudinary and save the public_id and secure_url in database.
  if (req.file) {
    const result = await cloudinary.v2.uploader.upload(req.file.path, {
      folder: "lms",
    });
    // if result is not null then save the public_id and secure_url in database
    if (result) {
      course.thumbnail.public_id = result.public_id;
      course.thumbnail.secure_url = result.secure_url;
    }

    fs.rm(`uploads/${req.file.filename}`);
  }

  await course.save(); // save to database

  res.status(200).json({
    success: true,
    message: "course created successffully",
    course,
  });
};


// UPDATE_COURSE_BY_ID
//Updates an existing course by ID.
  const updateCourse = async (req, res, next) => {
    try {
      const { id } = req.params;

      const course = await Course.findByIdAndUpdate(
        id,
        {
          $set: req.body, // Use $set operator to update only the fields provided in the request body not the entire document
        },
        {
          runValidators: true,  // validate the update operation against the schema
        },
      );
      if (!course) {
        return next(new AppError("Course with given id does not exist", 500));
      }
    } catch (error) {
      return next(new AppError(error.message, 500));
    }
    res.status(200).json({
      success: true,
      message: "Course Updated sucesssfully ",
    });
  };


// DELETE_COURSE_BY_ID
const removeCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await Course.findByIdAndDelete(id);

    if (!course) {
      return next(new AppError("Course with given id does not exist", 500));
    }

    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });

  } catch (error) {
    return next(new AppError(error.message, 500));
  }

};

// ADD_LECTURE_TO_COURSE_BY_ID
const addLectureToCourseById = async (req, res, next) => {
  const { title, description} = req.body;

    const {id }= req.params;
    if(!title||! description){
        return next(
            new AppError("All fields are required" , 400)
        )
    }

    const course = await Course.findById(id);

    if(!course){
        return next(
            new AppError("Course does not exist", 500)
        )
    }

    const lectureData ={
        title,
        description,
        lecture:{}
    }
    if(req.file){
        try {
            const result = await cloudinary.v2.uploader.upload(req.file.path,{
                folder:'lms',
                // chunk_size:50000000,
                // resource_type:'video'
            });
            if(result){
                lectureData.lecture.public_id=result.public_id;
                lectureData.lecture.secure_url=result.secure_url;
            }
            fs.rm(`uploads/${req.file.filename}`);
        }catch (error) {
            return next(
                new AppError(error.message, 500)
            )
        }
        course.lectures.push(lectureData);
        
        course.numberOfLectures=course.lectures.length;

        await course.save();
        
        res.status(200).json({
            success:true,
            message: " Lecture added sucesssfully to the course ",
            course,
        })
      }
};

//Removes a lecture from a course by its ID and deletes the video from Cloudinary

export {
  getAllCourses,
  getLecturesByCourseId,
  createCourse,
  updateCourse,
  removeCourse,
  addLectureToCourseById,
};
