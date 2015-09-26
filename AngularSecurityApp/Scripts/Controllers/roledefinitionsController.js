( function () {
    angular.module( "secApp" ).controller( "roledefinitionsController", function ( $scope, roleDefinitions ) {
       
        $scope.roleDefinitions = roleDefinitions;

        $scope.gridOptions = {
            enableSorting: true,
            columnDefs: [
              { name: 'Id', field: 'Id' },
              { name: 'Name', field: 'Name' },
              { name: 'Description', field: 'Description' },
                { name: 'Role Type Kind', field: 'RoleTypeKind' }
            ],
            data: 'roleDefinitions'
        };
    } )
} )();