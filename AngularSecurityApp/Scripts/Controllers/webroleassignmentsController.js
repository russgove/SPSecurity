( function () {
    angular.module("secApp").controller("webroleassignmentsController", function ($scope, roleAssignments) {
        $scope.roleAssignments = roleAssignments;
    } )
} )();