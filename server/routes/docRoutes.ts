<<<<<<< HEAD
import { Router } from "express";
import session from "express-session";
import Patient from "../models/patient";
import util from "util";
import formidable from "formidable";
import { ConnectionStates } from "mongoose";
const exec = util.promisify(require("child_process").exec);

const router = Router();
export default router;



router.post("/patientResponse", async (req, res) => {
	console.log(req.body);
	// Store patient response on patient list
	const aadhaar = req.body.aadhaar;
	const name = req.body.name;
	const mobile = req.body.mobile;
	const addressHouseNo = req.body.addressHouseNo;
	const addressVillage = req.body.addressVillage;
	const xray = req.body.xray;

	const report = {
		age: req.body.age,
		sex: req.body.sex,
		everSmoker: req.body.everSmoker,
		everDrinker: req.body.everDrinker,
		sputum: req.body.sputum,
		coughWeeks: req.body.coughWeeks,
		fever: req.body.fever,
		nightSweats: req.body.nightSweats,
		weightLoss: req.body.weightLoss,
		chestPain: req.body.chestPain,
		hardBreath: req.body.hardBreath,
		height: req.body.height,
		weight: req.body.weight
	};

	var form = new formidable.IncomingForm();
	form.parse(xray);

	form.on("fileBegin", function(name, file) {
		file.path = __dirname + "../uploads/" + file.name;
	});

	form.on("file", function(name, file) {
		console.log("Uploaded " + file.name + `by ${aadhaar}`);
	});

	const user = await Patient.findOneAndUpdate(
		{ aadhaar },
		{
			$push: {
				report: report
			}
		}
	);

	if (user == undefined || user == null) {
		const patient = new Patient({
			aadhaar: aadhaar,
			name: name,
			mobile: mobile,
			address: {
				houseNo: addressHouseNo,
				village: addressVillage
			},
			report: report
		});
	}

	// Get data visualisations and send
	const { stdout, stderr } = await exec(
		"conda activate ML && python ../scripts/predict.py " + report
	);
	console.log(stdout);
	console.log(stderr);
	// Send the response to PHC
	res.json({
		success: true,
		message: "Submitted Successfully"
	});
	return;
});

router.post("/test", async (req, res) => {
	const report = [
		req.body.age,
		req.body.sex,
		req.body.everSmoker,
		req.body.everDrinker,
		req.body.sputum,
		req.body.coughWeeks,
		req.body.fever,
		req.body.nightSweats,
		req.body.weightLoss,
		req.body.chestPain,
		req.body.hardBreath,
		req.body.height,
		req.body.weight
	];

	const { stdout, stderr } = await exec(
		"conda activate ML && python scripts/predict.py " + report
	);

	res.json({
		succcess: true,
		message: stdout
	});
});

// function userReq(req, res, next) {
// 	if (req.session.user) {
// 		next();
// 	} else {
// 		res.redirect("/auth/register");
// 		// next();
// 	}
// }
=======
import { Router } from "express";
import session from "express-session";
import Patient from "../models/patient";
import util from "util";
import formidable from "formidable";
const exec = util.promisify(require('child_process').exec);


const router = Router();
export default router;

router.post("/patientResponse", userReq, async (req, res) => {
	// Store patient response on patient list
	const aadhaar = req.body.aadhaar;
	const name = req.body.name;
	const mobile = req.body.mobile;
	const addressHouseNo = req.body.addressHouseNo;
	const addressVillage = req.body.addressVillage;
	const xray = req.body.xray;

    const report = {
        age: req.body.age,
        sex: req.body.sex,
        gender: req.body.gender,
        everSmoker: req.body.everSmoker,
        everDrinker: req.body.everDrinker,
        sputum: req.body.sputum,
        coughWeeks: req.body.coughWeeks,
        fever: req.body.fever,
        nightSweats: req.body.nightSweats,
        weightLoss: req.body.weightLoss,
        chestPain: req.body.chestPain,
        hardBreath: req.body.hardBreath,
        height: req.body.height,
        weight: req.body.weight,
    }

	var form = new formidable.IncomingForm();
	form.parse(xray);

	form.on("fileBegin", function(name, file) {
		file.path = __dirname + "../uploads/" + file.name;
	});

	form.on("file", function(name, file) {
		console.log("Uploaded " + file.name + `by ${aadhaar}`);
	});

	const user = await Patient.findOneAndUpdate(
		{ aadhaar },
		{
			$push: {
				report: report
			}
		}
	);

	if (user == undefined || user == null) {
		const patient = new Patient({
			aadhaar: aadhaar,
			name: name,
			mobile: mobile,
			address: {
				houseNo: addressHouseNo,
				village: addressVillage
			},
			report: report
		});
	}

    // Get data visualisations and send
    const {stdout,stderr} = await exec('python ./routes/script.py '+ report );
    console.log(stdout);
    console.log(stderr);
	// Send the response to PHC
	res.json({
		success: true,
		message: "Submitted Successfully"
	});
	return;
});

function userReq(req, res, next) {
	if (req.session.user) {
		next();
	} else {
		res.redirect("/auth/register");
		// next();
	}
}
>>>>>>> 3e5605c6d569f7d0d5729c2a69f0668d3230dec0
