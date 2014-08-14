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
    if(!message.objectives)
      return false;

    // Check if message container objectivesId
    if(!_.contains(message.objectives, this.criterias.objectiveId))
      return false;
  }

  return true;
}

DiscussionFilter = new _DiscussionFilter();