# Sonar Web Frontend Reporter support for Visual Studio Code

Sonar Web Frontend Reporter support for Visual Studio Code that provides on-the-fly feedback to developers on new bugs and quality issues injected into their code.(CSS,TYPESCRIPT,HTML,JAVASCRIPT,SASS,ANGULARJS).Not publish Officially in Vscode Extension.

## Important
1. https://github.com/venaktesan/sonarfrontendreporter  Source download from this git url.

2. After paste the download plugin inside this location 
   -> Windows %USERPROFILE%\.vscode\extensions
   -> Mac ~/.vscode/extensions
   -> Linux ~/.vscode/extensions

3. Open cmd prompt go to this location 
   Windows ->C:\Users\xxx\.vscode\extensions\ihorse.sonarfrontend.reporter
   Mac -> ~/.vscode/extensions/ihorse.sonarfrontend.reporter

4. Run this commands(admin) one by one npm install and npm install sonar-web-frontend-reporters -g .

5. Reopen the vscode editor.

## Extension settings
1. open configJsonTemplate.json file.
2. You must give the Projectkey(give your project profile rule folder name what in server. )
3. excludepaths : give the excluded file and folder ,Drive char must be small letter eg: c:,d: for windows.

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

9. Analyse Current File (ctrl+f1 for windows) (cmd+f1 for mac) -> this option analysis current file and show the result depends on the file type (js,css...). 

10. Clear Lint Errors (ctrl+f2 for windows) (cmd+f6 for mac) -> this option clear the error in problem tab.







