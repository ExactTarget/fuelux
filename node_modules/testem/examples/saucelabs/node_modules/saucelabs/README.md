# node-saucelabs -- Node wrapper around the Saucelabs REST API

## Download or update node

http://nodejs.org/#download

## Install

```shell
npm install saucelabs
```

## Authors

- Dan Jenkins ([danjenkins](https://github.com/danjenkins))
- Mathieu Sabourin ([OniOni](https://github.com/OniOni))

## Writting a script

```javascript
var sauce = require('saucelabs');

var myAccount = new sauce({
    username: "your-sauce-username",
    password: "your-sauce-api-key",
})

myAccount.getAccountDetails( function (err, res) {
    console.log(res);
    myAccount.getServiceStatus( function (err, res) {
	//Status of the Sauce Labs services
	console.log(res);
	myAccount.getBrowsers( function (err, res) {
	    //List of all browser/os combinations currently supported on Sauce Labs.
	    console.log(res);
	    myAccount.getJobs( function (err, res) {
		//Get a list of all your jobs
		for (k in jobs) {
		    myAccount.showJob(jobs[k].id, function (err, res) {
			var str = res.id +": Status: "+ res.status;
			if (res.error) {
			    str += "\033[31m Error: "+res.error+" \033[0m";
			}
			console.log(str);
		    })
		}
	    })
	})
    })
});
```

## Supported Methods

<table class="wikitable" width="90%" style="padding: 5%;">
  <tbody>
    <tr >
      <td width="50%"><strong>Rest</strong></td>
      <td width="50%"><strong>Node Wrapper</strong></td>
    </tr>
    <tr>
      <td>
	GET /users/:username <br />
	Access account details.
      </td>
      <td>getAccountDetails(cb) -> cb(err, res)</td>
    </tr>
    <tr>
      <td>
	GET /:username/limits <br />
	Access account details
      </td>
      <td> getAccountLimits(cb) -> cb(err, res) </td>
    </tr>
    <tr>
      <td>
	GET /:username/activity <br />
	Access current account activity.
      </td>
      <td>getUserActivity(cb, start, end) -> cb(err, res)</td>
    </tr>
    <tr>
      <td>
	GET /users/:username/usage <br />
	Access historical account usage data.
      </td>
      <td> getAccountUsage(cb) -> cb(err, res)</td>
    </tr>
    <tr>
      <td>
	GET /:username/jobs <br />
	List all job Id's belonging to a given user. 
      </td>
      <td>getJobs(cb) -> cb(err, res)</td>
    </tr>
    <tr>
      <td>
	GET /:username/jobs/:id <br />
	Show the full information for a job given its ID. 
      </td>
      <td>showJob(id, cb) -> cb(err, res)</td>
    </tr>
    <tr>
      <td>
	PUT /:username/jobs/:id <br />
	Changes a pre-existing job. 
      </td>
      <td>updateJob(id, data, cb) -> cb(err, res)</td>
    </tr>
    <tr>
      <td>
	PUT /:username/jobs/:id/stop <br />
	Terminates a running job. 
      </td>
      <td>stopJob(id, data, cb) -> cb(err, res)</td>
    </tr>
    <tr>
      <td>
	GET /:username/tunnels <br />
	Retrieves all running tunnels for a given user. 
      </td>
      <td>getActiveTunnels(cb) -> cb(err, res)</td>
    </tr>
    <tr>
      <td>
	GET /:username/tunnels/:id <br />
	Show the full information for a tunnel given its ID. 
      </td>
      <td>getTunnel(id, cb) -> cb(err, res)</td>
    </tr>
    <tr>
      <td>
	DELETE /:username/tunnels/:id <br />
	Shuts down a tunnel given its ID. 
      </td>
      <td>deleteTunnel(id, cb) -> cb(err, res)</td> <br />
    </tr>
    <tr>
      <td>
	GET /info/status <br />
	Returns the current status of Sauce Labs' services. 
      </td>
      <td>getServicesStatus(cb) -> cb(err, res)</td>
    </tr>
    <tr>
      <td>
	GET /info/browsers <br />
	Returns an array of strings corresponding to all the browsers currently supported on Sauce Labs. 
      </td>
      <td>getBrowsers(cb) -> cb(err, res)</td>
    </tr>
    <tr>
      <td>
	GET /info/counter <br />
	Returns the number of test executed so far on Sauce Labs. 
      </td>
      <td>getTestCounter(cb) -> cb(err, res)</td>
    </tr>
    <tr>
      <td>
	POST /users/:id <br />
	Create a new sub-account, specifying a Sauce Labs service plan.
      </td>
      <td>createSubAccount(data, cb) -> cb(err, res)</td>
    </tr>
    <tr>
      <td>POST /users/:id/subscription</td>
      <td> ... </td>
    </tr>
    <tr>
      <td>
  Make a public link to a private job, no need to login
      </td>
      <td>createPublicLink(job_id, datetime, use_hour, cb) -> cb(err, url)<br />
        createPublicLink(job_id, datetime, cb) -> cb(err, url)<br />
        createPublicLink(job_id, cb) -> cb(err, url)</td>
    </tr>
  </tbody>
</table>
	
## More Documentation

Check out the [Sauce REST API](http://saucelabs.com/docs/saucerest)
for more information
