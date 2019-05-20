
const NodeHelper = require('node_helper');
const request = require('request');
const _ = require('lodash');

module.exports = NodeHelper.create({

  	start: function() {
		
		
	},

    socketNotificationReceived: async function(notification, payload) {

		if (notification == 'GET_SCOOTERS') {
			if ( ('myPosition' in payload) && ('apiEndpoint' in payload) ) {

				let response = await this.getScooters(payload.apiEndpoint);
				let scooters = response.data.scooters;
				for (scooter in scooters) {
					scooters[scooter].distance = this.calc_distance(scooters[scooter].location.lat,scooters[scooter].location.lng,payload.myPosition[0],payload.myPosition[1],"k")*1000;
				}
				let ordered_scooter = _.sortBy(scooters, [(o) =>  o.distance ]);

				this.sendSocketNotification('SCOOTERS', ordered_scooter);
			}
			else {
				console.log(`${this.name}: the config file must contain myPosition and apiEndpoint!`);
			}
		}
       
       
	},
	
	calc_distance: (lat1, lon1, lat2, lon2, unit) => {
		if ((lat1 == lat2) && (lon1 == lon2)) {
			return 0;
		}
		else {
			var radlat1 = Math.PI * lat1/180;
			var radlat2 = Math.PI * lat2/180;
			var theta = lon1-lon2;
			var radtheta = Math.PI * theta/180;
			var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
			if (dist > 1) {
				dist = 1;
			}
			dist = Math.acos(dist);
			dist = dist * 180/Math.PI;
			dist = dist * 60 * 1.1515;
			if (unit=="K") { dist = dist * 1.609344 }
			if (unit=="N") { dist = dist * 0.8684 }
			return dist;
		}
	},

	getScooters: (url) => {
		return new Promise((resolve, reject) => {
			request({ url: url, method: 'GET' }, function (error, response, body) {
				if (!error && response.statusCode == 200) {
					try {
						resolve(JSON.parse(body));
					}
					catch(e) {
						console.log(e);
						reject(e);
					}
				}
			});
		});
	}

});