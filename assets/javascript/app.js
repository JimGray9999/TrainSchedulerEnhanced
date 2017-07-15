$(document).ready(function() {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyDPuOwzp_uLVa0oLZ5OpgwjMBtbREv74wE",
        authDomain: "train-scheduler-2-4ee4d.firebaseapp.com",
        databaseURL: "https://train-scheduler-2-4ee4d.firebaseio.com",
        projectId: "train-scheduler-2-4ee4d",
        storageBucket: "train-scheduler-2-4ee4d.appspot.com",
        messagingSenderId: "92242130272"
    };
    firebase.initializeApp(config);

    // initial variables
    var database = firebase.database();
    var minsAway = 0;

    const dbRefSchedule = database.ref('/train');

    console.log(dbRefSchedule);

    //Sign In on Modal Button Click
    $("#btnLog").on("click", function() {

        var auth = firebase.auth();

        var email = $("#email").val();
        var pwd = $("#password").val();
        
        var promise = auth.signInWithEmailAndPassword(email, pwd);

        //TODO: developer - show that login was successful or failed
        // if successful, have the modal disappear
        // display train schedule (remove .hide class)
        $("#train-schedule").removeClass(".hide");
        });

    $("#btnSign").on("click", function(){
        var auth = firebase.auth();

        var newEmail = $("#email").val();
        var newPwd = $("#password").val();

        var promise = auth.createUserWithEmailAndPassword(email, pwd);

        //TODO: developer - show that user creation was successful
        });

    // sign current user out
    $("#btnOut").on("click", function(){
        firebase.auth().signOut();

        // show sign out successful

        // hide all trains in schedule
        $("#train-schedule").addClass(".hide");
        });

    //TODO developer: have the time update each minute
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