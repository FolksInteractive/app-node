Template.message_edit_files.helpers({
  files : function(){
    return getFilesByMessage(this)
  }  
});

Template.message_edit_files.events({
  // Remove file handler
  'click .tc-remove' : function(e){
    e.preventDefault();

    Meteor.call('remove_file', this._id)
  },

  // Upload file handler
  'change input[type=file]': function(event, template) {
    var message = this;

    FS.Utility.eachFile(event, function(file) {
      var fsFile = new FS.File(file);
      fsFile.relationId = Session.get('currentRelationId');
      fsFile.messageId = message._id;
      fsFile.uploaderId = Meteor.userId();

      Files.insert(fsFile, function (err, fileResult) {
        //Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
        if(err)
          return console.log(err);
      });
    });
  },
})