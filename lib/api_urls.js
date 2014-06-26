getRelationInviteUrl = function(relationId, token){
  return Meteor.absoluteUrl()+'r/'+relationId;
}