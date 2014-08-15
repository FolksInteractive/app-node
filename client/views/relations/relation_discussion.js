Template.relation_discussion.rendered = function(){
  $('.scrollable-wrapper').perfectScrollbar();


  Deps.autorun(function(){
    console.log(DiscussionFilter.criterias)
  })

}

Template.relation_discussion.helpers({
  timeline : function(){
    var messages = getMessagesByRelation(Session.get('currentRelationId'), {
      sort: {createdAt: -1}
    }).fetch();

    // Grouping message by day
    var timeline = _.groupBy(messages, function(message){
      return moment(message.createdAt).format("YYYY-MM-DD")
    });
    
    // Convert object to array ([0] = YYYY-MM-DD and [1] = messages)
    timeline = _.pairs(timeline);

    return timeline;

  }
});