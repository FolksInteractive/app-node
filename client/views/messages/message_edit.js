Template.message_edit.helpers({
});

Template.message_edit.events({
  // Upload file handler
  'change input[type=file]': function(event, template) {
    var message = this;

    FS.Utility.eachFile(event, function(file) {
      var fsFile = new FS.File(file);
      fsFile.relationId = Session.get('currentRelationId');
      fsFile.messageId = message._id;
      fsFile.uploaderId = Meteor.userId();
      fsFile.draft = true;

      Files.insert(fsFile, function (err, fileResult) {
        //Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
        if(err)
          return console.log(err);
      });
    });
  },

  'click .tc-discard' : function(e){
    e.preventDefault();

    Meteor.call('discard_message', {'messageId' : this._id, 'wait' : 1000}, function(err){
      if(err)
        console.log(err);
    })
  },
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
  },
});