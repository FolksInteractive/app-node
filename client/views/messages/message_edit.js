Template.message_edit.helpers({
});

Template.message_edit.events({

  // Posting message
  'submit form' : function(e){
    e.preventDefault();

    var $form = $(e.target);
    var relationId = Session.get('currentRelationId')

    var params = {
      'messageId' : this._id
    }

    Meteor.call('post_message', params, function(err, messageId){
      if(err)
        return console.log(err);


    });
  }

});