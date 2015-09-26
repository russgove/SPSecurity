
(function () {
    angular.module("secApp").controller("listsecurityController", function ($scope, siteUsers,spSecurity,lists) {

        var slantedColumnHeaderTemplate = "<div class=\"rotate\" col-index=\"renderIndex\">{{ col.displayName CUSTOM_FILTERS }} </div>";
      
        $scope.loadLists = function () {
               spSecurity.GetListSecurity($scope.showHiddenLists, $scope.selectedBasePermission, $scope.users.selected, $scope.lists.selected).then(function (listSecurity) {
                $scope.listSecurity = listSecurity;
                $scope.gridOptions.columnDefs = [
              {
                  name: 'Title',
                  field: 'Title',
                  width:"100"
              }
                ];
        
                for (var userName in listSecurity[0].users) {
                    $scope.gridOptions.columnDefs.push({
                        name: userName,
                        field: "users['" + userName + "']",
                        minWidth: 40,
                        maxWidth: 40,
                        headerCellTemplate: slantedColumnHeaderTemplate,
                       cellTemplate: "<div class='ui-grid-cell-contents'><input type='checkbox' ng-checked='{{COL_FIELD CUSTOM_FILTERS}}' /></div>",

                    });
                };
            });
        };

        $scope.gridOptions = {
            enableSorting: true,
            columnDefs: [
              {
                  name: 'Title',
                  field: 'Title'
              }
            ],
            data: 'listSecurity',
            expandableRowTemplate: '<div ui-grid="row.entity.subGridOptions" style="height:140px;"></div>',// need this
            expandableRowHeight: 150,
            headerRowHeight: 139
        };
        $scope.gridOptions.onRegisterApi = function (gridApi) {
            $scope.gridApi = gridApi;
            gridApi.expandable.on.rowExpandedStateChanged($scope, function (row) {
                if (!row.entity.subGridOprions) {
                
                    row.entity.subGridOptions = {
                             columnDefs: [ {name:"Id", field:"id"},{name:"Name", field:"name"} ],
                                data: row
                       }

                }
                debugger;
            });


        };
      
        $scope.basePermissions = spSecurity.basePermissions;
        $scope.selectedBasePermission = spSecurity.basePermissions.ViewPages;

        $scope.lists = lists;
       

        $scope.siteUsers = siteUsers;
        
        $scope.users = {};// for use in ui.select


        $scope.showHiddenLists = false;
        $scope.loadLists();
    })
})();