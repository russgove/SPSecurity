<%@ Page Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" MasterPageFile="~masterurl/default.master" Language="C#" %>

<%@ Register TagPrefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<asp:Content ContentPlaceHolderID="PlaceHolderAdditionalPageHead" runat="server">


    <script type="text/javascript" src="../Scripts/lodash.js"></script>
    <script type="text/javascript" src="../Scripts/angular.js"></script>
    <script type="text/javascript" src="../Scripts/angular-sanitize.js"></script>
    <script type="text/javascript" src="../Scripts/UI-select/select.js"></script>

    <script type="text/javascript" src="../Scripts/ng-ContextMenu.js"></script>
    <script type="text/javascript" src="../Scripts/angular-ui-router.js"></script>
    <script type="text/javascript" src="../Scripts/UIGrid/ui-grid.js"></script>

    <script type="text/javascript" src="/_layouts/15/init.js"></script>
    <!-- needed for update form digest-->

    <script type="text/javascript" src="/_layouts/15/sp.runtime.js"></script>
    <script type="text/javascript" src="/_layouts/15/sp.js"></script>
    <script type="text/javascript" src="/_layouts/15/sp.requestexecutor.js"></script>
    <!-- needed for JSOM (not needed now)-->

    <!-- Add your CSS styles to the following file -->
    <link rel="Stylesheet" type="text/css" href="../Content/App.css" />
    <link rel="Stylesheet" type="text/css" href="../Scripts/UIGrid/ui-grid.css" />
    <link rel="Stylesheet" type="text/css" href="../Scripts/UI-Select/select.css" />
    <link rel="stylesheet" type="text/css" href="../Scripts/UI-Select/select2.css" />

    <!-- Add your JavaScript to the following file -->
    <script type="text/javascript" src="../Scripts/services/spSecurityService.js"></script>

    <script type="text/javascript" src="../Scripts/App.js"></script>
    <script type="text/javascript" src="../Scripts/Controllers/siteusersController.js"></script>
    <script type="text/javascript" src="../Scripts/Controllers/siteGroupsController.js"></script>
    <script type="text/javascript" src="../Scripts/Controllers/roledefinitionsController.js"></script>
    <script type="text/javascript" src="../Scripts/Controllers/listroleassignmentsController.js"></script>
    <script type="text/javascript" src="../Scripts/Controllers/webroleassignmentsController.js"></script>
    <script type="text/javascript" src="../Scripts/Controllers/listsecurityController.js"></script>
    <!-- does  .ui-grid-header-cell-wrapper height need to be height of expandablle grid section? -->

    
    <style>
        .ui-grid-icon-emptyfolder:before {
            content: url('../images/emptyFolder.gif');
        }

        .ui-grid-icon-folder:before {
            content: url('../images/folder.gif');
        }

        .ui-grid-icon-openfolder:before {
            content: url('../images/openFolder.gif');
        }

        .ui-grid-icon-openlibrary:before {
            content: url('../images/libraryOpen.gif');
        }

         .ui-grid-icon-emptylibrary:before {
            content: url('../images/libraryempty.png');
        }
        .ui-grid-icon-library:before {
            content: url('../images/libraryclosed.png');
        }
         .ui-grid-icon-file:before {
            content: url('../images/file.gif');
        }
        .position-fixed {
            position: fixed;
        }

        .myGrid {
            height: 400px;
            width: 800px;
        }

        .ui-grid-header-cell-wrapper {
            height: 400px;
            width: 800px;
        }
    </style>
</asp:Content>

<%-- The markup in the following Content element will be placed in the TitleArea of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderPageTitleInTitleArea" runat="server">
    Page Title
</asp:Content>

<%-- The markup and script in the following Content element will be placed in the <body> of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderMain" runat="server">



    <div data-ng-app="secApp">
        <a ng-href="{{appWebUrl}}">reload</a>
        <ul class="spsec-navbar">
            <li class="spsec-navbarlink"><a ui-sref="home">Home</a></li>
            <li class="spsec-navbarlink"><a ui-sref="siteusers">Site Users</a></li>
            <li class="spsec-navbarlink"><a ui-sref="sitegroups">Site Groups</a></li>
            <li class="spsec-navbarlink"><a ui-sref="roledefinitions">Role Definitions</a></li>
            <li class="spsec-navbarlink"><a ui-sref="webroleassignments">Web Role Assignments</a></li>
            <li class="spsec-navbarlink"><a ui-sref="listroleassignments">List Role Assignments</a></li>
            <li class="spsec-navbarlink"><a ui-sref="listSecurity">List Security</a></li>
        </ul>

        <div data-ui-view></div>
    </div>


</asp:Content>
