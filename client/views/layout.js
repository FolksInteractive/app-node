Template.layout.helpers({
  globalState : function(){
    if(Meteor.loggingIn())
      return '';

    return (Meteor.userId() ? 'logged' : '');
  }
});