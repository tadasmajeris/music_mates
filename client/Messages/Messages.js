import { Template } from 'meteor/templating';

Template.Messages.onRendered(function(){
  Meteor.subscribe('users');
  Meteor.subscribe('friends');
  Meteor.subscribe('messages');
  Meteor.subscribe('conversations');
  Meteor.subscribe('notifications');
});

Template.currentConversations.rendered = function(){
  $("#chat").animate({ scrollTop: $('#chat').prop("scrollHeight")}, 80);
};

Template.displayMessagesFriends.helpers({
    hasFriends: function() {
      if (Meteor.user()) {
        return Meteor.user().friends().count() === 0 ? false : true;
      }
    },

    isActive: function(){
      var activeConversation = Meteor.conversations.findOne(Meteor.user().activeConversation);
      var isActive = activeConversation._participants.includes(this.friendId);
      return isActive ? 'active-conversationalist' : ''
    },

    hasNotifications: function(friendId){
      var current = Meteor.user()._id
      var friendsMessages = Notifications.find({to:current, from:friendId}).fetch();
      return friendsMessages.length > 0 ? true : false;
    }
});

Template.displayMessagesFriends.events({
  'click .start-chat-link'(event){
    var conversationFriend = Meteor.users.findOne(this.friendId);
    Meteor.call('removeNotifications', conversationFriend._id)
    var query = { _participants: {$all: [Meteor.userId(), this.friendId]} };
    var conversation = Meteor.conversations.findOne(query);
    if (!conversation) {
      conversation = new Conversation().save();
      conversation.addParticipant(conversationFriend);
    }
    Meteor.call('setActiveConversation', conversation._id);
    $("#message-input").focus();
  },

});

Template.currentConversations.helpers({
  chatActive: function() {
    return true;
  },
  displayMessages: function(conversationId){
    return Meteor.messages.find({conversationId:conversationId});
  },
  messageCount: function(conversationId){
    return Meteor.messages.find({conversationId:conversationId}).count();
  },
  conversationId: function(){
    var id = this.activeConversation;
    if (id) {
      return id;
    }
  },
  scrollTop: function(index){
    var messageCount = $('#chat').attr('data-num');

    //on last message, scroll top
    if ((messageCount - 1) === index) {
      $("#chat").animate({ scrollTop: $('#chat').prop("scrollHeight")}, 80);
    }
  }
});

Template.currentConversations.events({
  'submit #chat-form': function(event) {
    event.preventDefault();
    var conversationId = $('#submit-message').val();
    var input = $("#message-input");
		var body = input.val();
    var conversation = Meteor.conversations.findOne(conversationId);
		conversation.sendMessage(body);
    $("#chat").scrollTop($("#chat").prop("scrollHeight"));
    input.val('');
    var indexOfUser = conversation._participants.indexOf(Meteor.user()._id)-1;
    var otherParticipant = conversation._participants.splice(indexOfUser, 1).pop();
    Meteor.call('pushMessageNotifications', Meteor.user()._id, otherParticipant)
	},

});
