Relations = new Meteor.Collection('relations');

RelationRoles = {
  CLIENT : 'client',
  VENDOR : 'vendor'
}
Meteor.methods({
  'relation_accept' : function(invitation, options){
    // Makes sure we have all the necessary params
    check(invitation, {
      token : String,
      relationId : String
    });

    // Sometimes, the person can be invited with two different email address
    // So we ask him to login again and pas the invitation in params
    // We assume that the logged in user just got logged
    // Must be loggedIn
    if(!this.userId)
      return;

    var user = getUser(this.userId);
    var relation = Relations.findOne(invitation.relationId);

    if(!relation || !relation.invitation)
      throw new Meteor.Error(403, "Invalid invitation");

    if(invitation.token != relation.invitation.token)
      throw new Meteor.Error(403, "Invalid invitation");

    // Can't accept invitation if not same linkedin user
    if(!user.linkedinId || relation.invitation.linkedinId != user.linkedinId)
      throw new Meteor.Error(403, "Invalid invitation");

    // Can't accept invitation if it is already accepted
    if(relation.invitation.accepted === true)
      throw new Meteor.Error(403, "Invitation already accepted");

    // Can't accept invitation if user already is the other party
    if(relation.vendorId == this.userId)
      throw new Meteor.Error(403, "User already vendor");
    
    // Can't accept invitation if user already is the other party
    if(relation.clientId == this.userId)
      throw new Meteor.Error(403, "User already client");

    // Can't accept invitation if a similar relation already exists
    var exists;
    if(relation.invitation.role == RelationRoles.CLIENT)
      exists = Relations.find({
        'clientId' : this.userId,
        'vendorId' : relation.vendorId
      }).count();

    if(relation.invitation.role == RelationRoles.VENDOR)
      exists = Relations.find({
        'vendorId' : this.userId,
        'clientId' : relation.vendorId
      }).count();

    if(exists > 0)
      throw new Meteor.Error(403, "A similar relation already exists");

    // If the invitation email address is not the same as the current user has. 
    // We add the invitation email address to the user's email list
    // var userEmails = _.pluck(user.emails, 'address')||[];
    // if(!_.contains(userEmails, invitation.email)){
    //   Meteor.users.update(user._id, {
    //     '$push' : {
    //       'emails' : {
    //         'address' : relation.invitation.email,
    //         'verified' : true
    //       }
    //     }
    //   });
    // }

    // Assign the client or vendor to the pending relaltion
    var updateParams = { '$set' : {
      'invitation.accepted' : true,
      'invitation.acceptedAt' : new Date() 
    }}

    if(relation.invitation.role == RelationRoles.CLIENT)
      updateParams.$set.clientId = user._id;

    if(relation.invitation.role == RelationRoles.VENDOR)
      updateParams.$set.vendorId = user._id;

    Relations.update(relation._id, updateParams);
  },

  'relation_invite': function(params){
    // Makes sure we have all the necessary params
    check(params, {
      linkedinId : String,
      role : String
    });

    // Must be loggedIn
    if(!this.userId)
      return;

    var user = getUser(this.userId);

    // Make sure a valid role type
    if(!_.contains(RelationRoles,params.role))
      throw new Meteor.Error(500, "Invalid role");

    // Check if user already exists in TC
    var contact = Meteor.users.findOne({"linkedinId" : params.linkedinId});
    // If contact doesn't exist, we create it by fetching basic information from linkedin
    if(!contact){
      contactParams = Meteor.call('IN_profile', params.linkedinId, true); 
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
      var to = params.email;
      var subject = getFullname(user)+" invites you to TimeCrumbs";
      var data = {
        contact : getFullname(contact),
        user : getFullname(user),
        url : getRelationInviteUrl(relationId)
      }
      var html = renderOnServer("emails-templates/invite.html", data);

      Meteor.call('IN_message', user.linkedinId, contact.linkedinId, subject, html)
      //Meteor.call('send_email', to, subject, html);
    }

    return relationId;
  }
});