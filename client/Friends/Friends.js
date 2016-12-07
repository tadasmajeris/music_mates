import { Template } from 'meteor/templating';

Template.Friends.helpers({
  AllUsers: function(){
      return Meteor.users.find();
  }
});

Template.friendRequests.helpers({
  hasRequests:function(){
      var currentUser = Meteor.user();
      return currentUser.numPendingRequests() === 0 ? false : true;
  }
});

Template.Friends.events({
  'click #friend-request-btn'(event) {
    event.preventDefault();
    var user = Meteor.users.findOne(this._id);
    var request = user.requestFriendship();
  },
  'click [data-action=accept]': function() {
      //assumes context is a instance of a user
      this.accept();
  },

  'click [data-action=ignore]': function() {
      //assumes context is a instance of a user
      this.ignore();
  },

  'click [data-action=deny]': function() {
      //assumes context is a instance of a user
      this.deny();
  },

});
