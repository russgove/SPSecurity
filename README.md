# SPSecurity
Angular-Base Security Reporting for SharePoint 2013 and SharePoint Online

This Project is a SharePoint-Hosted App that prodcuces a Security Report showing which users have access to each list in a site. ![application page](https://github.com/russgove/SPSecurity/blob/master/AngularSecurityApp/Images/SPSec.PNG)

The App incluees one Angular Service(spSecurityService) that is responsible for retrieving all SharePoint security information from the HostWeb using the REST API. The App requires FullControl over the HostWeb because without that level of trust it cannot access the HostWebs security information(Hopefully this will chnage in the future!)
