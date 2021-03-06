Template.Profile.onRendered(function(){
  Meteor.subscribe('users');
  Meteor.subscribe('requests');
  Meteor.subscribe('outgoingRequests');
  Meteor.subscribe('tracks');
  Meteor.subscribe('friends');
});

Template.profileDetails.helpers({
  usersName: function(){
    var userId = getUserId();
    var user = Meteor.users.findOne({_id: userId})
    return user.username
  },

  userPlaylists: function(){
    var userId = getUserId();
    var playlists = Playlists.find({userId: userId}).fetch();
    return playlists
  },

  userImage: function(){
    var userId = getUserId();
    var user = Meteor.users.findOne(userId);
    if (user.profile.images.length > 0) {
      var image = user.profile.images[0].url
      return image
    }
  }
});

Template.addSpotifyId.events({
  'click #add-spotify-link'(event){
   event.preventDefault();
   document.getElementById('spotify-id').style='display: unset';
 },
  'click #add-spotify-account'(event){
   event.preventDefault();
   var spotifyId = document.getElementById("addSpotifyId").value;
   Meteor.call('setSpotifyId', spotifyId.toLowerCase())
   FlowRouter.go("/login");
  }
});

function getUserId(){
  if (FlowRouter._current.params.id) {
    return FlowRouter._current.params.id
  } else {
    return Meteor.userId();
  }
}
