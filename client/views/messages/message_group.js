Template.message_group.helpers({
  'date' : function(){
    return moment(this[0], "YYYY-MM-DD").format("MM/DD");
  },
  'messages' : function(){
    return this[1];
  }
})