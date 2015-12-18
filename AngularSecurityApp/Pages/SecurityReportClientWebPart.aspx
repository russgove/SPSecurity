<%@ Page language="C#" Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<WebPartPages:AllowFraming ID="AllowFraming" runat="server" />

<html>
<head>
    <title></title>

   
    <script type="text/javascript" src="../Scripts/lodash.js"></script>
    <script type="text/javascript" src="../Scripts/angular.js"></script>
    <script type="text/javascript" src="../Scripts/angular-sanitize.js"></script>
    <script type="text/javascript" src="../Scripts/UI-select/select.js"></script>

    <script type="text/javascript" src="../Scripts/ng-ContextMenu.js"></script>
    <script type="text/javascript" src="../Scripts/angular-ui-router.js"></script>
    <script type="text/javascript" src="../Scripts/UIGrid/ui-grid.js"></script>
        <script type="text/javascript" src="/_layouts/15/init.js"></script>
  
      <script type="text/javascript" src="/_layouts/15/MicrosoftAjax.js"></script>
   
    <script type="text/javascript" src="/_layouts/15/sp.runtime.js"></script>
    <script type="text/javascript" src="/_layouts/15/sp.js"></script>

    <!-- Add your CSS styles to the following file -->
    <link rel="Stylesheet" type="text/css" href="../Content/App.css" />
    <link rel="Stylesheet" type="text/css" href="../Scripts/UIGrid/ui-grid.css" />
    <link rel="Stylesheet" type="text/css" href="../Scripts/UI-Select/select.css" />
     <link rel="stylesheet" type="text/css"  href="../Scripts/UI-Select/select2.css" />

    <!-- Add your JavaScript to the following file -->
    <script type="text/javascript" src="../Scripts/services/spSecurityService.js"></script>

    <script type="text/javascript" src="../Scripts/App.js"></script>
    <script type="text/javascript" src="../Scripts/Controllers/siteusersController.js"></script>
    <script type="text/javascript" src="../Scripts/Controllers/siteGroupsController.js"></script>
    <script type="text/javascript" src="../Scripts/Controllers/roledefinitionsController.js"></script>
    <script type="text/javascript" src="../Scripts/Controllers/listroleassignmentsController.js"></script>
    <script type="text/javascript" src="../Scripts/Controllers/webroleassignmentsController.js"></script>
    <script type="text/javascript" src="../Scripts/Controllers/listsecurityController.js"></script>
    <style>
        .position-fixed {
  position: fixed;
}


    </style>

    <script type="text/javascript">
        // Set the style of the client web part page to be consistent with the host web.
        (function () {
            'use strict';

            var hostUrl = '';
            if (document.URL.indexOf('?') != -1) {
                var params = document.URL.split('?')[1].split('&');
                for (var i = 0; i < params.length; i++) {
                    var p = decodeURIComponent(params[i]);
                    if (/^SPHostUrl=/i.test(p)) {
                        hostUrl = p.split('=')[1];
                        document.write('<link rel="stylesheet" href="' + hostUrl + '/_layouts/15/defaultcss.ashx" />');
                        break;
                    }
                }
            }
            if (hostUrl == '') {
                document.write('<link rel="stylesheet" href="/_layouts/15/1033/styles/themable/corev15.css" />');
            }
        })();
    </script>
</head>
<body>
    
    <div data-ng-app="secApp">
        <a ng-href="{{appWebUrl}}">reload</a>
        <ul class="nav navbar-nav">
            <li><a ui-sref="home">Home</a></li>
            <li><a ui-sref="siteusers">Site Users</a></li>
            <li><a ui-sref="sitegroups">Site Groups</a></li>
            <li><a ui-sref="roledefinitions">Role Definitions</a></li>
            <li><a ui-sref="webroleassignments">Web Role Assignments</a></li>
            <li><a ui-sref="listroleassignments">List Role Assignments</a></li>
            <li><a ui-sref="listSecurity">List Security</a></li>
        </ul>

        <div data-ui-view></div>
    </div>

</body>
</html>
