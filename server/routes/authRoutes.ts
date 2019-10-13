import { Router } from "express";
import Doctor from "../models/doc";
import bcrypt from "bcrypt";
import { hash } from "bcrypt";
import * as crypto from "crypto";
import request from "request-promise";
import sgMail from "@sendgrid/mail";
import hbsexp from "express-handlebars";


const router = Router();
const hbs = hbsexp.create();
export default router;

router.post("/login", async (req, res) => {
    const username = req.body.username.toString().trim();
	const password = req.body.password.toString().trim();
	if (!username || !password) {
		res.status(400).json({
			success: false,
			message: "missingFields"
		});
		return;
	}

	await Doctor.findOne({ username }, (err, doc0) => {
		if (!doc0) {
			res.json({
				success: false,
				message: `Doctor with ${username} is not registered`
			});
		} else {
			Doctor.findOne(
				{ username: username, verified: true },
				(err, doc1) => {
					if (err) {
						res.json({
							success: false,
							message: "Account Not Found"
						});
						return;
					}
					if (!doc1) {
						res.json({
							success: false,
							message: "Please verify your account first"
						});
						return;
					} else {
						const chkPass = bcrypt.compareSync(
							password,
							doc1.password
						);

						if (chkPass == true) {
							req.session.user = username;
							res.json({
								success: true,
								message: "Logged In"
							});
							return;
						} else {
							res.json({
								success: false,
								message: "Password Incorrect"
							});
						}
					}
				}
			);
		}
	});
});

router.post("/register", async (req, res) => {
    const captcha = req.body["g-recaptcha-response"];
	const verificationURL = "https://www.google.com/recaptcha/api/siteverify";
	const gRes = await request.post(verificationURL, {
		form: {
			secret: process.env.GOOGLE_RECAPTCHA_SECRET,
			response: captcha
		}
	});

	const recaptchaStatus = JSON.parse(gRes);
	if (recaptchaStatus.success === false) {
		res.json({
			success: false,
			message: "recaptchaFailed"
		});
		return;
	}

	if (
		!req.body.username ||
		!req.body.password ||
		!req.body.mobile ||
		!req.body.email ||
		!req.body.location
	) {
		res.status(400).json({
			success: false,
			message: "missingField"
		});
		return;
	}

	if (await checkUserExists(req.body.username, req.body.email)) {
		res.status(400).json({
			success: false,
			message: "duplicateUser"
		});
		return;
	}

	const randomToken = crypto.randomBytes(10).toString("hex");

	const newUser = new Doctor({
		username: req.body.username,
		password: await hash(
			req.body.password,
			parseInt(process.env.SALT_ROUNDS)
		),
		email: req.body.email,
		mobile: req.body.phoneNo,
		location: req.body.location,
		confToken: randomToken,
		verified: false
	});

	await newUser.save();

	res.json({
		success: true
	});

    sendConfirmationEmail(req.body.name, req.body.email, randomToken);
    
    res.json({
        success: true,
        message: "Registered"
    });
    return;
});


router.get("/verify", async (req, res) => {
	const token = req.query.token;

	if (!token) {
		res.status(400).json({
			success: false
		});
		return;
	}
	const user = await Doctor.findOne({ confToken: token });

	if (!user) {
		res.send("Invalid token, Doctor username not found");
		return;
	}
	user["verified"] = true;

	await user.save();
    res.render(`success.hbs`);

});

router.get("/logout", function(req, res) {
	req.session.destroy(function() {
		res.redirect("/");
	});
});


async function checkUserExists(username: string, email: string) {
    const user = await Doctor.findOne({
        $or: [{ "username": username }, { "email": email }]
    }).exec();
    return user;
}

async function sendConfirmationEmail(
	name: string,
	email: string,
	randomToken: string
) {
	sgMail.setApiKey(process.env.SENDGRID_API_KEY);
	const vLink = `https://localhost:4000/auth/verify?token=${randomToken}`;
	const msg = {
		to: email,
		from: {
			name: "Phosphorus",
			email: "saathi@gmail.com"
		},
		subject: "Verify your TB Saathi Account",
		text: `Verification Link: ${vLink}`,
		html: await hbs.render("views/verificationMail.hbs", { name, vLink }),
		replyTo: {
			email: "sauravhiremath@gmail.com",
			name: "Phosphorus"
		}
	};
	sgMail.send(msg);
	return;
}