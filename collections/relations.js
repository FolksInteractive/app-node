Relations = new Meteor.Collection('relations');

RelationRoles = {
  CLIENT : 'client',
  VENDOR : 'vendor'
}
Meteor.methods({

  'relation_invite': function(params){
    // Makes sure we have all the necessary params
    check(params, {
      linkedinApiId : String,
      linkedinId : String,
      role : String
    });

    // Must be loggedIn
    if(!this.userId)
      throw new Meteor.Error(403)

    var user = getUser(this.userId);

    // Make sure a valid role type
    if(!_.contains(RelationRoles,params.role))
      throw new Meteor.Error(500, "Invalid role");

    // Check if user already exists in TC
    var contact = Meteor.users.findOne({"linkedinId" : params.linkedinId});
    // If contact doesn't exist, we create it by fetching basic information from linkedin
    if(!contact){
      contactParams = Meteor.call('IN_profile', params.linkedinApiId, true); 
      contactId = Meteor.users.insert(contactParams);
      contact = Meteor.users.findOne(contactId);
    }

    // Prepare insert params
    var relationParams = {
      'createdAt' : new Date(),
      'clientId' : (params.role == RelationRoles.CLIENT) ? contact._id : this.userId,
      'vendorId' : (params.role == RelationRoles.VENDOR) ? contact._id : this.userId
    }

    // Send back the existing Relation for possible redirection
    var existingParams = _.pick(relationParams,['clientId', 'vendorId']);
    var existing = Relations.findOne(existingParams);
    if(existing)
      return existing._id;

    //
    // 
    // Creating Relation 
    console.log('Creating relation ...', relationParams);

    // Insert new Relation
    var relationId = Relations.insert(relationParams);

    // Sending Invitation
    if(Meteor.isServer){
      var subject = getFullname(user)+" invites you to TimeCrumbs";
      var data = {
        contact : getFullname(contact),
        user : getFullname(user),
        url : getRelationInviteUrl(relationId)
      }
      var html = renderOnServer("emails-templates/invite.html", data);

      Meteor.call('IN_message', contact.linkedinApiId, subject, html)
      //Meteor.call('send_email', to, subject, html);
    }

    return relationId;
  }
});