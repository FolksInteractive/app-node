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


    // Prepare insert params
    var relationParams = {
      'createdAt' : new Date(),
      'invitation' : {
        'invitedAt' : new Date(),
        'token' : Random.secret(),
        'role' : params.role,
        'accepted' : false,
        // 'email' : params.email,
        'linkedinId' : params.linkedinId || null
      }
    }

    // Check if user already exists in TC
    // If user exist in TC, we check if there is a similar relation (same client and vendor)    
    var contact = Meteor.users.findOne({"emails.address" : params.email});

    var existingRelation = null;

    if(contact){
      relationParams.clientId = (params.role == RelationRoles.CLIENT) ? contact._id : this.userId;
      relationParams.vendorId = (params.role == RelationRoles.VENDOR) ? contact._id : this.userId;
      
      existingRelation = Relations.findOne({
        'clientId' : (params.role == RelationRoles.CLIENT) ? contactId : this.userId,
        'vendorId' : (params.role == RelationRoles.VENDOR) ? contactId : this.userId
      });
    //
    // If contact doesn't exist, we fetch it from linkedin API
    // Check if there is a similar relation by invitation
    }else{     
      // Place the current user to the corresponding role
      // Fetch for a similar relation
      if(params.role == RelationRoles.CLIENT){
        relationParams.vendorId = this.userId

        existingRelation = Relations.findOne({ 
          'vendorId' : relationParams.vendorId,
          'invitation.linkedinId' : params.linkedinId
        });
      }

      if(params.role == RelationRoles.VENDOR){
        relationParams.clientId = this.userId

        existingRelation = Relations.findOne({
          'clientId' : relationParams.clientId,
          'invitation.linkedinId' : params.linkedinId
        });
      }
    }

    // Send back the existing Relation for possible redirection
    if(existingRelation)
      return existingRelation._id;
    //
    // 
    // Creating Relation 
    console.log('Creating relation ...', relationParams);
    
    // Insert new Relation
    var relationId = Relations.insert(relationParams);

    // Sending Invitation
    if(Meteor.isServer){

      if(!contact && params.linkedinId)
          contact = Meteor.call('IN_profile', params.linkedinId); 

      var to = params.email;
      var subject = getFullname(user)+" invites you to TimeCrumbs";
      var data = {
        contact : getFullname(contact),
        user : getFullname(user),
        url : getRelationInviteUrl(relationId, relationParams.invitation.token)
      }
      var html = renderOnServer("emails-templates/invite.html", data);

      Meteor.call('IN_message', user.linkedinId, contact.linkedinId, subject, html)
      //Meteor.call('send_email', to, subject, html);
    }

    return relationId;
  }
});