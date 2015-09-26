
(function () {
    angular.module("testgrid",[]).controller("testgridController", function ($scope) {
        $scope.stuff = [
            {title:'title'},
           { title: 'title2' },
           { title: 'title' },
         { title: 'title' },
           { title: 'title2' },
              { title: 'title2' },
          { title: 'title' },
           { title: 'title2' },
           { title: 'title' },
         { title: 'title' },
           { title: 'title2' },
              { title: 'title2' }
        ]

        $scope.gridOptions = {
           
            data: 'stuff'

        };


    })
})();