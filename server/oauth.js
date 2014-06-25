Meteor.startup(function(){

  ServiceConfiguration.configurations.remove({});  

  if(_.startsWith(Meteor.absoluteUrl(), 'http://localhost:3000')){

    ServiceConfiguration.configurations.insert({
      service: 'linkedin',
      clientId: '776ctwniw7z5vi',
      secret: 'ixyTXtoSNuJq7beh'
    });

  } else {
    // Insert all login configs for production
    ServiceConfiguration.configurations.insert({
      service: 'linkedin',
      clientId: '776ctwniw7z5vi',
      secret: 'ixyTXtoSNuJq7beh'
    });
  }

});
