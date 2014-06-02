Template.message.helpers({
  'createdAt' : function(){
    return "<span data-livestamp='"+this.createdAt+"'>"+
    moment(this.createdAt).fromNow()
      +"</span>";
  }
})