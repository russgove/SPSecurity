# SPSecurity
Angular-Based Security Reporting for SharePoint 2013 and SharePoint Online.

SharePoint 2013 has the 'Share' option which lets users break inheritance easily, which MAY cause issues. This solution was created to show Who has access to what on a site. It is working properly (as far as I know) for Lists/Libraries.


The  Project is a SharePoint-Hosted App that prodcuces a Security Report showing which users have access to which  lists/Libraries/Folders in a site. ![application page](https://github.com/russgove/SPSecurity/blob/master/AngularSecurityApp/Images/SPSec.PNG)

The App includes an Angular Service(spSecurityService) that is responsible for retrieving all SharePoint security information from the HostWeb using the REST API. The App requires FullControl over the HostWeb because without that level of trust it cannot access the HostWebs security information(Hopefully this will chnage in the future!)

This app does not yet work with Azure Active Directory groups (working on it). Also working on getting the App Part , so it can be shown on a page in the host web).

Comments/Feedback are appreciated!

