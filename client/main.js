
// subscriptions to Apps collection
newAppsHandle = Meteor.subscribeWithPagination('newApps',14);
popularAppsHandle = Meteor.subscribeWithPagination('popularApps',14);

Deps.autorun(function(){
  var urlname = Session.get('currentAppUrlname');
  if (urlname) {
    Meteor.subscribe('singleApp', urlname);
    Meteor.subscribe('comments', urlname);
  }
});

Session.setDefault('navPop','home'); //if you've just gotten here, you're home

///////////////////Iron-Router///////////////////
Router.configure({
  layoutTemplate: 'MyLayout',
});


Router.map(function () {

  // the home page is the front page; with trending apps
  this.route('home', {
    path: '/', // match the root path
    template: 'popularApps',
    onRun: function() {
      Session.set('myPkg','');
      Session.set('navPop','home');
    }
  });

  this.route('newest', {
    path: '/newest', // match the newest path
    template: 'newApps',
    onRun: function() {
      Session.set('myPkg','');
      Session.set('navPop','newest');
    }
  });

  this.route('pkg', {
    path: '/pkg', // match the pkg path
    template: 'appsByPkg',
    onRun: function () {
      Session.setDefault('myPkg','');
    }
  });

  this.route('pkgPage', {
    path: '/pkg/:pkgname', // match the pkgname
    template: 'appsByPkg',
    data: function() { 
      return appByUrlname(this.params.pkgname); 
    },
    onRun: function () {
      Session.set('myPkg',this.params.pkgname);
      Session.set('navPop','pkgPage');
    }
  });

  this.route('appPage', {
    path: '/apps/:urlname',
    data: function() { 
      return appByUrlname(this.params.urlname); 
    },
    onRun: function () { // called on first load
      Session.set('currentAppUrlname', this.params.urlname);
    },
    waitOn: function() {
      return [
        Meteor.subscribe('singleApp', this.params.urlname),
        Meteor.subscribe('comments', this.params.urlname)
      ];
    }
  });

  this.route('badgePage', {
    path: '/badge/:urlname',
    data: function() { return appByUrlname(this.params.urlname); },
    onRun: function () { // called on first load
      Session.set('currentAppUrlname', this.params.urlname);
    },
    layoutTemplate: null,
    waitOn: function() {
      return [
        Meteor.subscribe('singleApp', this.params.urlname)
      ];
    }
  });

  // editing each app
  this.route('appEdit', {
    path: '/apps/:urlname/edit', // path with id of appPage
    onRun: function () { // called on first load
      Session.set('currentAppUrlname', this.params.urlname);
    }
  });


  //app submission
  this.route('appSubmit', {
    path: '/submit', 

  });
});

