(function () {
    angular.module("secApp").controller("siteusersController", function ($scope, siteUsers) {
        $scope.siteUsers = siteUsers;
       
        //$scope.gridOptions = {
        //    enableSorting: true,
        //    columnDefs: [
        //      { name: 'Title', field: 'Title' },
        //      { name: 'Type', field: 'PrincipalType' },
        //      { name: 'Login', field: 'LoginName' },
        //    ],
        //    data: 'siteUsers'
        //};

    })
})();