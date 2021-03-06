Template.appSubmit.events({
  'submit form': function(e) {
    e.preventDefault();

    var app = {
      url:    $(e.target).find('[name=url]').val(),
      source: $(e.target).find('[name=source]').val(),
      title:  $(e.target).find('[name=title]').val(),
      description: $(e.target).find('[name=description]').val(),
      commentCount: 0
    };

    var user = Meteor.user();

    if (!user) {
      Meteor.loginWithMeteorDeveloperAccount(function (err) {
        if (!err)
          user = Meteor.user();
          submitApp(app, user);
          return;
      });
    } 

    submitApp(app, user);
  }
});

// the actual app submitting lives in a helper function

function submitApp(app, user){

  var doSubmitApp = function (app) {
    var urlname = toUrlName(normalizeAppURL(app.url));

    Meteor.call('app', app, function(error, id) {
      if (error) {        //display error to user
        // if the error is that the app already exists, take us there
        if (error.error === 302) {
          Router.go('appPage', {urlname: urlname});
        } else {
          throwError(error.reason);
        }
      } else {
        Router.go('appPage', {urlname: urlname});
      };
    });
  };

  app.author = user.profile.name;

  if (thingExists(app.source)) {
    Meteor.call('get_packages', app.source, function(err, myPackages){
      app.pkgs = myPackages;
      doSubmitApp(app);
    });
  } else{
    app.pkgs = [];
    doSubmitApp(app);
  };

}
