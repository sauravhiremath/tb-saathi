import { Router } from "express";
import session from "express-session";
import Patient from "../models/patient";
import util from "util";
import formidable from "formidable";

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

	const age = req.body.age;
	const sex = req.body.sex;
	const gender = req.body.gender;
	const everSmoker = req.body.everSmoker;
	const everDrinker = req.body.everDrinker;
	const sputum = req.body.sputum;
	const coughWeeks = req.body.coughWeeks;
	const fever = req.body.fever;
	const nightSweats = req.body.nightSweats;
	const weightLoss = req.body.weightLoss;
	const chestPain = req.body.chestPain;
	const hardBreath = req.body.hardBreath;
	const height = req.body.height;
	const weight = req.body.weight;

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
				report: {
					age: age,
					sex: sex,
					gender: gender,
					everSmoker: everSmoker,
					everDrinker: everDrinker,
					sputum: sputum,
					coughWeeks: coughWeeks,
					fever: fever,
					nightSweats: nightSweats,
					weightLoss: weightLoss,
					chestPain: chestPain,
					hardBreath: hardBreath,
					height: height,
					weight: weight
				}
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
			report: {
				age: age,
				sex: sex,
				gender: gender,
				everSmoker: everSmoker,
				everDrinker: everDrinker,
				sputum: sputum,
				coughWeeks: coughWeeks,
				fever: fever,
				nightSweats: nightSweats,
				weightLoss: weightLoss,
				chestPain: chestPain,
				hardBreath: hardBreath,
				height: height,
				weight: weight
			}
		});
	}

	// Get data visualisations and send
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
