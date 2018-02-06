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
  var trainTime = "";
  var trainFrequency = "";

   $(document).ready(function(){

   	// Capture click events
   	$("#add-train").on("click", function(event){
   		event.preventDefault();

   	// Grab the value and store in the declared variables.
   	trainName = $("#train-name-input").val().trim();
   	destination = $("#destination-input").val().trim();
   	trainTime = $("#train-time-input").val().trim();
   	trainFrequency = $("#train-frequency-input").val().trim();


   		// Push data into Firebase
   		dataRef.ref().push({
   			train: trainName,
   			destination: destination,
   			time: trainTime,
   			frequency: trainFrequency,
   			dateAdded: firebase.database.ServerValue.TIMESTAMP

   		});
   	});

   	// Firbase watcher
   	dataRef.ref().on("child_added",  function(childSnapshot){

   		// Console log everything from snapshot.
   		console.log(childSnapshot.val().train);
   		console.log(childSnapshot.val().destination);
   		console.log(childSnapshot.val().time);
   		console.log(childSnapshot.val().frequency);

   		// Append inputs in the Train Schedule Panel
   		var table = $("tbody");

   		table.append("<tr><td>" + (childSnapshot.val().train) + "</td>" + "<td>" +(childSnapshot.val().destination) + "<td>" + (childSnapshot.val().frequency) + "</td></tr>" 
   			);


   	// Error handler
   	},function(errorObjects){
   		console.log("Errors handled:" + errorObjects.code)

   	});

   	dataRef.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot){

   	})



   });


