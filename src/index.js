#! /usr/bin/env node

const inquirer = require("inquirer");
const fs = require("fs");
const runner = require("./scripts/litmus");

const existingConfig = fs.existsSync("litmus-portal");
let content = "";

if (existingConfig) {
	console.log("You need to be out of litmus directory");
} else {
	inquirer
		.prompt([
			{
				type: "input",
				name: "clusterID",
				message: "What is the CID?",
			},
			{
				type: "input",
				name: "accessKey",
				message: "What is the KEY?",
			},
		])
		.then((answers) =>
			runner.startLitmusPortal(answers.clusterID, answers.accessKey)
		)
		.catch((error) => {
			if (error.isTtyError) {
				// Prompt couldn't be rendered in the current environment
				console.log(
					"Prompt couldn't be rendered in the current environment: ",
					error
				);
			} else {
				// Something else when wrong
				console.log("Something Went Wrong: ", error);
			}
		});
}
