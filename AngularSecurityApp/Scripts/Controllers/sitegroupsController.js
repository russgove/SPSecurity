( function () {
    angular.module( "secApp" ).controller( "sitegroupsController", function ($scope,siteGroups) {
        $scope.siteGroups = siteGroups;
    } )
} )();