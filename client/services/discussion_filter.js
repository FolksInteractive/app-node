_DiscussionFilter = function(){
  this.criterias = new ReactiveObject({
    "type" : null,
    "objectiveId" : null,
    'relationId' : Session.get('currentRelationId')
  });
};

_DiscussionFilter.prototype.match = function(message){
 
  // Test match for selected objective

  
  if(this.criterias.objectiveId){
    // For objective message type check in the list
    if(message.objectives){
      if(_.contains(message.objectives, this.criterias.objectiveId))
        return true;

    // For progress message type check the objective reference
    }else if(message.objective){
      if(message.objective == this.criterias.objectiveId)
        return true;
    }
  }

  return false;
}

DiscussionFilter = new _DiscussionFilter();

Deps.autorun(function(){
  DiscussionFilter.criterias.objectiveId;

  $timeline = $(".tc-timeline-section");

  if($timeline.length == 0) return;

  if(!$timeline.mixItUp('isLoaded'))
    return;

  $show = $timeline.find('.tc-message').filter(function(item){
      var message = Messages.findOne(this.id);

      return DiscussionFilter.match(message);
  });

  $timeline.mixItUp('filter', $show);

  $timeline.parent('.scrollable-wrapper').animate({  
        scrollTop:0  
    }, 'slow');  
})