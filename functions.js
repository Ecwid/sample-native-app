// Initialize the application

	EcwidApp.init({
	  app_id: "sample-native-app", // use your application namespace
	  autoloadedflag: true, 
	  autoheight: true
	});

	var storeData = EcwidApp.getPayload();

     var storeId = storeData.store_id;
     var accessToken = storeData.access_token;
     var language = storeData.lang;
     var viewMode = storeData.view_mode;

     if (storeData.public_token !== undefined){
       var publicToken = storeData.public_token;
     }

     if (storeData.app_state !== undefined){
       var appState = storeData.app_state;
     }

// Function to go to edit product label page

function showEditPage(elementClass){
	document.querySelector('.main').style.display = 'none';
	document.querySelector(elementClass).style.display = 'block';
	document.querySelector('.content-control-menu-nav').style.display = 'flex';
}


// Function to retutn back to main app page after editing product label
function goBack(){
	document.querySelector('.content-control-menu-nav').style.display = 'none';
	document.querySelector('.main').style.display = 'block';

	// hide all separate pages for editing
	for(i=0;i<document.querySelectorAll('.separate-editing-page').length; i++) {
		document.querySelectorAll('.separate-editing-page')[i].style.display = 'none';
	}
}

// Get info from store to display in dashboard

function getInfoForDashboard(){
	var xhttp = new XMLHttpRequest();
	var requestURL = 'https://app.ecwid.com/api/v3/'+storeId+'/profile?token='+accessToken;

	xhttp.open("GET", requestURL, true);
	xhttp.send();

	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
	    	var apiResponse = xhttp.responseText;
			apiResponse = JSON.parse(apiResponse);	
			document.querySelector("div#currency").innerHTML = apiResponse.formatsAndUnits.currency;
		}
	}

	var xhttp2 = new XMLHttpRequest();
	var requestURL2 = 'https://app.ecwid.com/api/v3/'+storeId+'/products?limit=1&token='+accessToken;

	xhttp2.open("GET", requestURL2, true);
	xhttp2.send();

	xhttp2.onreadystatechange = function() {
		if (xhttp2.readyState == 4 && xhttp2.status == 200) {
	    	var apiResponse = xhttp2.responseText;
			apiResponse = JSON.parse(apiResponse);	
			document.querySelector("div#productCount").innerHTML = apiResponse.total + " product(s)";
		}
	}
	
	var xhttp7 = new XMLHttpRequest();
	var requestURL7 = 'https://app.ecwid.com/api/v3/'+storeId+'/latest-stats?token='+accessToken;

	xhttp7.open("GET", requestURL7, true);
	xhttp7.send();

	xhttp7.onreadystatechange = function() {
		if (xhttp7.readyState == 4 && xhttp7.status == 200) {
	    	var apiResponse = xhttp7.responseText;
			apiResponse = JSON.parse(apiResponse);	
			document.querySelector("div#productsUpdated").innerHTML = "Last updated: " + apiResponse.productsUpdated;
		}
	}

	var xhttp3 = new XMLHttpRequest();
	var requestURL3 = 'https://app.ecwid.com/api/v3/'+storeId+'/carts?limit=1&token='+accessToken;

	xhttp3.open("GET", requestURL3, true);
	xhttp3.send();

	xhttp3.onreadystatechange = function() {
		if (xhttp3.readyState == 4 && xhttp3.status == 200) {
	    	var apiResponse = xhttp3.responseText;
			apiResponse = JSON.parse(apiResponse);	
			document.querySelector("div#abandonedSales").innerHTML = apiResponse.total;
		}
	}

	var xhttp4 = new XMLHttpRequest();
	var requestURL4 = 'https://app.ecwid.com/api/v3/'+storeId+'/customers?limit=1&token='+accessToken;

	xhttp4.open("GET", requestURL4, true);
	xhttp4.send();

	xhttp4.onreadystatechange = function() {
		if (xhttp4.readyState == 4 && xhttp4.status == 200) {
	    	var apiResponse = xhttp4.responseText;
			apiResponse = JSON.parse(apiResponse);	
			document.querySelector("div#customersCount").innerHTML = apiResponse.total;
		}
	}

	var xhttp5 = new XMLHttpRequest();
	var requestURL5 = 'https://app.ecwid.com/api/v3/'+storeId+'/orders?limit=1&fulfillmentStatus=SHIPPED&token='+accessToken;

	xhttp5.open("GET", requestURL5, true);
	xhttp5.send();

	xhttp5.onreadystatechange = function() {
		if (xhttp5.readyState == 4 && xhttp5.status == 200) {
	    	var apiResponse = xhttp5.responseText;
			apiResponse = JSON.parse(apiResponse);	
			document.querySelector("div#shippedOrders").innerHTML = apiResponse.total;
		}
	}

	var xhttp6 = new XMLHttpRequest();
	var requestURL6 = 'https://app.ecwid.com/api/v3/'+storeId+'/orders?limit=1&fulfillmentStatus=AWAITING_PROCESSING&token='+accessToken;

	xhttp6.open("GET", requestURL6, true);
	xhttp6.send();

	xhttp6.onreadystatechange = function() {
		if (xhttp6.readyState == 4 && xhttp6.status == 200) {
	    	var apiResponse = xhttp6.responseText;
			apiResponse = JSON.parse(apiResponse);	
			document.querySelector("div#awaitingProcessing").innerHTML = apiResponse.total;
		}
	}
}


function parseAllKeys(allKeys){
	for (i=0; i<allKeys.length; i++){
		var currentKeyName = allKeys[i].key;
		if(currentKeyName !== 'public'){
			loadedConfig.private[currentKeyName] = allKeys[i].value;
		} else {
			loadedConfig.public = JSON.parse(allKeys[i].value);
		}
	}
	console.log(loadedConfig);
}


// Default settings for new accounts

var initialConfig = {
	syncOrders: 'true',
	accountName: "crazyPotatoes",
	exists: "yes",
	dropdown: null
};

var loadedConfig = initialConfig;

// Executes when we have a new user install the app. It creates and sets the default data using Ecwid JS SDK and Application storage

function createUserData() {

	EcwidApp.setAppStorage(initialConfig, function(lala){
		console.log('Initial user preferences saved!');
		console.log(lala);
	});

	document.querySelector('div#syncOrders input[type="checkbox"]').checked = initialConfig.syncOrders;
	document.querySelector('div#accountName input[type="text"]').value = initialConfig.accountName;
	document.querySelector('div#accountName .field__input').parentNode.classList.add('field--filled');
	document.querySelector('div#dropdown select').value = initialConfig.dropdown;
	// Setting flag to determine that we already created and saved defaults for this user

	loadedConfig = initialConfig;
}




// Executes if we have a user who logs in to the app not the first time. We load their preferences from Application storage with Ecwid JS SDK and display them in the app iterface

function getUserData() {

	EcwidApp.getAppStorage("syncOrders", function(syncOrders){
		loadedConfig.syncOrders = syncOrders;
	});

	EcwidApp.getAppStorage("accountName", function(accountName){
		loadedConfig.accountName = accountName;
	});

	EcwidApp.getAppStorage("dropdown", function(dropdown){
		loadedConfig.dropdown = dropdown;
	});


	setTimeout(function(){

		document.querySelector('div#syncOrders input[type="checkbox"]').checked = (loadedConfig.syncOrders == 'true');
		document.querySelector('div#accountName input[type="text"]').value = loadedConfig.accountName;
		document.querySelector('div#accountName .field__input').parentNode.classList.add('field--filled');
		document.querySelector('div#dropdown select').value = loadedConfig.dropdown;

	}, 1500);

}



// Executes when we need to save data. Gets all elements' values and saves them to Application storage via Ecwid JS SDK

function saveUserData() {

	// var d = document.getElementById("save");
	// d.className += " btn-loading";

	var saveData = loadedConfig;

	saveData.syncOrders = String(document.querySelector('div#syncOrders input[type="checkbox"]').checked);
	saveData.accountName = document.querySelector('div#accountName input[type="text"]').value;
	saveData.dropdown = document.querySelector('div#dropdown select').value;

	console.log(saveData);

	EcwidApp.setAppStorage(saveData, function(savedData){
		console.log('User preferences saved!');
		console.log(savedData);
		d.className = "btn btn-primary btn-large";
	});

}


// Main app function to determine if the user is new or just logs into the app

EcwidApp.getAppStorage('installed', function(value){

  if (value != null) {
  		getUserData();
  }
  else {
  		createUserData();
  }
})


