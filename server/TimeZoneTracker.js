Accounts.onCreateUser(function(options, user) {

  options.profile = options.profile || {}

  // TODO - find way to get default browser on server
  options.profile.timezone = "US/Pacific";  

  // TODO find a better way to use the color packages on the server
  options.profile.bgColor = '#' + Math.floor(Math.random()*16777215).toString(16);
  options.profile.txtColor = '#' + Math.floor(Math.random()*16777215).toString(16);

  user.profile = options.profile;
  return user;
});

Meteor.publish("users", function () {
  if (this.userId) {
  	// only return necessary fields
    return Meteor.users.find({},
                 {fields: {'profile.timezone': true, 
	             			'profile.bgColor': true,
	             			'profile.txtColor': true,
	             			'profile.name': true,
	             			'username': true,
	             			"services.github.username": true, 
	             			'services.facebook.id': true
                 		}
         		});
  } else {
    this.ready();
  }
});
