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
      'messageId' : this._id,
      'body' : _.trim($form.find('.tc-message-body .form-control').val()) || ''
    }

    // Build DISCCUS MESSAGE type
    if(MessageTypes.DISCUSS == this.type){
      // Do nothing if no content
      if(_.isBlank(params.body))
        return;
    }

    // Build OBJECTIVE MESSAGE type
    if(MessageTypes.OBJECTIVE == this.type){
      var $objectives = $form.find('.tc-edit-objective');
      //Extract objective
      params.objectives = $.map($objectives, function(objectiveElem){
        return $(objectiveElem).find('input').val();
      });

      // Filter empty objectives
      params.objectives = _.filter(params.objectives, function(value){
        return !_.isBlank(_.trim(value));
      });

      // Stop everything if no objective is specified
      if(params.objectives.length === 0)
        return;
    }

    
    // Build PROGRESS MESSAGE type
    if(MessageTypes.PROGRESS == this.type){
      params.progress = {
        'objectiveId' : _.trim($form.find('select[name=progressObjective]').val()),
        'value' : _.toNumber(_.trim($form.find('select[name=progressValue]').val()))
      }

      // Stop everything if no objective or value is specified
      if(_.isBlank(params.progress.objectiveId) || _.isBlank(params.progress.value))
        return;
    }
    
    Meteor.call('post_message', params, function(err, messageId){
      if(!err){
        $form[0].reset();
        //Remove all objective field except the first one
        $form.find('.tc-edit-objective:gt(0)').remove()
      }
    });
  },
});