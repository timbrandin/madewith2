Template.appItemshort.helpers({
  domain: function() {return getDomain(this);},
  sourceClass: function(){return getsourceClass(this.source);},
});

Template.appItem.helpers({
  domain: function() {return getDomain(this);},
  sourceClass: function(){return getsourceClass(this.source);},
  hasDescript: function(){ //is there a description?
    return this.description != undefined;
  }
});

//TODO:
//set conditional on global bool "verbose," which the router sets 
//to false at home, and becomes true elsewhere
//this will then combine appItem and appItemshort

Template.upvoteButton.helpers({
  upvotedClass: function() {
    return getUpvotedClass(Meteor.userId(), this);
  }
})

function getUpvotedClass(userId, self){
    if (userId && !_.include(self.upvoters, userId)) {
      return 'upvote';
    } else {
      return 'upvote disabled';
    }
}

//change color if sourcecode is included
function getsourceClass(source){
  if (sourceExists(source)) {
    return 'hilight';
  } else{ return ''; };
}

function sourceExists(source){
  return !(source === undefined || source === '');
}

Template.appDetailsLine.helpers({
  ownApp: function() {
    return this.userId === Meteor.userId();
  },
  hasSource: function() {
    return sourceExists(this.source);
  },
  commentLinkText: function(){
    var commentsCount = this.commentsCount;
    if (commentsCount === 0) { //if no comments, link is 'Discuss'
      return 'Discuss';
    } else{ // # Comments if nonzero comments
      var commentNoun = commentsCount.toString() + ' Comment' + pluralize(commentsCount);
      return commentNoun;
    };
  },
  baseDate: function(){
    return new Date(this.submitted);
  },
  voteText: function(){
    return 'vote' + pluralize (this.votes);
  },
  appID: function(){return this._id;},
  debugmode: function(){return false;}, //set to true if debugging 
  packages: function(){
    // console.log(getPackages(this).join(', '));
    console.log(this.packages);
    // console.log(getPackages(this));
    // console.log(this.packages.join(', '));
    // return this.packages.join(', ');
  },
  // packages: function(){
  //   var mySource  = this.source;
  //   var githubdomain = "github.com/";
  //   var prefix    = "https://api.github.com/repos/";
  //   var suffix    = "/contents/.meteor/packages";
  //   var repoId    = mySource.substring(mySource.indexOf(githubdomain,0)+githubdomain.length,mySource.length);
  //   var pSource   = prefix + repoId + suffix;
  //   var myPackages64 = '';
  //   var myPackages = '';
  //   // console.log(pSource);
  //   myPackages = Meteor.call("get_packages",pSource, function(err,result){
  //       // $('.btn_scrape').removeAttr('disabled')
  //       console.log('result');
  //       console.log(result);
  //   });

    // console.log(myPackages);
    
    // res = Meteor.http.get(pSource);
    // var myData = JSON.parse(data);
    // console.log(res.data);
    // myPackages64 = data.content;
    //     myPackages = atob(myPackages64.replace(/\n/g, ""));
    //     console.log(myPackages);
    //     return myPackages;
    // $.getJSON(pSource, function(data){
    // })
    //   .done(function( data ) {
    //     console.log('done');
    //     myPackages64 = data.content;
    //     myPackages = atob(myPackages64.replace(/\n/g, ""));
    //     console.log(myPackages);
    //     return myPackages;
    //   });
    // return myPackages;
  // },
});

Template.appItem.events({
  'click .upvote': function(e){doUpvote(e, this);}
});

Template.appItemshort.events({
  'click .upvote': function(e){
    e.preventDefault();
    Meteor.call('upvote', this._id);
  }
});

function getPackages(self){
  return joinPackages(self.packages);
  // return mypackages.join(', ');
}

function joinPackages(mypkgs){
  return mypkgs.join(', ');
}

function doUpvote(e, self){
  e.preventDefault();
  Meteor.call('upvote',self._id);
}

function getDomain(self){
  var a = document.createElement('a');
  a.href = self.url;
  return a.hostname;
}

//returns 's' if >1, '' otherwise
function pluralize(count) {//concise version
  if (count != 1)
    return 's';
  return '';
}

