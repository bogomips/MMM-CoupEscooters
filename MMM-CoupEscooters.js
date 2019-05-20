
Module.register("MMM-CoupEscooters",{
    // Default module config.
    // helpful https://github.com/mykle1/MMM-UFO/blob/master/MMM-UFO.js
	defaults: {
        text: "Hello World!",
        myPosition: [],
        apiEndpoint: null,
        updateInterval: 120
    },

    start: function() {
        
        this.sendSocketNotification('GET_SCOOTERS', { myPosition: this.config.myPosition ,apiEndpoint: this.config.apiEndpoint });
        setInterval(() => {
            this.sendSocketNotification('GET_SCOOTERS', { myPosition: this.config.myPosition ,apiEndpoint: this.config.apiEndpoint });
		}, this.config.updateInterval * 1000);
        
    },

	// Override dom generator.
	getDom: function() {
		var wrapper = document.createElement("div");
		wrapper.innerHTML = this.config.text;
		return wrapper;
    },

    notificationReceived: (notification, payload, sender) => {
		/*if (sender) {
			Log.log(this.name + " received a module notification: " + notification + " from sender: " + sender.name);
		} else {
			Log.log(this.name + " received a system notification: " + notification);
		}*/
	},
    
    socketNotificationReceived: function(notification, payload) { 
        Log.info("MOD IS RECEIVING: ", notification, payload);
        if (notification == 'SCOOTERS') {
            Log.log("ui update");
        }
        //this.sendSocketNotification('TRCIK', 'TRACK');
    },

    notificationReceived: function(notification, payload) { 

    }
});