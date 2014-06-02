Template.message_new.helpers({

});

Template.message_new.events({
  'submit #newMessageForm' : function(e){
    e.preventDefault();

    var params = {
      body : $(e.target).find('.tc-message-body .form-control').val(),
      relationId : Session.get('currentRelationId'),
      type : MessageTypes.NORMAL
    }

    // Cleaning params
    params.body = $.trim(params.body)|| "";

    // Do nothing if no content
    if(params.body.length ==0)
      return
    
    Meteor.call('post_message', params, function(err, messageId){
      console.log(err, messageId);
      if(!err)
        $('#newMessageForm')[0].reset();
    });
  },

  'change .myFileInput': function(event, template) {
    FS.Utility.eachFile(event, function(file) {
      Images.insert(file, function (err, fileObj) {
        //If !err, we have inserted new doc with ID fileObj._id, and
        //kicked off the data upload using HTTP
      });
    });
  }
});
