var spawnSync = require("child_process").spawnSync;
var spawn = require("child_process").spawn;

const startLitmusPortal = (clusterID, accessKey) => {
	var mongodbStart = `docker start mongodb`;
	var spawnAuthServer = `cd ../litmus/litmus-portal/authentication && DB_SERVER=mongodb://localhost:27017 JWT_SECRET=litmus-portal@123 ADMIN_USERNAME=admin ADMIN_PASSWORD=litmus go run src/main.go`;
	var spawnGraphqlServer = `cd ../litmus/litmus-portal/graphql-server && DEPLOYER_IMAGE=litmuschaos/litmusportal-self-deployer:ci SUBSCRIBER_IMAGE=litmuschaos/litmusportal-subscriber:ci SERVICE_ADDRESS=localhost:8080 DB_SERVER=localhost:27017 JWT_SECRET=litmus-portal@123 go run server.go`;
	var spawnSubscriber = `cd ../litmus/litmus-portal/cluster-agents/subscriber && CID=${clusterID} KEY=${accessKey} GQL_SERVER=http://localhost:8080/query go run subscriber.go -kubeconfig ~/.kube/config`;

	var options = {
		encoding: "utf8",
		stdio: "inherit",
		shell: true,
	};

	spawnSync(mongodbStart, options, (error, stdout, stderr) => {
		if (error) {
			console.error("stderr", stderr);
			throw error;
		}
		console.log(stdout);
	});

	spawn(spawnAuthServer, options, (error, stdout, stderr) => {
		if (error) {
			console.error("stderr", stderr);
			throw error;
		}
		console.log(stdout);
	});

	spawn(spawnGraphqlServer, options, (error, stdout, stderr) => {
		if (error) {
			console.error("stderr", stderr);
			throw error;
		}
		console.log(stdout);
	});

	spawnSync("minikube start", options, (error, stdout, stderr) => {
		if (error) {
			console.error("stderr", stderr);
			throw error;
		}
		console.log(stdout);
	});

	spawn(spawnSubscriber, options, (error, stdout, stderr) => {
		if (error) {
			console.error("stderr", stderr);
			throw error;
		}
		console.log(stdout);
	});
};

module.exports = {
	startLitmusPortal,
};
