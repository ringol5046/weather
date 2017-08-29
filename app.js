const yargs = require('yargs');
const axios = require('axios');

const argv = yargs.option({
	a: {
		demand: true,
		alias: 'address',
		describe: 'address to fetch weather for',
		string: true
	}
})
	.help()
	.alias('help', 'h')
	.argv;

var encodeAddress = encodeURIComponent(argv.address);
var geocodeURL = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeAddress}`;

axios.get(geocodeURL).then((response) => {
	if (response.data.status === 'ZERO_RESULTS') {
		throw new Error('unable to find that address');
	}

	var lat = response.data.results[0].geometry.location.lat;
	var lng = response.data.results[0].geometry.location.lng;
	var weatherURL = `https://api.darksky.net/forecast/b8464c506a41b96ff7e5cd559e6e5d72/${lat},${lng}`;
	console.log(response.data.results[0].formatted_address);
	return axios.get(weatherURL);
}).then((response) => {
	var temperature = response.data.currently.temperature;
	var apparentTemperature = response.data.currently.apparentTemperature;
	console.log(`the currently temperature is ${temperature}, but feel like ${apparentTemperature}`);
})
	.catch((e) => {
		if (e.code === 'ENOTFOUND') {
			console.log('unable to conncect api');
		} else {
			console.log(e.message);
		}
	});