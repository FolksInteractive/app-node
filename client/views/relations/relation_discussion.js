Template.relation_discussion.rendered = function(){
  $('.tc-timeline-section').perfectScrollbar();
}

Template.relation_discussion.helpers({
  timeline : function(){

    var criterias = {
      'relationId' : Session.get('currentRelationId')
    };
    // Filter DiscussionCriterias to keep only defined criterias
     _.each(DiscussionCriterias,function(value, key){
      if(value)
        criterias[key] = value;
    });

     console.log(criterias);

    var messages = Messages.find(criterias, {
      'sort': {'createdAt': -1}
    }).fetch();


    // Grouping message by day
    var timeline = _.groupBy(messages, function(message){
      return moment(message.createdAt).format("YYYY-MM-DD")
    });
    
    // Convert object to array ([0] = YYYY-MM-DD and [1] = messages)
    timeline = _.pairs(timeline);

    return timeline;

  }
})