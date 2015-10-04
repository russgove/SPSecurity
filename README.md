# SPSecurity
Angular-Base Security Reporting for SharePoint 2013 and SharePoint Online.

SharePoint 2013 has the 'Share' option which lets users break inheritance easily, which MAY cause issues. This solution was created to show Who has access to what on a site. It is working properly (as far as I know) for Lists/Libraries, but I hae not gotten down to the folder level yet(It uses the old angular UI-Grid for display, that did not really support nested grids).


The  Project is a SharePoint-Hosted App that prodcuces a Security Report showing which users have access to each list in a site. ![application page](https://github.com/russgove/SPSecurity/blob/master/AngularSecurityApp/Images/SPSec.PNG)

The App incluedes one Angular Service(spSecurityService) that is responsible for retrieving all SharePoint security information from the HostWeb using the REST API. The App requires FullControl over the HostWeb because without that level of trust it cannot access the HostWebs security information(Hopefully this will chnage in the future!)

This app does not yet work wit Active Directory groupss!!!

