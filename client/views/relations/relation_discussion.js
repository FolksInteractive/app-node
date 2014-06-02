Template.relation_discussion.helpers({
  messages : function(){
    return getMessagesByRelationId(Session.get('currentRelationId'), {
      sort: {createdAt: -1}
    });
  }
})