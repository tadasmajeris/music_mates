Template.Navigation.rendered = function() {
  var selectedNavButton = FlowRouter._current.path.substring(1);
  document.getElementById(selectedNavButton).className = 'selected_route';
}

Template.Navigation.events({
  'click nav button'(event){
    var buttonId = event.target.id;
    FlowRouter.go(buttonId);
    var currentlySelectedButton = document.getElementsByClassName('selected_route')[0];
    currentlySelectedButton.className = '';
    document.getElementById(buttonId).className = 'selected_route';
  }
});