Meteor.startup(function(){
  process.env.MAIL_URL = 
  "smtp://app%40timecrumbs.com:funio-pwd@s200.panelboxmanager.com:465";
});

Meteor.methods({
  send_email: function (to, subject, html) {
    check([to, subject, html], [String]);

    // Let other method calls from the same client start running,
    // without waiting for the email sending to complete.
    this.unblock();

    Email.send({
      'to': to,
      'from': "app@timecrumbs.com",
      'subject': subject,
      'html': html
    });
  }
});