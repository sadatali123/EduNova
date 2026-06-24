import { Router } from 'express' ;
import { getAllCourses, getLecturesByCourseId, createCourse, updateCourse, removeCourse, addLectureToCourseById } from '../controllers/course.controller.js' ;
import {isLoggedIn, authorizedRoles} from '../middlewares/auth.middleware.js' ;

import upload from '../middlewares/multer.middleware.js';
const router = Router() ;


/**
 * @route GET / POST /courses
 * @description Get all courses or create a new course
 * @access public for GET, Admin only for POST
 */

router.route('/')
    .get(getAllCourses)
    .post(
        isLoggedIn,
        authorizedRoles('ADMIN'),
        upload.single('thumbnail'),
        createCourse)
    

/**
 * @route GET, PUT, DELETE /courses/:id
 * @description Get, update, or remove a course by ID
 * @access Admin only
 */

router.route('/:id')
    .get(isLoggedIn, getLecturesByCourseId)
    .put(
        isLoggedIn, 
        authorizedRoles('ADMIN'),
        updateCourse
    )
    .delete(
        isLoggedIn, 
        authorizedRoles('ADMIN'), 
        removeCourse
    )
    .post(
        isLoggedIn,
        authorizedRoles('ADMIN'),
        upload.single('lecture'),
        addLectureToCourseById
    );

export default router ;