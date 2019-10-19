import mongoose, { Schema } from "mongoose";
const schema = mongoose.Schema;

export interface docInterface extends mongoose.Document {
    username: string,
    password: string,
    mobile: number,
    email: string,
    location: string,
    patients: string[],
    rating: number,
    verified: boolean,
    confToken: boolean,
    passToken: boolean,
    blocked: boolean
}  

export const docSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    password: {
        type: String,
        required: true
    },
    mobile: {
        type: Number,
        required: true,
        index: true
    },
    email: {
        type: String,
        unique: true,
        index: true
    },
    location: {
        type: String,
        default: null
    },
    patients: {
        type: Array,
        default: []
    },
    rating: {
        type: Number,
        default: 0
    },
    verified: {
        type: Boolean,
        default: false
    },
    confToken: {
        //Confirmation for account Token
        type: String,
        unique: true
    },
    passToken: {
        //Password Forget Token
        type: String,
        unique: true
    },
    blocked: {
        type: Boolean,
        default: false
    }
});

export const Doctor = mongoose.model<docInterface>("Doctor", docSchema);
export default Doctor;
