Template.message_edit_files.helpers({
  files : function(){
    return getFilesByMessage(this);
  }  
});

Template.message_edit_files.events({
  // Remove file handler
  'click .tc-remove' : function(e){
    e.preventDefault();

    Meteor.call('remove_file', this._id)
  },
})