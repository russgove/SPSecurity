
(
function () {
  "use strict";

  var spSecurity = angular.module("spSecurity", [])
  spSecurity.provider('spSecurity', function UnicornLauncherProvider() {

    this.$get = ["$http", "$q", "$log", "$filter", function unicornLauncherFactory($http, $q, $log, $filter) {
      return new SPSecurity($http, $q, $log, $filter);
    }];
  });
  function SPSecurity($http, $q, $log, $filter, hostWebUrl, appWebUrl, requestDigest) {
    var self = this;
    /**
* Gets the lists n the site and shows which users have the speciofied basepermission
* @basepermission {string} the spBasePermission to check for 
* @showHiddenLists {booolean} Weather to show hidden lists or not
* @requestedUserIds {array of strings} optional array of userids to include
* @requestedListIds {array of strings} optional array of listIds to include
* @return {Number} sum
*/
    self.GetListSecurity = function (showHiddenLists, basePermission, requestedUserIds, requestedListIds) {
      var listSecurityLoaded = $q.defer();
      var listsLoaded = this.loadListRoleAssigmentsDefinitionsMembers();
      var roleDefsLoaded = this.loadWebRoleDefinitions();
      var userLoaded = this.loadSiteUsers();
      var siteGroupsLoaded = this.loadSiteGroups();

      $q.all([userLoaded, listsLoaded, roleDefsLoaded, siteGroupsLoaded]).then(function (promises) {
        var selectedLists = [];
        var users = promises[0];
          //  var lists = $filter('filter')(promises[1], { Hidden: showHiddenLists });
        var lists = $filter('filter')(promises[1], function () {
            var showHidden = showHiddenLists;
            return function (list, index, array) {
                if (list.Hidden) {
                    return showHidden
                }
                else {
                    return true;
                };
            };
        }());
        var roles = promises[2];
        var siteGroups = promises[3];
        // forachh list, foreachuser, see if the user has security

        for (var listIdx = 0; listIdx < lists.length; listIdx++) {
          var list = lists[listIdx];
          var listSelected = false;
          // see if the list is selected
          if (requestedListIds && requestedListIds.length > 0) {// should do this once upffront
            for (var requestedListIdIdx = 0; requestedListIdIdx < requestedListIds.length; requestedListIdIdx++) {
              if (list.Id == requestedListIds[requestedListIdIdx]) {
                listSelected = true;
                break;
              }
            }
          }
          else {
            listSelected = true;
          }
          if (listSelected) {
            list.users = [];
            selectedLists.push(list);
            // see if the user is elected
            for (var usersIdx = 0; usersIdx < users.length; usersIdx++) {
              var user = users[usersIdx];
              var userSelected = false;
              if (requestedUserIds && requestedUserIds.length > 0) {// should do this once upffront
                for (var requestedUserIdIdx = 0; requestedUserIdIdx < requestedUserIds.length; requestedUserIdIdx++) {
                  if (user.Id == requestedUserIds[requestedUserIdIdx]) {
                    userSelected = true;
                    break;
                  }
                }
              }
              else {
                userSelected = true;
              }
              if (userSelected) {
                // the user and list are slected, see if the user has the permission
                var hasPermission = self.doesUserHavePermission(list, user, basePermission, roles, siteGroups);
                list.users[user.Title] = hasPermission;
              }
            };

          };

        };
        listSecurityLoaded.resolve(selectedLists);
      });
      return listSecurityLoaded.promise;
    };


    self.setHostWebUrl = function (url) {
      self.hostWebUrl = url;
    };
    self.setAppWebUrl = function (url) {
      self.appWebUrl = url;
    };
    self.setRequestDigest = function (rd) {
      self.requestDigest = rd;
    };
    self.principalTypes = {
      none: 0,
      user: 1,
      distributionList: 2,
      securityGroup: 4,
      sharePointGroup: 8,
      all: 15

    }
    self.basePermissions = {
      ViewListItems: {
        high: 0x00000000,
        low: 0x00000001,
        description: "View items in lists, documents in document libraries, and view Web discussion comments.",
        type: "List"
      },
      AddListItems: {
        high: 0x00000000,
        low: 0x00000002,
        description: "Add items to lists, add documents to document libraries, and add Web discussion comments.",
        type: "List"
      },
      EditListItems: {
        high: 0x00000000,
        low: 0x00000004,
        description: "Edit items in lists, edit documents in document libraries, edit Web discussion comments in documents, and customize Web Part Pages in document libraries.",
        type: "List"
      },
      DeleteListItems: {
        high: 0x00000000,
        low: 0x00000008,
        description: "Delete items from a list, documents from a document library, and Web discussion comments in documents.",
        type: "List"
      },
      ApproveItems: {
        high: 0x00000000,
        low: 0x00000010,
        description: "Approve a minor version of a list item or document.",
        type: "List"
      },
      OpenItems: {
        high: 0x00000000,
        low: 0x00000020,
        description: "View the source of documents with server-side file handlers.",
        type: "List"
      },
      ViewVersions: {
        high: 0x00000000,
        low: 0x00000040,
        description: "View past versions of a list item or document.",
        type: "List"
      },
      DeleteVersions: {
        high: 0x00000000,
        low: 0x00000080,
        description: "Delete past versions of a list item or document.",
        type: "List"
      },
      CancelCheckout: {
        high: 0x00000000,
        low: 0x00000100,
        description: "Discard or check in a document which is checked out to another user.",
        type: "List"
      },
      ManagePersonalViews: {
        high: 0x00000000,
        low: 0x00000200,
        description: "Create, change, and delete personal views of lists.",
        type: "List"
      },
      ManageLists: {
        high: 0x00000000,
        low: 0x00000800,
        description: "Create and delete lists, add or remove columns in a list, and add or remove public views of a list.",
        type: "List"
      },
      ViewFormPages: {
        high: 0x00000000,
        low: 0x00001000,
        description: "View forms, views, and application pages, and enumerate lists.",
        type: "List"
      },


      Open: {
        high: 0x00000000,
        low: 0x00010000,
        description: "Allow users to open a Web site, list, or folder to access items inside that container.",
        type: "Web"
      },
      ViewPages: {
        high: 0x00000000,
        low: 0x00020000,
        description: "View pages in a Web site.",
        type: "Web"
      },
      AddAndCustomizePages: {
        high: 0x00000000,
        low: 0x00040000,
        description: "Add, change, or delete HTML pages or Web Part Pages, and edit the Web site using a SharePoint Foundation–compatible editor.",
        type: "Web"
      },
      ApplyThemeAndBorder: {
        high: 0x00000000,
        low: 0x00080000,
        description: "Apply a theme or borders to the entire Web site.",
        type: "Web"
      },
      ApplyStyleSheets: {
        high: 0x00000000,
        low: 0x00100000,
        description: "Apply a style sheet (.css file) to the Web site.",
        type: "Web"
      },
      ViewUsageData: {
        high: 0x00000000,
        low: 0x00200000,
        description: "View reports on Web site usage.",
        type: "Web"
      },
      CreateSSCSite: {
        high: 0x00000000,
        low: 0x00400000,
        description: "Create a Web site using Self-Service Site Creation.",
        type: "Web"
      },
      ManageSubwebs: {
        high: 0x00000000,
        low: 0x00800000,
        description: "Create subsites such as team sites, Meeting Workspace sites, and Document Workspace sites. ",
        type: "Web"
      },
      CreateGroups: {
        high: 0x00000000,
        low: 0x01000000,
        description: "Create a group of users that can be used anywhere within the site collection.",
        type: "Web"
      },
      ManagePermissions: {
        high: 0x00000000,
        low: 0x02000000,
        description: "Create and change permission levels on the Web site and assign permissions to users and groups.",
        type: "Web"
      },
      BrowseDirectories: {
        high: 0x00000000,
        low: 0x04000000,
        description: "Enumerate files and folders in a Web site using Microsoft Office SharePoint Designer 2007 and WebDAV interfaces.",
        type: "Web"
      },
      BrowseUserInfo: {
        high: 0x00000000,
        low: 0x08000000,
        description: "View information about users of the Web site.",
        type: "Web"
      },
      AddDelPrivateWebParts: {
        high: 0x00000000,
        low: 0x10000000,
        description: "Add or remove personal Web Parts on a Web Part Page",
        type: "Web"
      },
      UpdatePersonalWebParts: {
        high: 0x00000000,
        low: 0x20000000,
        description: "Update Web Parts to display personalized information.",
        type: "Web"
      },
      ManageWeb: {
        high: 0x00000000,
        low: 0x40000000,
        description: "Grant the ability to perform all administration tasks for the Web site as well as manage content. Activate, deactivate, or edit properties of Web site scoped Features through the object model or through the user interface (UI). When granted on the root Web site of a site collection, activate, deactivate, or edit properties of site collection scoped Features through the object model. To browse to the Site Collection Features page and activate or deactivate site collection scoped Features through the UI, you must be a site collection administrator.",
        type: "Web"
      },
      UseRemoteAPIs: {
        high: 0x00000020,
        low: 0x00000000,
        description: "Use SOAP, WebDAV, or Microsoft Office SharePoint Designer 2007 interfaces to access the Web site.",
        type: "Web"
      },
      ManageAlerts: {
        high: 0x00000040,
        low: 0x00000000,
        description: "Manage alerts for all users of the Web site.",
        type: "Web"
      },
      CreateAlerts: {
        high: 0x00000080,
        low: 0x00000000,
        description: "Create e-mail alerts.",
        type: "Web"
      },
      EditMyUserInfo: {
        high: 0x00000100,
        low: 0x00000000,
        description: "Allows a user to change his or her user information, such as adding a picture.",
        type: "Web"
      },
      EmptyMask: {
        high: 0x00000000,
        low: 0x00000000,
        description: "Has no permissions on the Web site. Not available through the user interface.",
        type: "Special"
      },
      EnumeratePermissions: {
        high: 0x40000000,
        low: 0x00000000,
        description: "Enumerate permissions on the Web site, list, folder, document, or list item.",
        type: "Special"
      },
      FullMask: {
        high: 0x7FFFFFFF,
        low: 0xFFFFFFFF,
        description: "Has all permissions on the Web site. Not available through the user interface.",
        type: "Special"
      }
    };

    self.getHostApiUrl = function (url) {
      var newUrl = self.appWebUrl + "/_api/SP.AppContextSite(@target)/" + url;
      if (newUrl.indexOf('?') > 0) {
        newUrl = newUrl + "&@target='" + self.hostWebUrl + "'";
      } else {
        newUrl = newUrl + "?@target='" + self.hostWebUrl + "'";
      }
      return newUrl;
    };
    self.loadSiteGroups = function (forceReload) {
      // the respomse from sharepoint contains header Cache-Control: private, max-age=0
      if (self.siteGroupsLoaded && !forceReload) return self.siteGroupsLoaded.promise;
      //var url = this.getHostApiUrl('Web/SiteGroups?$expand=Users'); tuning query
      var url = this.getHostApiUrl('Web/SiteGroups?$expand=Users&$select=Id,IsHiddenInUI,IsShareByEmailGuestUser,IsSiteAdmin,IsSiteAdmin,PrincipalType,PrincipalType');
      self.siteGroupsLoaded = $q.defer();
      $http.get(url, { headers: { "Accept": "application/json; odata=verbose" } })
         .success(function (data) {
           var tempGroups;
           tempGroups = [];
           angular.forEach(data.d.results, function (siteGroup, key) {
             var group;
             group = {
               Title: siteGroup.Title,
               Id: siteGroup.Id,
               Users: []
             };
             angular.forEach(siteGroup.Users.results, function (user, key) {
               group.Users.push(user.Id);
             });
             tempGroups.push(group);
           });
           self.siteGroups = tempGroups;
           self.siteGroupsLoaded.resolve(self.siteGroups);
         })
         .error(function (jqXHR, textStatus, errorThrown) {
           debugger;
           self.siteGroupsLoaded.reject(textStatus);
         });
      return self.siteGroupsLoaded.promise;

    };
    self.loadSiteUsers = function (forceReload) {
      if (self.siteUsersLoaded && !forceReload) return self.siteUsersLoaded.promise;

      var url = this.getHostApiUrl('Web/SiteUsers');
      self.siteUsersLoaded = $q.defer();
      $http.get(url, { headers: { "Accept": "application/json; odata=verbose" } })
          .success(function (data) {
            self.siteUsers = data.d.results;
            self.siteUsersLoaded.resolve(self.siteUsers);
          })
          .error(function (jqXHR, textStatus, errorThrown) {
            debugger;
            self.siteUsersLoaded.reject(textStatus);
          });
      return self.siteUsersLoaded.promise;
    };


    self.loadWebRoleDefinitions = function (forceReload) {
      if (self.roleDefinitionsLoaded && !forceReload) return self.roleDefinitionsLoaded.promise;

      var url = this.getHostApiUrl('Web/RoleDefinitions?$expand=BasePermissions');//tune query
      // var url = this.getHostApiUrl('Web/RoleDefinitions?$expand=BasePermissions$select=BasePermissions/High,BasePermissions/Lpw,Id');//nfg

      self.roleDefinitionsLoaded = $q.defer();
      $http.get(url, { headers: { "Accept": "application/json; odata=verbose" } })
          .success(function (data) {
            self.roleDefinitions = data.d.results; // need to conver baseperms into ints

            for (var i = 0; i < self.roleDefinitions.length; i++) {

              self.roleDefinitions[i].BasePermissions.High = parseInt(self.roleDefinitions[i].BasePermissions.High);
              self.roleDefinitions[i].BasePermissions.Low = parseInt(self.roleDefinitions[i].BasePermissions.Low);
            }
            self.roleDefinitionsLoaded.resolve(data.d.results);
          })
          .error(function (jqXHR, textStatus, errorThrown) {
            debugger;
            self.roleDefinitionsLoaded.reject(textStatus);
          });
      return self.roleDefinitionsLoaded.promise;

    };
    self.loadWebRoleAssigmentsDefinitionsMembers = function (forceReload) {
      if (self.webroleAssignmentsLoaded && !forceReload) return self.webroleAssignmentsLoaded.promise;
      //This can be the biigest one, need to really tune
      //var url = this.getHostApiUrl('Web?$expand=RoleAssignments,RoleAssignments/Member,RoleAssignments/RoleDefinitionBindings');// tuning query
      var url = this.getHostApiUrl('Web?$expand=RoleAssignments,RoleAssignments/Member,RoleAssignments/RoleDefinitionBindings');


      self.webroleAssignmentsLoaded = $q.defer();
      $http.get(url, { headers: { "Accept": "application/json; odata=verbose" } })
          .success(function (data) {
            self.webRoleAssignments = data.d.RoleAssignments;
            self.webroleAssignmentsLoaded.resolve(data.d.RoleAssignments.results);
          })
          .error(function (jqXHR, textStatus, errorThrown) {
            debugger;
            self.webroleAssignmentsLoaded.reject(textStatus);
          });
      return self.webroleAssignmentsLoaded.promise;
    };
    self.loadListRoleAssigmentsDefinitionsMembers = function (forceReload) {
      if (self.listroleAssignmentsLoaded && !forceReload) return self.listroleAssignmentsLoaded.promise;

      //var url = this.getHostApiUrl('Web/Lists?$select=Title,Description,Hidden,Id,RoleAssignments/RoleDefinitionBindings/Id,RoleAssignments/Member/Groups/Id,RoleAssignments/Member/Users/Id&$expand=RoleAssignments,RoleAssignments/RoleDefinitionBindings,RoleAssignments/Member,RoleAssignments/Member/Users,RoleAssignments/Member/Groups');
      var url = this.getHostApiUrl('Web/Lists?&$expand=RoleAssignments,RoleAssignments/RoleDefinitionBindings,RoleAssignments/Member,RoleAssignments/Member/Users,RoleAssignments/Member/Groups,RoleAssignments/Member/UserId');


      self.listroleAssignmentsLoaded = $q.defer();
      $http.get(url, { headers: { "Accept": "application/json; odata=verbose" } })
          .success(function (data) {
            var tempLists;
            tempLists = [];
            angular.forEach(data.d.results, function (listObject, key) {
              var list;
              list = {
                Title: listObject.Title,
                Id: listObject.Id,
                Hidden: listObject.Hidden,
                RoleAssignments: []
              };
              angular.forEach(listObject.RoleAssignments.results, (function (roleAssignmentObject, key) {
                var roleAssignment;
                roleAssignment = {
                  RoleDefinitions: [],
                  Users: [],
                  Groups: [],
                  UserId: {} // external user
                };
                if (roleAssignmentObject.Member.UserId) {
                  roleAssignment.UserId = roleAssignmentObject.Member.UserId;
                }
                if (roleAssignmentObject.Member.Users) {
                  angular.forEach(roleAssignmentObject.Member.Users.results, function (roleAssignmentMemberUser, key) {
                    roleAssignment.Users.push(roleAssignmentMemberUser.Id);
                  });
                }
                if (roleAssignmentObject.Member.Groups) {
                  angular.forEach(roleAssignmentObject.Member.Groups.results, function (roleAssignmentMemberGroup, key) {
                    roleAssignment.Groups.push(roleAssignmentMemberGroup.Id);
                  });
                }
                angular.forEach(roleAssignmentObject.RoleDefinitionBindings.results, function (roleDefinitionBinding, key) {
                  var roleDefinition;
                  roleDefinition = {
                    Id: roleDefinitionBinding.Id
                  };
                  roleAssignment.RoleDefinitions.push(roleDefinition);
                });
                list.RoleAssignments.push(roleAssignment);
              }));
              tempLists.push(list);
            });
            self.listSecurity = tempLists;




            self.listRoleAssignments = tempLists;
            self.listroleAssignmentsLoaded.resolve(tempLists);
          })
          .error(function (jqXHR, textStatus, errorThrown) {
            debugger;
            self.listroleAssignmentsLoaded.reject(textStatus);
          });
      return self.listroleAssignmentsLoaded.promise;



    };
    // gets all items in a file, with the parentfolder and security info. I cant figure how to filter base on parentfolder!
    //////// https://rgove3.sharepoint.com/_api/Web/Lists(guid'6157faea-d529-4350-a1b5-469e533648c9')/Items?$select=Title,Folder/ParentFolder/ServerRelativeUrl,File/ParentFolder/ServerRelativeUrl,RoleAssignments/RoleDefinitionBindings/Id,RoleAssignments/Member/Groups/Id,RoleAssignments/Member/Users/Id&$expand=Folder/ParentFolder/ServerRelativeUrl,File/ParentFolder/ServerRelativeUrl,RoleAssignments,RoleAssignments/RoleDefinitionBindings,RoleAssignments/Member,RoleAssignments/Member/Users,RoleAssignments/Member/Groups
    self.loadListItemRoleAssigmentsDefinitionsMembers = function (listId, forceReload) {
      var url = this.getHostApiUrl("Web/Lists(guid'" + listId + "')/Items?$select=Title,Folder/ParentFolder/ServerRelativeUrl,File/ParentFolder/ServerRelativeUrl,RoleAssignments/RoleDefinitionBindings/Id,RoleAssignments/Member/Groups/Id,RoleAssignments/Member/Users/Id&$expand=Folder/ParentFolder/ServerRelativeUrl,File/ParentFolder/ServerRelativeUrl,RoleAssignments,RoleAssignments/RoleDefinitionBindings,RoleAssignments/Member,RoleAssignments/Member/Users,RoleAssignments/Member/Groups");


      self.listitemroleAssignmentsLoaded = $q.defer();
      $http.get(url, { headers: { "Accept": "application/json; odata=verbose" } })
          .success(function (data) {
            var listItems = [];

            angular.forEach(data.d.results, function (listitemObject, key) {
              var listItem = {
                Title: listitemObject.Title,
                ParentFoldeServerRelativeUrl: (listitemObject.FileParentFolder) ? listitemObject.FileParentFolder.ServerRelativeUrl : listitemObject.FolderParentFolder.ServerRelativeUrl,

                RoleAssignments: []
              };
              angular.forEach(listitemObject.RoleAssignments.results, (function (roleAssignmentObject, key) {
                var roleAssignment;
                roleAssignment = {
                  RoleDefinitions: [],
                  Users: [],
                  Groups: []
                };
                if (roleAssignmentObject.Member.Users) {
                  angular.forEach(roleAssignmentObject.Member.Users.results, function (roleAssignmentMemberUser, key) {
                    roleAssignment.Users.push(roleAssignmentMemberUser.Id);
                  });
                }
                if (roleAssignmentObject.Member.Groups) {
                  angular.forEach(roleAssignmentObject.Member.Groups.results, function (roleAssignmentMemberGroup, key) {
                    roleAssignment.Groups.push(roleAssignmentMemberGroup.Id);
                  });
                }
                angular.forEach(roleAssignmentObject.RoleDefinitionBindings.results, function (roleDefinitionBinding, key) {
                  var roleDefinition;
                  roleDefinition = {
                    Id: roleDefinitionBinding.Id
                  };
                  roleAssignment.RoleDefinitions.push(roleDefinition);
                });
                listItem.RoleAssignments.push(roleAssignment);
              }));
              listItems.push(listItem);
            });
            self.listroleAssignmentsLoaded.resolve(listItems);
          })
          .error(function (jqXHR, textStatus, errorThrown) {
            debugger;
            self.listitemroleAssignmentsLoaded.reject(textStatus);
          });
      return self.listitemroleAssignmentsLoaded.promise;



    };
    self.getFolderRoleAssigmentsDefinitionsMembers = function (listId, folderServerRelativeUrl, forceReload) {
      var folderAssignmentsLoaded = $q.defer();
      return self.loadListItemRoleAssigmentsDefinitionsMembers(listId, forceReload).then(function (data) {
        //loop through each and only select the right folder.
        // need to figure how to filter on rest call
      });
      return folderAssignmentsLoaded.promise;




    };

    self.loadListNames = function (forceReload) {
      var loadListNamesDefered = $q.defer();
      self.loadListRoleAssigmentsDefinitionsMembers(forceReload).then(function (lists) {

        var listnames = _.map(lists, function (list) {
          return { Title: list.Title, Id: list.Id };
        })
        loadListNamesDefered.resolve(listnames);
      },
      function (error) {
        alert('error in loadlistnames')
        loadListNamesDefered.reject(error);
      });
      return loadListNamesDefered.promise;
    }

    //self.getRoleDefinitionById = function (roleDefinitionId) {
    //    var gotRoleDef = $q.defer();
    //    self.loadWebRoleDefinitions().then(function (roleDefs) {
    //        angular.forEach(roleDefs, function (roleDef) {
    //            if (roleDef.Id = roleDefinitionId) {
    //                gotRoleDef.resolve(roleDef);
    //            }
    //        });
    //        $log.error("A role Definition with ID " + roleDefinitionId + " Was not foundin the Web");
    //        gotRoleDef.reject();


    //    });
    //    return gotRoleDef.promise;
    //};
    self.getBasePermissionsForRoleDefinitiuonIdsPromise = function (roleDefinitionIds) {
      var BasePermissionsForRoleDefinitiuonIdsDeferred = $q.defer();
      var basePermissions = [];
      self.loadWebRoleDefinitions().then(function (roleDefs) {
        angular.forEach(roleDefs, function (roleDef) {

          angular.forEach(roleDefinitionIds, function (roleDefinitionId) {
            if (roleDef.Id = roleDefinitionId) {
              basePermissions.push(roleDef.BasePermissions)

            }
          });
        });
        BasePermissionsForRoleDefinitiuonIdsDeferred.resolve(basePermissions);
      }, function (error) {

        BasePermissionsForRoleDefinitiuonIdsDeferred.reject(error);
      });

      return BasePermissionsForRoleDefinitiuonIdsDeferred.promise;


    };

    self.getUserIsInRole = function (user, roleAssignment) {
      var userInRoleDeferred = $q.defer();
      angular.forEach(roleAssignment.Users, function (assignedUserId) {
        if (assignedUserId === user.Id) {
          userInRoleDeferred.resolve(true);
        }
      })
      //TODO: checj for group membership
      //angular.forEach(roleAssignment.Groups, function (assignedUserId) {

      //    if (assignedUserId === user.Id) {
      //        return true;
      //    }
      //})

      userInRoleDeferred.resolve(false);
      return userInRoleDeferred.promise;
    };
    self.GetRoleAssignmentsForUserPromise = function (securableObject, user) {
      var getRoleAssignmentsDeferred = $q.defer();

      self.loadSiteGroups().then(
          function (groups) {
            var selectedRoleAssignments = [];
            angular.forEach(securableObject.RoleAssignments, function (roleAssignment) {
              angular.forEach(roleAssignment.Users, function (assignedUserId) {
                if (assignedUserId === user.Id) {
                  selectedRoleAssignments.push(roleAssignment)
                }
              });
              angular.forEach(groups, function (group) {
                // if the user is in the group add the assignment
                angular.forEach(group.Users, function (groupUser) {
                  if (groupUser.Id === user.Id) {
                    selectedRoleAssignments.push(roleAssignment)
                  }
                });
              });
              getRoleAssignmentsDeferred.resolve(selectedRoleAssignments);
            });


          }, function (error) {
            getRoleAssignmentsDeferred.reject();
          });

      //TODO: checj for group membership
      //angular.forEach(roleAssignment.Groups, function (assignedUserId) {

      //    if (assignedUserId === user.Id) {
      //        return true;
      //    }
      //})

      return getRoleAssignmentsDeferred.promise;

    };


    /// <summary>Gets the BasePermissions that a given user has on a given SecurableObject</summary>
    /// <param name="securableObject" type="Number">The theSPSecurableObject</param>
    /// <param name="user" type="Number">The SPUser</param>
    /// <returns type="Number">The area.</returns>

    self.getUserPermissionsPromise = function (securableObject, user) {
      var userPermissionsDeferred = $q.defer();
      var roleDefinitionIds = [];// the roleDefinition ID's for all the Assignemnts the user is in

      self.GetRoleAssignmentsForUserPromise(securableObject, user).then(function (roleAssignments) {
        angular.forEach(roleAssignments, function (roleAssignment) {
          angular.forEach(roleAssignment.RoleDefinitions, function (roleDefinitionStub) {
            roleDefinitionIds.push(roleDefinitionStub.Id);
          });
        });
        self.getBasePermissionsForRoleDefinitiuonIds(roleDefinitionIds).then(
            function (basePermissions) {
              userPermissionsDeferred.resolve(basePermissions);
            },
            function (error) {
              userPermissionsDeferred.reject(error);
            });


      });
      return userPermissionsDeferred.promise;

    };
    /// <summary>Gets the BasePermissions that a given user has on a given SecurableObject</summary>
    /// <param name="securableObject" type="Number">The theSPSecurableObject</param>
    /// <param name="user" type="Number">The SPUser</param>
    /// <returns type="Number">The area.</returns>

    self.doesUserHavePermissionPromise = function (securableObject, user, requestedpermission) {
      var doesUserHavePermissionDefer = $q.defer();
      self.getUserPermissionsPromise(securableObject, user).then(function (permissions) {
        angular.forEach(permissions, function (permission) {
          if (
              (permission.Low & requestedpermission.Low === requestedpermission.Low)
              &&
              (permission.High & requestedpermission.High === requestedpermission.High)
              ) {
            doesUserHavePermissionDefer.resolve(true);
          }
          else {
            doesUserHavePermissionDefer.resolve(false);
          }

        });



      }, function (error) {
        doesUserHavePermissionDefer.reject(error);
      });
      return doesUserHavePermissionDefer.promise;
    };
    self.getMembersWithPermission = function (permissionLevel) {
      for (var list in this.listSecurity) {
        for (var user in this.siteUsers) {
          var hasit = this.doesUserHavePermission(list, user, permissionLevel);
        }
      }
    };
    self.getRoleDefinitionsWithPermission = function (permissionLevel) {
      var permission = _.find(this.basePermissions, {
        name: permissionLevel
      });
      var roledefs = [];
      _.each(this.roleDefinitions, function (roledef) {
        debugger;

        if (roledef.BasePermissions.High && permission.high & roledef.BasePermissions.Low && permission.low) {
          roledefs.push(roledef);
        }
      });
    };

    // non-deferred versions

    self.GetRoleAssignmentsForUser = function (securableObject, user, groups) {


      var selectedRoleAssignments = [];
      angular.forEach(securableObject.RoleAssignments, function (roleAssignment) {
        angular.forEach(roleAssignment.Users, function (assignedUserId) {
          if (assignedUserId === user.Id) {
            selectedRoleAssignments.push(roleAssignment)
          }
        });
        angular.forEach(groups, function (group) {
          // if the user is in the group add the assignment
          angular.forEach(group.Users, function (groupUser) {
            if (groupUser.Id === user.Id) {
              selectedRoleAssignments.push(roleAssignment)
            }
          });
        });
        if (roleAssignment.UserId
          && user.UserId
          && roleAssignment.UserId.NameId
          && roleAssignment.UserId.NameIdIssuer
          && roleAssignment.UserId.NameId == user.UserId.NameId
          && roleAssignment.UserId.NameIdIssuer == user.UserId.NameIdIssuer) {
          selectedRoleAssignments.push(roleAssignment)
        }


      });

      return selectedRoleAssignments;

    };
    /// <summary>gets the permissions a use rhas on the securable object</summary>
    /// <param name="securableObject" type="Number">The theSPSecurableObject to check permissions for</param>
    /// <param name="user" type="SPUser">The SPUser to check permissons for </param>
    /// <param name="roles" type="Number">the  list of roles defined in the site </param>
    /// <param name="siteGroups" type="Number">the  list of siteGroups defined in the site </param>
    /// <returns type="Boolean">TIndicates if the user has the permission level.</returns>
    self.getUserPermissions = function (securableObject, user, roles, siteGroups) {

      var roleAssignments = self.GetRoleAssignmentsForUser(securableObject, user, siteGroups);
      var roleDefinitionIds = [];
      for (var rax = 0 ; rax < roleAssignments.length; rax++) {
        for (var rdx = 0 ; rdx < roleAssignments[rax].RoleDefinitions.length; rdx++) {
          roleDefinitionIds.push(roleAssignments[rax].RoleDefinitions[rdx].Id);
        }
      }
      //angular.forEach(roleAssignments, function (roleAssignment) {
      //  angular.forEach(roleAssignment.RoleDefinitions, function (roleDefinitionStub) {
      //    roleDefinitionIds.push(roleDefinitionStub.Id);
      //  });
      //});
      return self.getBasePermissionsForRoleDefinitiuonIds(roleDefinitionIds, roles);
    };
    /// <summary>Determmines if a user has the requested oermission on the slected securitableobject </summary>
    /// <param name="securableObject" type="Number">The theSPSecurableObject to check permissions for</param>
    /// <param name="user" type="SPUser">The SPUser to check permissons for </param>
    /// <param name="requestedpermission" type="requestedpermission">The BasPermission to check for </param>
    /// <param name="roles" type="Number">the  list of roles defined in the site </param>
    /// <param name="siteGroups" type="Number">the  list of siteGroups defined in the site </param>
    /// <returns type="Boolean">TIndicates if the user has the permission level.</returns>

    self.doesUserHavePermission = function (securableObject, user, requestedpermission, roles, siteGroups) {

      var permissions = self.getUserPermissions(securableObject, user, roles, siteGroups);
      for (var i = 0; i < permissions.length; i++) {
        // F'in javascript
        //(permissions[i].Low & requestedpermission.low === requestedpermission.low) returns a 1, not true!
        if (
            ((permissions[i].Low & requestedpermission.low) === (requestedpermission.low))
            &&
            ((permissions[i].High & requestedpermission.high) === (requestedpermission.high))
            ) {
          return true;
        }
      }

      return false;
    };


    /// <summary>Gets all the base permissions that are included in a set of RoleDefinitions </summary>
    /// <param name="roleDefs" type="RoleDef">The List of RoleDefinitions to Extract Base permissions from. (i.e all roledefs from the site </param)
    /// <param name="roleDefinitionIds" type="List O Inte">The List of RoleDefinitionids  to Extract Base permissions for </param)
    /// <returns type="Number">an array of BasePermisions</returns>

    self.getBasePermissionsForRoleDefinitiuonIds = function (roleDefinitionIds, roleDefs) {
      var basePermissions = [];
      for (var rdx = 0 ; rdx < roleDefs.length; rdx++) {
        for (var rdi = 0; rdi < roleDefinitionIds.length; rdi++) {
          if (roleDefs[rdx].Id == roleDefinitionIds[rdi]) {
            basePermissions.push(roleDefs[rdx].BasePermissions)

          }
        }
      }
      //angular.forEach(roleDefs, function (roleDef) {

      //  angular.forEach(roleDefinitionIds, function (roleDefinitionId) {
      //    if (roleDef.Id = roleDefinitionId) {
      //      basePermissions.push(roleDef.BasePermissions)

      //    }
      //  });
      //});
      return basePermissions;


    };
  }

})();

