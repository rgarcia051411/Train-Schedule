// code for clock
function clock(){
var fullDate = new Date();
var hours = fullDate.getHours();
var minutes = fullDate.getMinutes();
var seconds = fullDate.getSeconds();

if (hours < 10) {
	hours = "0" + hours;
}
if (minutes < 10) {
	minutes = "0" + minutes;
}
if (seconds < 10) {
	seconds = "0" + seconds;
}

document.getElementById('hour').innerHTML = hours;
document.getElementById('minute').innerHTML = ":" + minutes;
document.getElementById('second').innerHTML =":" + seconds;

}

setInterval(clock,100);


// Initialize Firebase
var config = {
    apiKey: "AIzaSyDW-08jWFN9XsoMseHaNgmzFQIJEMAMz68",
    authDomain: "train-schedule-eeb4a.firebaseapp.com",
    databaseURL: "https://train-schedule-eeb4a.firebaseio.com",
    projectId: "train-schedule-eeb4a",
    storageBucket: "train-schedule-eeb4a.appspot.com",
    messagingSenderId: "343393642192"
  };
  firebase.initializeApp(config);

  var dataRef = firebase.database();

  // Declare Initial Values
  var trainName = "";
  var destination ="";
  var firstTrain = "";
  var frequency = "";

   $(document).ready(function(){

   	// Capture click events
   	$("#add-train").on("click", function(event){
   		event.preventDefault();

   	// Grab the value and store in the declared variables.
     	trainName = $("#train-name-input").val().trim();
     	destination = $("#destination-input").val().trim();
     	firstTrain = $("#train-time-input").val().trim();
     	frequency = $("#train-frequency-input").val().trim();


     		// Push data into Firebase
     	dataRef.ref().push({
   			train: trainName,
   			destination: destination,
   			firstTrain: firstTrain,
   			frequency: frequency,
   			dateAdded: firebase.database.ServerValue.TIMESTAMP
   		 });
   	});

   	// Firbase watcher and child added for data
   	dataRef.ref().on("child_added",  function(childSnapshot){

   		// Console log everything from snapshot.
   		// console.log(childSnapshot.val().train);
   		// console.log(childSnapshot.val().destination);
   		// console.log(childSnapshot.val().firstTrain);
   		// console.log(childSnapshot.val().frequency);

      var firstTrainV = childSnapshot.val().firstTrain;
      var frequencyV = childSnapshot.val().frequency;
      
   		// moment JS
   		var timeHour = moment().format('H');
   		var timeMin = moment().format('m');
   		var firstTrainHour = moment(firstTrainV, "HH:mm").format('H');
   		var firstTrainMin = moment(firstTrainV, "HH:mm").format('m');

   		var firstTrainMoment = (firstTrainHour * 60) + (firstTrainMin * 1);
   		var timeMoment = (timeHour * 60) + (timeMin * 1);

   		// How much time elapsed since the first train?
   		var timeDiff = timeMoment - firstTrainMoment;

   		//Number of trains have passed
   		var trainSinceFirst = Math.floor(timeDiff/frequencyV);

   		// How long till the next train
   		var nextTrainArrival = ((trainSinceFirst + 1) * frequencyV) + firstTrainMoment;
      var minutesAway;
      var nextTrainArrival;
   		// values for Minutes away and next arrival
   		if( firstTrainMoment < timeMoment ){
   			minutesAway = nextTrainArrival - timeMoment;
   			nextTrainArrival = moment().add(minutesAway, 'minutes').format('HH:mm');

   		}
   		else{
   			nextTrainArrival = firstTrainV
   			minutesAway = firstTrainMoment - timeMoment;
   			// console.log(minAway);
   		};



      console.log("nextTrainArrival", nextTrainArrival);
      console.log("minutesAway", minutesAway)
   		// Append inputs in the Train Schedule Panel
   		var table = $("tbody");

   		table.append("<tr><td>" + (childSnapshot.val().train) + "</td>" + "<td>" +(childSnapshot.val().destination) + "<td>" + (childSnapshot.val().frequency) + "<td>"+ nextTrainArrival + "</td>" + "<td>" + minutesAway + "</td></tr>" 
   			);


   	// Error handler
   	},function(errorObjects){
   		//console.log("Errors handled:" + errorObjects.code)

   	});

   	dataRef.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot){

   	})



   });

// Author:Robinson Garcia
