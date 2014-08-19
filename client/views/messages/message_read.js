Template.message_read.helpers({
  objectives : function(){
    return getObjectivesByMessage(this);
  },

  files : function(){
    return getFilesByMessage(this);
  },
})