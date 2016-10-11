'use strict';

require('shelljs/global');

const version = exec('node --version', {silent:true});

console.log('node version: ', version.stdout);

const installBower = exec('npm install -g bower');


const updateDependencyRequirements = (project, release) => {
	console.log('updateDependencyRequirements', project);
	return new Promise((resolve, reject) => {
		const execOpts = {
			silent: false,
			async: false,
			shell: '/bin/bash'
		};

		const command = String.raw`cd ../${project} && sed -i '' 's/\(fuelux": "\)[\^\>\=\~\<0-9.x]*\("\)/fuelux": "${release}"/g' ./package.json`;

		// npm & bower update
		const runUpdates = exec(command,
			execOpts,
			(code, stdout, stderr) => {
				if (code === 0) {
					console.log(project, 'updateDependencyRequirements successful');
					resolve(project, release);
				} else {
					console.log('Exit code:', code);
					console.log(project, 'had errors when updateDependencyRequirements.')
					console.log('Program output:', stdout);
					console.log('Program stderr:', stderr);
					reject(project, release);
				}
			}
		);
	});
}

const runUpdate = (project, release) => {
	console.log('runUpdate', project, release);
	return new Promise((resolve, reject) => {
		// cd into library
		const execOpts = {
			silent: true,
			async: true,
			shell: '/bin/bash'
		};

		// npm & bower update
		const runUpdates = exec('cd ../' + project + ' && npm update && bower update',
			execOpts,
			(code, stdout, stderr) => {
				if (code === 0) {
					console.log(project, 'runUpdate successful');
					resolve(project, release);
				} else {
					console.log('Exit code:', code);
					console.log(project, 'had errors when runUpdating.')
					console.log('Program output:', stdout);
					console.log('Program stderr:', stderr);
					reject(project, release);
				}
			}
		);
	});
}

const commitAndPush = (project, release) => {
	console.log('runUpdate', project, release);
	return new Promise((resolve, reject) => {
		// cd into library
		const execOpts = {
			silent: true,
			async: true,
			shell: '/bin/bash'
		};

		// npm & bower update
		const runUpdates = exec(`cd ../${project} && git checkout master && git pull upstream master && git commit -am "Updates dependency for FuelUX to ${release}" && git push upstream master`,
			execOpts,
			(code, stdout, stderr) => {
				if (code === 0 || (code === 1 && stderr.substr(0, 19) === "Already on 'master'")) {
					console.log(project, 'runUpdate successful');
					resolve(project, release);
				} else {
					console.log('');
					console.log('=========================================');
					console.log('Exit code:', code);
					console.log(project, 'had errors when runUpdating to release', release);
					console.log(`Program stderr: "${stderr}"`);
					console.log('Program output:', stdout);
					console.log('=========================================');
					console.log('');
					reject(project, release);
				}
			}
		);
	});
}

const updateFuelUX = (project) => {
	console.log('now updating', project);
	const release = '3.15.9';

	return new Promise((resolve, reject) => {
		updateDependencyRequirements(project, release)
			.then(() => {
				return runUpdate(project, release);
			})
			.then(() => {
				return commitAndPush(project, release);
			})
			.then(() => {
				console.log('done updating', project, release);
				resolve(project, release);
			});
	});
};

const libraryGroups = [
	[
		'fuelux-lightning-theme'
	],
	[
		'fuel-site',
		'fusion-fuel',
		'components/data-mapper'
	],
	[
		'components/data-library',
		'components/expression-builder'
	],
	[
		'components/expression-text',
		'components/enlightenment',
		'components/ftux',
		'components/campaignselector'
	],
	[
		'components'
	]
];

const updateFirstGroup = (groups) => {
	const group = groups.shift();
	Promise.all(
		group.map(updateFuelUX)
	).then(() => updateFirstGroup(groups));
}
updateFirstGroup(libraryGroups);
