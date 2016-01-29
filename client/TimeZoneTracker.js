Accounts.ui.config({
  requestPermissions: {
    facebook: ['public_profile'],
    github: ['user']
  },
  passwordSignupFields: "USERNAME_ONLY"
});

Meteor.subscribe("users");

Template.body.events({
  "change [name='pickedTimezone']": function ( event ) {
    var timezone = $( event.target ).find( 'option:selected' ).val();
    Meteor.call("updateTimezone", timezone);
  }
});

Template.body.helpers({
  usersByTimezone: function() {
    var users = Meteor.users.find();

    // aggregate into a map by tz
    // there is prob a better ways todo this
    var results = {};
    users.forEach(function(u) {
      var tz = u.profile.timezone;
      if(!results[tz]) {
        results[tz] = [];
      }
      results[tz].push(u);
    });

    return results;
  }
});

// turns a map into an array, necessary for {{#each}}
Template.registerHelper('arrayify',function(obj){
  result = [];
  for (var key in obj) result.push({key:key,value:obj[key]});
  return result;
});

// setup dependency to update the page once a minute
var nowTimeDep = new Deps.Dependency(); 
var nowTime;
var nowTimeInterval;

function updateNowTime() {
  var nowTime = new Date();
  nowTimeDep.changed(); 
};

Template.timezoneUsers.created = function() {
  updateNowTime(); 
  nowTimeInterval = Meteor.setInterval(updateNowTime, 60000);
};

Template.timezoneUsers.destroyed = function() {
  Meteor.clearInterval(nowTimeInterval);
};

// return formated time by passed in TimeZone
Template.registerHelper( 'nowTime', function (timezone) {

  nowTimeDep.depend(); 

  var time = moment(nowTime);
  var format = 'ddd, h:mm a';

  return timezone ? time.tz( timezone ).format( format ) : time.format( format );
});


