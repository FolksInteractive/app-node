Template.message_edit_controls.events({
  // Attach a new objective
  'click .tc-btn-objective' : function(e){
    var params = {
      'messageId':this._id
    }

    Meteor.call('attach_objective', params, function(err){
      if(err)
        console.log(err);
    });
  },

  // Attach a progress note
  'click .tc-btn-progress' : function(e){
    var params = {
      'messageId':this._id
    }

    Meteor.call('attach_progress_note', params, function(err){
      if(err)
        console.log(err);
    });
  },

  // Discard draft message
  'click .tc-btn-discard' : function(e){
    e.preventDefault();

    Meteor.call('discard_message', {'messageId' : this._id}, function(err){
      if(err)
        console.log(err);
    })
  },

  // Attach/Upload file
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
  }
})