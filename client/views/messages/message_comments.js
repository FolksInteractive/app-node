Template.message_comments.rendered = function(){

}

Template.message_comments.helpers({

  'comments' : function(){
    return getCommentsByMessage(this);
  }
});

Template.message_comments.events({
  'submit form' : function(e){
    e.preventDefault();

    var $form = $(e.target);

    var params = {
      'messageId' : this._id,
      'body' : _.trim($form.find('input').val()) || ''
    }

    if(_.isEmpty(params.body))
      return;

    Meteor.call('reply', params, function(err, commentId){
      if(err)
        return console.log(err);

      $form[0].reset();
    })
  }
});