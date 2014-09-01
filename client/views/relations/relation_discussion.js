Template.relation_discussion.rendered = function(){
}

Template.relation_discussion.helpers({
  discussion : function(){
    var query = {
      '$or' : [],
      'draft' : false,
      'relationId' : Session.get('currentRelationId')
    };

    // filter by objective id
    if(Session.get('selectedObjectiveId')){
      query.$or.push({ 
        'objectiveId' : Session.get('selectedObjectiveId') 
      });
      query.$or.push({
        'objectives' : {
          '$in' : [Session.get('selectedObjectiveId')]
        }
      });
    }

    // $or must be nonempty array
    if(_.isEmpty(query.$or)){
      delete query.$or;
    }

    return getMessages(query, {
      'sort': {
        'postedAt': -1
      }
    })
    .map(function(doc, index, cursor) {
      var i = _.extend(doc, {index: index});
      return i;
    });
  }
});