import mongoose, { Schema } from "mongoose";
import { Binary } from "crypto";
const schema = mongoose.Schema;

interface patientInterface extends mongoose.Document {
    name: string,
    mobile: number,
    aadhaar: number,
    address: address[],
    report: report[],
    comment: string,
    reportPhoto: string,
    xrays: string
};

const patientSchema = new Schema({
    name: {
        type: String,
        required: true,
        lowercase: true
    },
    mobile: {
        type: Number,
        required: true
    },
    aadhaar: {
        type: String,
        unique: true,
        required: true,
        index: true
    },
    address: {
        type: Array,
        required: true,
    },
    report: {
        type: Array,
        default: []
    },
    comment: {
        type: String,
        default: "None"
    },
    reportPhoto: {
        data: Buffer, 
        contentType: String
    },
    xray: {
        data: Buffer, 
        contentType: String
    }
});

interface address {
    houseNo: string,
    village: string,
    zipcode: string
};

interface report {
    age: number,
    sex: string,
    everSmoker: number,
    everDrinker: number,
    sputum: number,
    coughWeeks: number,
    fever: number,
    nightSweats: number,
    weightLoss: number,
    chestPain: number,
    hardBreath: number,
    height: number,
    weight: number
};

export const Patient = mongoose.model<patientInterface>("Patient", patientSchema);
export default Patient;
