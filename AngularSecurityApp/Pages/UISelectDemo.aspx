﻿<%-- The following 4 lines are ASP.NET directives needed when using SharePoint components --%>

<%@ Page Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" MasterPageFile="~masterurl/default.master" Language="C#" %>

<%@ Register TagPrefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<%-- The markup and script in the following Content element will be placed in the <head> of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderAdditionalPageHead" runat="server">


    <script type="text/javascript" src="../Scripts/lodash.js"></script>
    <script type="text/javascript" src="../Scripts/angular.js"></script>
    <script type="text/javascript" src="../Scripts/angular-sanitize.js"></script>
    <script type="text/javascript" src="../Scripts/UI-select/select.js"></script>

    <script type="text/javascript" src="../Scripts/angular-ui-router.js"></script>
    <script type="text/javascript" src="../Scripts/UIGrid/ui-grid.js"></script>

    <script type="text/javascript" src="/_layouts/15/sp.runtime.js"></script>
    <script type="text/javascript" src="/_layouts/15/sp.js"></script>

    <!-- Add your CSS styles to the following file -->
    <link rel="Stylesheet" type="text/css" href="../Content/App.css" />
    <link rel="Stylesheet" type="text/css" href="../Scripts/UIGrid/ui-grid.css" />
    <link rel="Stylesheet" type="text/css" href="../Scripts/UI-Select/select.css" />

    <!-- Add your JavaScript to the following file -->
    <script type="text/javascript" src="../Scripts/services/spSecurityService.js"></script>

    <script type="text/javascript" src="../Scripts/App.js"></script>
    <script type="text/javascript" src="../Scripts/Controllers/siteusersController.js"></script>
    <script type="text/javascript" src="../Scripts/Controllers/siteGroupsController.js"></script>
    <script type="text/javascript" src="../Scripts/Controllers/roledefinitionsController.js"></script>
    <script type="text/javascript" src="../Scripts/Controllers/listroleassignmentsController.js"></script>
    <script type="text/javascript" src="../Scripts/Controllers/webroleassignmentsController.js"></script>
    <script type="text/javascript" src="../Scripts/Controllers/listsecurityController.js"></script>

</asp:Content>

<%-- The markup in the following Content element will be placed in the TitleArea of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderPageTitleInTitleArea" runat="server">
    Page Title
</asp:Content>

<%-- The markup and script in the following Content element will be placed in the <body> of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderMain" runat="server">



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


</asp:Content>
