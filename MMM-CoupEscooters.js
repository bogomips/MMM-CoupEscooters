
Module.register("MMM-CoupEscooters",{

    defaults: {

        myPosition: [],
        cityId: 'fb7aadac-bded-4321-9223-e3c30c5e3ba5',
        updateInterval: 120,
        initialLoadDelay: 2500, 
        scootersToDisplay: 5,
        highlightColor: '#f06595'
        
    },

    start: function() {

        this.scooters = [];
        this.loaded = false;
        this.batteries = ['battery-empty','battery-quarter','battery-half','battery-three-quarters','battery-full'];
        
        this.sendSocketNotification('GET_SCOOTERS', { myPosition: this.config.myPosition ,cityId: this.config.cityId });
        setInterval(() => {
            this.sendSocketNotification('GET_SCOOTERS', { myPosition: this.config.myPosition, cityId: this.config.cityId, scootersToDisplay: this.scootersToDisplay });
		}, this.config.updateInterval * 1000);
        
    },

    getStyles: function() {
		return ['MMM-CoupEscooters.css', 'font-awesome.css'];
	},

    getHeader: function() {
		
		return `COUP escooters: ${this.scooters.length} available`;
	},

	getDom: function() {
        var wrapper = document.createElement("div");
        
        if (this.config.myPosition === "") {
			wrapper.innerHTML = "Please set the correct <i>myPosition</i> array in the config for module: " + this.name + ".";
			wrapper.className = "dimmed light small";
			return wrapper;
        }
        
        if (this.config.cityId === "") {
			wrapper.innerHTML = "Please set the correct <i>cityId</i> in the config for module: " + this.name + ".";
			wrapper.className = "dimmed light small";
			return wrapper;
		}

		if (!this.loaded) {
			wrapper.innerHTML = this.translate("LOADING");
			wrapper.className = "dimmed light small";
			return wrapper;
        }
        
        var table = document.createElement("table");
        table.className = 'small';

        for (let sc=0; sc < this.config.scootersToDisplay; sc++) {
            
            let scooter = this.scooters[sc];
            
            var row = document.createElement("tr");
            table.appendChild(row);

            var modelCell = document.createElement("td");
			modelCell.className = "model";
            modelCell.innerHTML = scooter.model;
            if (scooter.distance <= 150)
                modelCell.style.cssText = `color: ${this.config.highlightColor}`;
            row.appendChild(modelCell);
            
            var plateCell = document.createElement("td");
			plateCell.className = "plate";
            plateCell.innerHTML = scooter.license_plate;
            if (scooter.distance <= 150)
                plateCell.style.cssText = `color: ${this.config.highlightColor}`;
            row.appendChild(plateCell);
            
            var icon = document.createElement("i");
            icon.classList.add("fa", "fa-fw", "fa-" + this.getBatteryIcon(scooter.energy_level));
            //icon.style.cssText = "color: " + "#ff0000";
            var energyCell = document.createElement("td");
			energyCell.className = "energy";
            energyCell.innerHTML = scooter.energy_level+'&nbsp;';

            if (scooter.distance <= 150)
                energyCell.style.cssText = `color: ${this.config.highlightColor}`;

            if (scooter.energy_level > 25+12.5)    
                icon.style.cssText = `color: #00ff00`;
            else if (scooter.energy_level > 20) 
                icon.style.cssText = `color: #F9D71C`;
            else
                icon.style.cssText = `color: #ff0000`;
            
            energyCell.appendChild(icon);
            row.appendChild(energyCell);
            
            var distanceCell = document.createElement("td");
			distanceCell.className = "distance";
            distanceCell.innerHTML = Math.round(scooter.distance)+"m";
          
            if (scooter.distance <= 150)
                distanceCell.style.cssText = `color: ${this.config.highlightColor}`;
			row.appendChild(distanceCell);
        }
        
		return table;
    },

    getBatteryIcon: function(percentage) {

        const _val=12.5;
           
        if (percentage  > 100-_val) 
            value = 4;
        else if (percentage > 75-_val) 
            value = 3;
        else if (percentage > 50-_val) 
            value = 2;
        else if (percentage > 25-_val) 
            value = 1;
        else 
            value = 0;

        return this.batteries[value];
    },
    
    socketNotificationReceived: function(notification, payload) { 
        Log.info("COUP update ");

        if (notification == 'SCOOTERS') {
            this.loaded = true;
            this.scooters = payload;
            this.updateDom(this.config.initialLoadDelay);
        }
    },

    notificationReceived: function(notification, payload) { 

    }
});