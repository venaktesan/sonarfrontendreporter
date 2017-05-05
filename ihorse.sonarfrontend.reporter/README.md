# Sonar Web Frontend Reporter support for Visual Studio Code

Sonar Web Frontend Reporter support for Visual Studio Code that provides on-the-fly feedback to developers on new bugs and quality issues injected into their code.(CSS,TYPESCRIPT,HTML,JAVASCRIPT,SASS,ANGULARJS).Not publish Officially in Vscode Extension.

## Important
1. https://github.com/venaktesan/sonarfrontendreporter  Source download from this git url.

2. After paste the download plugin inside this location ->C:\Users\xxx\.vscode\extensions\

3. Open cmd prompt go to this location ->C:\Users\xxx\.vscode\extensions\ihorse.sonarfrontend.reporter.

4. Run this commands one by one npm install and npm install sonar-web-frontend-reporters -g .


## Extension settings
* Go to this extension location -> C:\Users\xxx\.vscode\extensions\ihorse.sonarfrontend.reporter.
* Open package.json file.

* `sonarqube-inject.lintexclude`  
Only exclude files paths only,Drive letter must be small eg: c:,d: etc.  
Type: String  
Default value: `[c:\Users\XXX\Desktop\app\assert\vendor\**","c:\Users\XXX\Desktop\app\assert\vendor\**]`.

## Extension Options

This Options are seen right-click inside project folder in vscode editor. 

Every day you must once update the rules.
1. Update Sonar Web Frontend Reporter Rules from Global Server -> click this option it load the updated rules from server.

2. Analyze Project Files -> this option analysis full project.it takes more seconds depends on number of errors.

3. Show-csslint-error-reports -> this option only load the css error in vscode.

4. Show-js-es-lint-error-reports -> this option only load the javascript error in vscode.

5. Show-htmllint-error-reports -> this option only load the html error in vscode.

6. Show-sass-scsslint-error-reports -> this option only load the sass error in vscode.

7. Show-tslint-error-reports -> this option only load the typescript error in vscode.

8. Show-es-angularlint-error-reports -> this option only load the angular error in vscode.

This option are seen after open a file,then click this (...) icon right-side top corner.

9. Analyse Current File -> this option analysis current file and show the result depends on the file type (js,css...). 

10. Clear Lint Errors -> this option clear the error in problem tab.







