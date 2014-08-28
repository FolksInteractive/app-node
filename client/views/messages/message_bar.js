Template.message_bar.rendered = function(){

}

Template.message_bar.helpers({

});

Template.message_bar.events({
  'click a' : function(e){
    e.preventDefault();

    Meteor.call('draft_message', {
      'relationId' : Session.get('currentRelationId')
    });
  }
})