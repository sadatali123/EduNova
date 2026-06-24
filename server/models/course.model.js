import {model, Schema} from 'mongoose';

const courseSchema = new Schema({
    title: {
        type: String,   
        required: [true, 'Title is required'], //this is a validation rule that ensures the title field is required when creating a new course document in the database
        minLength:[8, 'Title must be at least 8 characters long'],
        maxLength:[59, 'Title must be less than 59 characters long'],
        trim: true,
    },
    description: {  
        type: String,
        required: [true, 'Description is required'],
        minLength:[8, 'Description must be at least 8 characters long'],
        maxLength:[200, 'Description must be less than 200 characters long'],
    },
    category: {
        type: String,
        required: [true, 'Category is required']
    },
    thumbnail: {
        public_id: {    
        type: String,
        required :true,
        },
        secure_url: {
        type: String,
        required: [true, 'Secure URL is required']
        }
    },
    lectures: [
        {
            title: String,
            description: String,
            lecture:{
                public_id: {
                    type:String,
                },
                secure_url: {
                    type: String,
                    required: true
                }
                }
        }
    ],
    numberOfLectures: {
        type: Number,
        default: 0
    },
    createdBy: {
        type: String,
        required: [true, 'Creator name is required']
    },
    timestamps:{
    type: Date,
    default: Date.now
    }
});


const Course = model('Course', courseSchema);
export default Course;