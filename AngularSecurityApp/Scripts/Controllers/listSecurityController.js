
(function () {
    angular.module("secApp").controller("listsecurityController", function ($scope, siteUsers, spSecurity, lists, uiGridTreeViewConstants) {

        var slantedColumnHeaderTemplate = "<div style='width:40px;' class=\"rotate\" col-index=\"renderIndex\">{{ col.displayName CUSTOM_FILTERS }} </div>";

        $scope.loadLists = function () {
            spSecurity.GetListSecurity($scope.showHiddenLists, $scope.selectedBasePermission, $scope.users.selected, $scope.lists.selected).then(function (listSecurity) {
                // libraries are at leve 0 and folder have not been loaded
                for (var idx = 0; idx < listSecurity.length; idx++) {
                    listSecurity[idx].$$treeLevel = 0;
                    listSecurity[idx].nodeLoaded = false;

                }
                $scope.listSecurity = listSecurity;

                // angular.copy(listSecurity, $scope.listSecurity);
                $scope.gridOptions.columnDefs = [
              {
                  name: 'Title',
                  field: 'Title',
                  width: 100,
                  headerCellTemplate: slantedColumnHeaderTemplate,
              }
                ];

                for (var userName in listSecurity[0].users) {
                    $scope.gridOptions.columnDefs.push({
                        name: userName,
                        field: "users['" + userName + "']",
                        width: 40,


                        headerCellTemplate: slantedColumnHeaderTemplate,
                        cellTemplate: "<div class='ui-grid-cell-contents'><input type='checkbox' ng-model='COL_FIELD' /></div>",

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
            // expandableRowTemplate: '<div ui-grid="row.entity.subGridOptions" style="height:140px;"></div>',// need this
            // expandableRowHeight: 150,
            showTreeExpandNoChildren: true,
            headerRowHeight: 139
        };
        $scope.gridOptions.onRegisterApi = function (gridApi) {
            $scope.gridApi = gridApi;
            $scope.gridApi.treeBase.on.rowExpanded($scope, function (row) {
                if (!row.entity.nodeLoaded) {
                    // get the subfolders and splic them into the array
                    spSecurity.GetFolderSecurity($scope.selectedBasePermission, $scope.users.selected, row.entity).then(
                        function (folderSecurity) {
                            var location = $scope.listSecurity.indexOf(row.entity);
                            for (var idx = 0 ; idx < folderSecurity.length; idx++) {
                                var newNode = folderSecurity[idx];
                                newNode.$$treeLevel = 1;
                                newNode.Hidden = false;
                                newNode.nodeLoaded = false;
                                $scope.listSecurity.splice(location, 0, newNode);
                            }
                            
                           
                            row.entity.nodeLoaded = true;
                        }

                   )
                }
            }


            )
        };

        $scope.basePermissions = spSecurity.basePermissions;
        $scope.selectedBasePermission = spSecurity.basePermissions.ViewPages;

        $scope.lists = lists;
        $scope.listSecurity = [];

        $scope.siteUsers = siteUsers;

        $scope.users = {};// for use in ui.select


        $scope.showHiddenLists = false;
        $scope.loadLists();
    })
})();