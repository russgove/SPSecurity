(function () {
  "use strict";

  var context = SP.ClientContext.get_current();
  var user = context.get_web().get_currentUser();

  JSRequest.EnsureSetup();
  var hostweburl = JSRequest.QueryString["SPHostUrl"];
  var appweburl = JSRequest.QueryString["SPAppWebUrl"];
  hostweburl = decodeURIComponent(hostweburl);
  appweburl = decodeURIComponent(appweburl);

  var secApp = angular.module("secApp", ["spSecurity", 'ui.router', "ngSanitize", "ui.select", 'ui.grid', 'ui.grid.pinning', 'ui.grid.expandable', 'ngContextMenu']);
  secApp.filter('RoleAssignmentsFilter', function () {
    return function (input) {

      return input;
    };
  })


  secApp.config(function ($locationProvider) { // this is needed for $location.seartch() to work
    $locationProvider.html5Mode(true);
  });
  secApp.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/listsecurity');
    $stateProvider
        // HOME STATES AND NESTED VIEWS ========================================
        .state('home', {
          templateUrl: appweburl + '/Lists/partials/home.html',
          url: '/home'
        })
        .state('siteusers', {
          url: '/siteusers',
          templateUrl: appweburl + '/Lists/partials/siteusers.html',
          resolve: {
            siteUsers: function (spSecurity) {
              return spSecurity.loadSiteUsers();
            }
          },
          controller: 'siteusersController'
        })
         .state('sitegroups', {
           url: '/sitegroups',
           templateUrl: appweburl + '/Lists/partials/sitegroups.html',
           resolve: {
             siteGroups: function (spSecurity) {
               return spSecurity.loadSiteGroups();
             }
           },
           controller: 'sitegroupsController'
         })
           .state('roledefinitions', {
             url: '/roledefinitions',
             templateUrl: appweburl + '/Lists/partials/roledefinitions.html',
             resolve: {
               roleDefinitions: function (spSecurity) {
                 return spSecurity.loadWebRoleDefinitions();
               }
             },
             controller: 'roledefinitionsController'
           })
             .state('webroleassignments', {
               url: '/webroleassignments',
               templateUrl: appweburl + '/Lists/partials/webroleassignments.html',
               resolve: {
                 roleAssignments: function (spSecurity) {
                   return spSecurity.loadWebRoleAssigmentsDefinitionsMembers();
                 }
               },
               controller: 'webroleassignmentsController'
             })
             .state('listroleassignments', {
               url: '/listroleassignments',
               templateUrl: appweburl + '/Lists/partials/listroleassignments.html',
               resolve: {
                 roleAssignments: function (spSecurity) {
                   return spSecurity.loadListRoleAssigmentsDefinitionsMembers();
                 }
               },
               controller: 'listroleassignmentsController'
             })
          .state('listSecurity', {
            url: '/listsecurity',
            templateUrl: appweburl + '/Lists/partials/listsecurity.html',
            resolve: {
              siteUsers: function (spSecurity) {
                return spSecurity.loadSiteUsers();
              },
              lists: function (spSecurity) {
                return spSecurity.loadListNames();
              }
            },
            controller: 'listsecurityController'
          })
       
        .state('about', {
       
        });
  });



  secApp.run(function (spSecurity, $location) {
    spSecurity.setHostWebUrl(decodeURIComponent($location.search().SPHostUrl));
    spSecurity.setAppWebUrl(decodeURIComponent($location.search().SPAppWebUrl));
    spSecurity.setRequestDigest(angular.element(document.querySelector('#__REQUESTDIGEST')).val());
  });



  angular.module('secApp').run(function ($rootScope, $location) {
    $rootScope.appWebUrl = decodeURIComponent($location.search().SPAppWebUrl);
  });


  angular.module('secApp').run(function ($rootScope, $state) {
    $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
      alert('a state change error occurred and was caught in my app.js' + error);
      event.preventDefault();
      $state.go('error');
    });
  });

})();

