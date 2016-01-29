Meteor.methods({
  updateTimezone: function(timezone) {
    if (!Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Meteor.users.update(Meteor.userId(), {$set: {
      'profile.timezone': timezone
    }});
  }
});

