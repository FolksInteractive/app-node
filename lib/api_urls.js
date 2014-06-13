getRelationInviteUrl = function(relationId, token){
  return Meteor.absoluteUrl()+'invite/'+token+"?relation="+relationId;
}