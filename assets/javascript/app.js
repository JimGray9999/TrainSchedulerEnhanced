$(document).ready(function() {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyA_btVeabqa-okXDtYE9Q6_pE0YaYCN0I8",
        authDomain: "train-scheduler-38085.firebaseapp.com",
        databaseURL: "https://train-scheduler-38085.firebaseio.com",
        projectId: "train-scheduler-38085",
        storageBucket: "train-scheduler-38085.appspot.com",
        messagingSenderId: "914799628028"
    };
    firebase.initializeApp(config);

    // initial variables
    var database = firebase.database();
    var minsAway = 0;

    const dbRefSchedule = database.ref('/train');

    console.log(dbRefSchedule);

    //TODO developer: have the time update as it changes realtime
    var now24hr = moment().format("HH:mm");
    var now12hr = moment().format("[or simply] LT");
    $("#current-time").html("The Current time is: " + now24hr + " (" + now12hr + ")");

    // inital load, listener for train additions
    dbRefSchedule.on("child_added", function(snapshot) {
        // load current trains in the firebase database (if any)
        // console.log("children: ", snapshot.key);

        var sv = snapshot.val();

        console.log("train freq: " + sv.freq);

        console.log("first train time: " + sv.firstTrain);

        var compareTrain = moment(sv.firstTrain, "HH:mm").subtract(1, "years");

        console.log("converted first train time: " + compareTrain); 

        var timeDiff = moment().diff(compareTrain, "minutes");

        var remains = timeDiff % sv.freq;

        console.log("time difference: " + timeDiff);

        console.log("remainder: " + remains);

        minsAway = sv.freq - remains;

        console.log("Mins Away: " + minsAway);

        // dynamically update HTML table, add new train to bottom
        $("#train-schedule").append(
            "<tr><td>" + sv.train + 
            "</td><td>" + sv.dest + 
            "</td><td>" + sv.freq +
            "</td><td>" + sv.firstTrain + 
            "</td><td class='mins-away'>" + minsAway + 
            "</td></tr>");

        //TODO: developer - have time show in red if less than 5 minutes away
        if (minsAway > 5){
          $("mins-away").addClass("outOfTime");
        } else {
          $("mins-away").removeClass("outOfTime");
        };

    });


    // on click for train submit button
    $("#new-train").on("click", function() {
        // stop blank form submission
        event.preventDefault();

        // capture values from inputs
        var trainName = $("#add-train").val().trim();
        var trainDest = $("#add-destination").val().trim();
        var trainFreq = $("#add-freq").val().trim();
        var train1st = $("#add-1st-train").val().trim();

        // console log test
        // console.log(trainName);
        // console.log(trainDest);
        // console.log(trainFreq);
        // console.log(train1st);

        // add record to firebase, add child
        var newTrain = dbRefSchedule.push();
        newTrain.set({
            train: trainName,
            dest: trainDest,
            freq: trainFreq,
            firstTrain: train1st
        });

        // clear values from form
        $("#add-train").text("");
        $("#add-destination").text("");
        $("#add-freq").text("");
        $("#add-1st-train").text("");
    });
});