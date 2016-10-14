'use strict';

require('shelljs/global');

const version = exec('node --version', {silent:true});

console.log('node version: ', version.stdout);

const installBower = exec('npm install -g bower');

const prepBranch = (project, release, lightningThemeRelease) => {
	return new Promise((resolve, reject) => {
		const execOpts = {
			silent: true,
			async: false,
			shell: '/bin/bash'
		};

		const cd = `cd ../${project}`
		const gitstuff = `git stash && git checkout master && git pull upstream master && git status`

		const command = String.raw`${cd} && ${gitstuff}`;

		// npm & bower update
		const runUpdates = exec(command,
			execOpts,
			(code, stdout, stderr) => {
				// check to see if status is clean
				// console.log(stdout.match('nothing to commit, working directory clean'));// grep instead
				// console.log(stdout);
				if (code === 0 && stdout.match('nothing to commit, working directory clean').length > 0) {
					// console.log(project, 'updateDependencyRequirements successful');
					resolve(project, release, lightningThemeRelease);
				} else {
					console.log('Exit code:', code);
					console.log(project, 'had errors when updateDependencyRequirements.')
					console.log('Program output:', stdout);
					console.log('Program stderr:', stderr);
					reject(project, release, lightningThemeRelease);
				}
			}
		);
	});
}

const updateDependencyRequirements = (project, release, lightningThemeRelease) => {
	// console.log('updateDependencyRequirements', project);
	return new Promise((resolve, reject) => {
		const execOpts = {
			silent: true,
			async: false,
			shell: '/bin/bash'
		};

		const cd = `cd ../${project}`

		const packageFUX = String.raw`sed -i '' 's/\(fuelux": "\)[\^\>\=\~\<0-9.x]*\("\)/fuelux": "${release}"/g' ./package.json`;
		const bowerFUX = String.raw`sed -i '' 's/\(fuelux": "\)[\^\>\=\~\<0-9.x]*\("\)/fuelux": "${release}"/g' ./bower.json`;

		const packageFLTPrefix = String.raw`"fuelux-lightning-theme": "git+ssh:\/\/git@github.exacttarget.com:uxarchitecture\/fuelux-lightning-theme.git\#`;
		const packageLightning = String.raw`sed -i '' 's/\(${packageFLTPrefix}\)[\^\>\=\~\<0-9.x]*\("\)/${packageFLTPrefix}${lightningThemeRelease}"/g' ./package.json`;

		const bowerFLTPrefix = String.raw`"fuelux-lightning-theme": "git@github.exacttarget.com:uxarchitecture\/fuelux-lightning-theme.git\#`;
		const bowerLightning = String.raw`sed -i '' 's/\(${bowerFLTPrefix}\)[\^\>\=\~\<0-9.x]*\("\)/${bowerFLTPrefix}${lightningThemeRelease}"/g' ./bower.json`;

		const bowerResolutions = String.raw`sed -i '' 's/\(fuelux-lightning-theme": "\)[\^\>\=\~\<0-9.x]*\("\)/fuelux-lightning-theme": "${lightningThemeRelease}"/g' ./bower.json`;

		const command = String.raw`${cd} && if [ -e package.json ]; then ${packageFUX} && ${packageLightning}; fi && if [ -e bower.json ]; then ${bowerFUX} && ${bowerLightning} && ${bowerResolutions}; fi`;

		// npm & bower update
		const runUpdates = exec(command,
			execOpts,
			(code, stdout, stderr) => {
				if (code === 0) {
					// console.log(project, 'updateDependencyRequirements successful');
					resolve(project, release, lightningThemeRelease);
				} else {
					console.log('Exit code:', code);
					console.log(project, 'had errors when updateDependencyRequirements.')
					console.log('Program output:', stdout);
					console.log('Program stderr:', stderr);
					reject(project, release, lightningThemeRelease);
				}
			}
		);
	});
}

const runUpdate = (project, release, lightningThemeRelease) => {
	// console.log('runUpdate', project, release, lightningThemeRelease);
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
					// console.log(project, 'runUpdate successful');
					resolve(project, release, lightningThemeRelease);
				} else {
					console.log('Exit code:', code);
					console.log(project, 'had errors when runUpdating.')
					console.log('Program output:', stdout);
					console.log('Program stderr:', stderr);
					reject(project, release, lightningThemeRelease);
				}
			}
		);
	});
}

const commitAndPush = (project, release, lightningThemeRelease) => {
	// console.log('runUpdate', project, release, lightningThemeRelease);
	return new Promise((resolve, reject) => {
		// cd into library
		const execOpts = {
			silent: true,
			async: true,
			shell: '/bin/bash'
		};

		// npm & bower update
		const runUpdates = exec(`cd ../${project} && git add -A && git commit -m "Updates dependency for FuelUX to ${release}" && git push upstream master`,
			execOpts,
			(code, stdout, stderr) => {
				const noError = code === 0 || stderr === "";
				const onMasterError = code === 1 && stderr.substr(0, 19) === "Already on 'master'"
				if (noError || onMasterError) {
					// console.log(project, 'runUpdate successful');
					resolve(project, release, lightningThemeRelease);
				} else {
					console.log('');
					console.log('=========================================');
					console.log('Exit code:', code);
					console.log(project, 'had errors when runUpdating to release', release);
					console.log(`Program stderr: "${stderr}"`);
					console.log('Program output:', stdout);
					console.log('=========================================');
					console.log('');
					reject(project, release, lightningThemeRelease);
				}
			}
		);
	});
}

const updateFuelUX = (project) => {
	const fueluxRelease = '3.15.8';
	const lightningThemeRelease = '0.3.0';

	return new Promise((resolve, reject) => {
		console.log(`${project} updating START`);
		prepBranch(project, fueluxRelease, lightningThemeRelease)
			.then(() => {
				return updateDependencyRequirements(project, fueluxRelease, lightningThemeRelease)
			})
			.then(() => {
				return runUpdate(project, fueluxRelease, lightningThemeRelease);
			})
			.then(() => {
				return commitAndPush(project, fueluxRelease, lightningThemeRelease);
			})
			.then(() => {
				console.log(`${project} updating COMPLETE`);
				resolve(project, fueluxRelease, lightningThemeRelease);
			});
	});
};



const libraryGroups = [
	[
		'fuelux-lightning-theme',
		'marketing-cloud-theme'
	],
	[
		'fusion-fuel'
	],
	[
		'fuelux-site',
		'components/data-library',
		'components/expression-text'
	],
	[
		'components/data-mapper',
	],
	[
		'components/expression-builder',
		'components/enlightenment',
		'components/ftux',
		'components/campaignselector'
	],
	[
		'components/fuelux-components'
	]
];

const updateFirstGroup = (groups) => {
	const group = groups.shift();
	Promise.all(
		group.map(updateFuelUX)
	).then(() => updateFirstGroup(groups));
}
updateFirstGroup(libraryGroups);
