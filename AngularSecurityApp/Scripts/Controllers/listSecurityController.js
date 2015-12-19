
(function () {
    angular.module("secApp").controller("listsecurityController", function ($scope, $templateCache, siteUsers, spSecurity, lists, uiGridTreeViewConstants) {

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

        $templateCache.put('ui-grid/treeBaseRowHeaderButtons',
          "<div class=\"ui-grid-tree-base-row-header-buttons\" ng-class=\"{'ui-grid-tree-base-header': row.treeLevel > -1 }\" ng-click=\"treeButtonClick(row, $event)\"><i ng-class=\"{" +
            "'ui-grid-icon-emptyfolder':  row.entity.type==='Folder' && row.entity.itemCount===0, " +
             "'ui-grid-icon-folder':  row.entity.type==='Folder' && row.entity.itemCount!=0, " +
              "'ui-grid-icon-file':  row.entity.type==='Document',  " +
              "'ui-grid-icon-library':  row.entity.type==='List' && row.treeNode.state === 'collapsed' && row.entity.itemCount!=0 ,  " +
              "'ui-grid-icon-openlibrary':  row.entity.type==='List' && row.treeNode.state != 'collapsed',  " +
    "'ui-grid-icon-emptylibrary':  row.entity.type==='List' && row.entity.itemCount===0  " +

             //"'ui-grid-icon-folder':0" +
             //"'ui-grid-icon-openfolder':0" +
             //"'ui-grid-icon-openLibrary':0"  +
             //"'ui-grid-icon-library':0" +
          "}\"ng-style=\"{'padding-left': grid.options.treeIndent * row.treeLevel + 'px'}\"></i> &nbsp;</div>"
        );
       // $templateCache.put('ui-grid/treeBaseRowHeaderButtons',
       //"<div class=\"ui-grid-tree-base-row-header-buttons\" ng-class=\"{'ui-grid-tree-base-header': row.treeLevel > -1 }\" ng-click=\"treeButtonClick(row, $event)\"><i ng-class=\"{" +
       ////   "'ui-grid-icon-minus-squared': ( ( grid.options.showTreeExpandNoChildren && row.treeLevel > -1 ) || ( row.treeNode.children && row.treeNode.children.length > 0 ) ) && row.treeNode.state === 'expanded'," +
       ////   "'ui-grid-icon-plus-squared': ( ( grid.options.showTreeExpandNoChildren && row.treeLevel > -1 ) || ( row.treeNode.children && row.treeNode.children.length > 0 ) ) && (row.entity.itemCount > 0 || row.entity.type==='List' ) && row.treeNode.state === 'collapsed', " +
       //   "'ui-grid-icon-emptyfolder':  row.entity.type='Folder' && row.entity.itemCount===0, " +
       //   //"'ui-grid-icon-folder':0" +
       //   //"'ui-grid-icon-openfolder':0" +
       //   //"'ui-grid-icon-openLibrary':0"  +
       //   //"'ui-grid-icon-library':0" +
       //"}\"ng-style=\"{'padding-left': grid.options.treeIndent * row.treeLevel + 'px'}\"></i> &nbsp;</div>"
     //);
        $scope.gridOptions.onRegisterApi = function (gridApi) {
            $scope.gridApi = gridApi;
            $scope.gridApi.treeBase.on.rowExpanded($scope, function (row) {
                if (!row.entity.nodeLoaded) {
                    // get the subfolders and splice them into the array
                    if (row.entity.type === "List") {
                        listTitle = row.entity.Title;
                    }
                    else {
                        listTitle = row.entity.listTitle;
                    }

                    spSecurity.GetFolderSecurity($scope.selectedBasePermission, $scope.users.selected, listTitle, row.entity.ServerRelativeUrl).then(function (folderSecurity) {
                        var location = $scope.listSecurity.indexOf(row.entity) + 1;
                        for (var idx = 0 ; idx < folderSecurity.length; idx++) {
                            var newNode = folderSecurity[idx];
                            newNode.$$treeLevel = row.treeLevel + 1;
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