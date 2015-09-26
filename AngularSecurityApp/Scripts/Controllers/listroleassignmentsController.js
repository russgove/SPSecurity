( function () {
    angular.module( "secApp" ).controller( "listroleassignmentsController", function ( $scope, roleAssignments ) {
       
        $scope.roleAssignments = roleAssignments;
        $scope.flattenRoleAssignments = function (roleAssignments) {
            debugger;
        };
       

        $scope.gridOptions = {
            enableSorting: true,
            columnDefs: [
              { name: 'Id', field: 'Id' },
              {
                  name: 'Title', field: 'Title'
               },
              {
                  name: 'RoleAssignments', field: 'RoleAssignments',cellFilter:'RoleAssignmentsFilter'
              },
            
            ],
            data: 'roleAssignments'
        };
    } )
} )();