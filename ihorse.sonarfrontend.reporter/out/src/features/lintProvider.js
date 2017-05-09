"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const iconv = require("iconv-lite");
const os = require("os");
const path = require("path");
const vscode = require("vscode");
const spawn = require("cross-spawn");
const fs = require('fs');
const request = require('request');
let configJsonFilename="configJsonTemplate.json";
let rootPath=vscode.workspace.rootPath;
const jsonFilePath = path.join(rootPath, configJsonFilename);
const node_ssh = require('node-ssh');

let validRuleCssFile=true;
let validRuleAngularFile=true;
let validRuleJsFile=true;
let validRuleHtmlFile=true;
let validRuleSassFile=true;
let validRuleTsFile=true;
let validRuleEsFile=true;
let validRuleFolderName="";
let validRuleFolderFlag=false;
let returnValue ="";


const rootReportPath= rootPath;
const pathToSreporterFileExist = path.join(__filename, "./../../../../bin/sreporter");
const pathTo_Sreporter_FileExist = path.join(rootPath+"/.sreporterrc");


const cssPath=[rootPath+"/**/*.css","!"+rootPath+"/bower_components/**","!"+rootPath+"/node_modules/**","!"+rootPath+"/report/**","!"+rootPath+"/rules/**","!"+rootPath+"/.sreporterrc"];
const eslintPath=[rootPath+"/**/*.js","!"+rootPath+"/bower_components/**","!"+rootPath+"/node_modules/**","!"+rootPath+"/report/**","!"+rootPath+"/rules/**","!"+rootPath+"/.sreporterrc"];
const eslintAngularPath=[rootPath+"/**/*.js","!"+rootPath+"/bower_components/**","!"+rootPath+"/node_modules/**","!"+rootPath+"/report/**","!"+rootPath+"/rules/**","!"+rootPath+"/.sreporterrc"];
const jshintPath=[rootPath+"/**/*.js","!"+rootPath+"/bower_components/**","!"+rootPath+"/node_modules/**","!"+rootPath+"/report/**","!"+rootPath+"/rules/**","!"+rootPath+"/.sreporterrc"];
const htmlHintPath=[rootPath+"/**/*.html","!"+rootPath+"/bower_components/**","!"+rootPath+"/node_modules/**","!"+rootPath+"/report/**","!"+rootPath+"/rules/**","!"+rootPath+"/.sreporterrc"];
const tslintPath=[rootPath+"/**/*.ts","!"+rootPath+"/bower_components/**","!"+rootPath+"/node_modules/**","!"+rootPath+"/report/**","!"+rootPath+"/rules/**","!"+rootPath+"/.sreporterrc"];
const sassPath=[rootPath+"/**/*.s+(a|c)ss","!"+rootPath+"/bower_components/**","!"+rootPath+"/node_modules/**","!"+rootPath+"/report/**","!"+rootPath+"/rules/**","!"+rootPath+"/.sreporterrc"];
const sassToScsslintPath=[rootPath+"/**/*.s+(a|c)ss","!"+rootPath+"/bower_components/**","!"+rootPath+"/node_modules/**","!"+rootPath+"/report/**","!"+rootPath+"/rules/**","!"+rootPath+"/.sreporterrc"];

let lintExcludePaths = [];
let info_Count=0;
let minor_Count=0;
let major_Count=0;
let critical_Count=0;
let blocker_Count=0;
let all_Count=0;

const statusBar_Minor=vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
const statusBar_Major=vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
const statusBar_Critical=vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
const statusBar_Blocker=vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
const statusBar_All=vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
const statusBar_Info=vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
const processBar_Info=vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);


let sonarCriticalArray = [];
let sonarMajorArray = [];
let sonarMinorArray = [];
let sonarBlockerArray = [];
let sonarAllArray = [];
let sonarInfoArray = [];
let textDocuments=[];
let lintReportsArrays=[];
let fileExtType="";

const eslintReport = require(__filename,'./../../../../reports/sonar/eslint.json');
const jsHintLintReport = require(__filename,'./../../../../../reports/sonar/jshint.json');
const eslintAngularReport = require(__filename,'./../../../../../reports/sonar/eslint-angular.json');
const cssLintReport = require(__filename,'./../../../../../reports/sonar/csslint.json');
const htmlHintLintReport = require(__filename,'./../../../../../reports/sonar/htmlhint.json');
const sassLintReport = require(__filename,'./../../../../../reports/sonar/sasslint.json');
const tsLintReport = require(__filename,'./../../../../../reports/sonar/tslint.json');
const pathTo_RulesOverWritePath = path.join(rootPath,"rules");


class LintProvider {

updateSonarLintRules(){
  returnValue=checkJsonProjectKey(jsonFilePath,configJsonFilename);
  if(returnValue){
  let sshConnectFlag=0;
  
  const ssh = new node_ssh();
  processBar_Info.text = ` $(sync) Processing...`; 
  processBar_Info.show();
  
  this.checkFolderExistOrNot(pathTo_RulesOverWritePath);

  try{
    ssh.connect({
    host: '192.168.1.55',
    username: 'johnsonp',
    password: 'Welcome321'  
    }).then(function() {
    
    if(fs.exists(pathTo_RulesOverWritePath)){
        var rmdir = function(pathTo_RulesOverWritePath) {
        console.log("haid daa..");
        var list = fs.readdirSync(pathTo_RulesOverWritePath);
        for(var i = 0; i < list.length; i++) {
            var filename = path.join(pathTo_RulesOverWritePath, list[i]);
            var stat = fs.statSync(filename);

            if(filename == "." || filename == "..") {
                // pass these files
            } else if(stat.isDirectory()) {
                // rmdir recursively
                rmdir(filename);
            } else {
                // rm fiilename
                fs.unlinkSync(filename);
            }
        }
    fs.rmdirSync(pathTo_RulesOverWritePath);
    fs.mkdirSync(pathTo_RulesOverWritePath); 
    }
    }
    
    sshConnectFlag=1;
    // Local, Remote 
    validRuleFolderFlag=true;
    ssh.getFile(pathTo_RulesOverWritePath+'/.csslintrc', '/opt/sonar-web-frontend-reporters-master/rules/'+validRuleFolderName+'/.csslintrc').then(function(Contents) {
        console.log("The .csslintrc File's contents were successfully downloaded");
        validRuleCssFile=true;
    }, function(error) {
        validRuleCssFile=false;
        console.log("Something's wrong in .csslintrc")
        vscode.window.showErrorMessage("Something's wrong in updateSonarLintRules =>.csslintrc");
    }),
  
    ssh.getFile(pathTo_RulesOverWritePath+'/.eslintangularrc', '/opt/sonar-web-frontend-reporters-master/rules/'+validRuleFolderName+'/.eslintangularrc').then(function(Contents) {
        console.log("The .eslintangularrc File's contents were successfully downloaded");
        validRuleAngularFile=true;
    }, function(error) {
       validRuleAngularFile=false;
        console.log("Something's wrong in .eslintangularrc")
        vscode.window.showErrorMessage("Something's wrong in updateSonarLintRules =>.eslintangularrc");
    }),
  
    ssh.getFile(pathTo_RulesOverWritePath+'/.eslintrc', '/opt/sonar-web-frontend-reporters-master/rules/'+validRuleFolderName+'/.eslintrc').then(function(Contents) {
        validRuleEsFile=true;
        console.log("The .eslintrc File's contents were successfully downloaded");
    }, function(error) {
        validRuleEsFile=false;
        console.log("Something's wrong in .eslintrc")
        vscode.window.showErrorMessage("Something's wrong in updateSonarLintRules =>.eslintrc");
    }),
  
    ssh.getFile(pathTo_RulesOverWritePath+'/.htmlhintrc', '/opt/sonar-web-frontend-reporters-master/rules/'+validRuleFolderName+'/.htmlhintrc').then(function(Contents) {
        validRuleHtmlFile=true;
        console.log("The .htmlhintrc File's contents were successfully downloaded");
    }, function(error) {
        validRuleHtmlFile=false;
        console.log("Something's wrong in .htmlhintrc")
        vscode.window.showErrorMessage("Something's wrong in updateSonarLintRules =>.htmlhintrc");
    }),
  
    ssh.getFile(pathTo_RulesOverWritePath+'/.jshintrc', '/opt/sonar-web-frontend-reporters-master/rules/'+validRuleFolderName+'/.jshintrc').then(function(Contents) {
        console.log("The .jshintrc File's contents were successfully downloaded");
        validRuleJsFile=true;
    }, function(error) {
        validRuleJsFile=false;
        console.log("Something's wrong in .jshintrc")
        vscode.window.showErrorMessage("Something's wrong in updateSonarLintRules =>.jshintrc");
    }),
  
    ssh.getFile(pathTo_RulesOverWritePath+'/.sass-lint.yml', '/opt/sonar-web-frontend-reporters-master/rules/'+validRuleFolderName+'/.sass-lint.yml').then(function(Contents) {
        console.log("The .sass-lint.yml File's contents were successfully downloaded");
    validRuleSassFile=true;    
    }, function(error) {
        validRuleSassFile=false;
        console.log("Something's wrong in .sass-lint.yml")
        vscode.window.showErrorMessage("Something's wrong in updateSonarLintRules =>.sass-lint.yml");
    }),
  
    ssh.getFile(pathTo_RulesOverWritePath+'/tslint.json', '/opt/sonar-web-frontend-reporters-master/rules/'+validRuleFolderName+'/tslint.json').then(function(Contents) {
         validRuleTsFile=true;
        console.log("The tslint.json File's contents were successfully downloaded");
        processBar_Info.hide();
    }, function(error) {
        validRuleTsFile=false;
        console.log("Something's wrong in tslint.json")
        vscode.window.showErrorMessage("Something's wrong in updateSonarLintRules =>tslint.json");
        processBar_Info.hide();
    });
});
setTimeout(function(){if(sshConnectFlag === 0){ 
    processBar_Info.hide();
    vscode.window.showErrorMessage("SSH Terminal Not Yet Connected Check Username & Password & host Details..");
 }else{ 
     
     if(!validRuleCssFile && !validRuleAngularFile && !validRuleJsFile && !validRuleHtmlFile && !validRuleSassFile && !validRuleTsFile && !validRuleEsFile){
     validRuleFolderFlag=false;
    }else{vscode.window.showInformationMessage("Rules are succesfully Updated..");}}}, 2000);

}catch(error){
console.log("updateSonarLintRules :" + error)
}
}
}

clearAllRuleErrorList(){
this.resetVariable();  
}

generate_Current_File_Report(){
    console.log("generate_Current_File_Report");
    
    returnValue=checkJsonProjectKey(jsonFilePath,configJsonFilename);
    this.isValidRuleKey();
    console.log("generate_Current_File_Report" +returnValue);
    if(returnValue && validRuleFolderFlag){
    try{
		
	if (!fs.existsSync(pathToSreporterFileExist)) {
        vscode.window.showErrorMessage('SonarFrontendFilenot exists...');
        return;
	}
    let activeTextEditor=vscode.window.activeTextEditor;
    console.log(activeTextEditor);
    if( activeTextEditor.document.isUntitled ){
      vscode.window.showErrorMessage("generate_Current_File_Report:  This Untitled file is not analysis");
    }
    else {
    fileExtType="";
    var filePath = activeTextEditor.document.fileName;
    var sreporters="";
    if (vscode.workspace.rootPath){
    filePath = path.relative(vscode.workspace.rootPath, activeTextEditor.document.fileName);

    fileExtType=filePath.slice((filePath.lastIndexOf(".") - 1 >>> 0) + 2).toLowerCase();

    if(fileExtType === ""){
    vscode.window.showErrorMessage("generate_Current_File_Report: Filetype Extension is Empty...");    
        return;
    }

    if(fileExtType === 'css'){
        sreporters = { 
        "projectName" : "SonarWebReporter",
        "csslint" : { 
        "src"  : rootPath+"/"+filePath ,
        "report"  : rootReportPath+"/reports/sonar/csslint.json",
        "rulesFile"  : pathTo_RulesOverWritePath+"/.csslintrc"}
        }
    }else if(fileExtType === 'js'){
        sreporters = { 
        "projectName" : "SonarWebReporter",
        "eslint" : { 
        "src"  :  rootPath+"/"+filePath,
        "report"  : rootReportPath+"/reports/sonar/eslint.json",
        "rulesFile"  : pathTo_RulesOverWritePath+"/.eslintrc"},

        "jshint" : { 
        "src"  :  rootPath+"/"+filePath,
        "report"  : rootReportPath+"/reports/sonar/jshint.json",
        "rulesFile"  : pathTo_RulesOverWritePath+"/.jshintrc"},

        "eslintangular" : { 
        "src"  : rootPath+"/"+filePath,
        "report"  : rootReportPath+"/reports/sonar/eslint-angular.json",
        "rulesFile"  : pathTo_RulesOverWritePath+"/.eslintangularrc"}
        }
    }else if(fileExtType === 'html'){
        sreporters = { 
        "projectName" : "SonarWebReporter",
        "htmlhint" : { 
        "src"  :  rootPath+"/"+filePath,
        "report"  : rootReportPath+"/reports/sonar/htmlhint.json",
        "rulesFile"  : pathTo_RulesOverWritePath+"/.htmlhintrc"}
        }  
    }else if(fileExtType === 'ts'){
        sreporters = { 
        "projectName" : "SonarWebReporter",
        "tslint" : { 
        "src"  : rootPath+"/"+filePath,
        "report"  : rootReportPath+"/reports/sonar/tslint.json",
        "rulesFile"  : pathTo_RulesOverWritePath+"/tslint.json"}
        }
    }else if(fileExtType === 'sass' || fileExtType === 'scss'){
        sreporters = { 
        "projectName" : "SonarWebReporter",
        "sasslint" : { 
        "src"  : rootPath+"/"+filePath,
        "report"  : rootReportPath+"/reports/sonar/sasslint.json",
        "rulesFile"  : pathTo_RulesOverWritePath+"/.sass-lint.yml"}
        }
    }
    if(sreporters === ""){
     vscode.window.showErrorMessage("This File Format Not Supported in SonarFrontend plugin.");
     return;
    }
    processBar_Info.text = ` $(sync) Processing...`;
    processBar_Info.show();
    this.writeSreporterConfigFile(sreporters);
    }   
   }
    }catch(error){
    console.log('generate_Current_File_Report: ', error);
    vscode.window.showErrorMessage("generate_Current_File_Report: "+ error);
    }
    }
}

writeSreporterConfigFile(sreportersTemplate){

var json = JSON.stringify(sreportersTemplate);
console.log("pathTo_Sreporter_FileExist");
fs.writeFile(pathTo_Sreporter_FileExist, json,function (err) {
	if (err) {
	return console.log("Error writing file: " + err);
	}
console.log("file saved");
//vscode.window.showInformationMessage("Successfully .sreporters file was created.");
return true;
});
this.createReportFolder()   
}

createReportFolder(){
    const reportFolderPath = path.join(rootReportPath, "reports");
    const report_SonarFolderPath = path.join(rootReportPath+"//reports", "sonar");
    try {
        this.checkFolderExistOrNot(reportFolderPath);
        this.checkFolderExistOrNot(report_SonarFolderPath); 
        this.generateJsonReport();      
    }
    catch (error) {
    console.log('createReportFolder: ', error);
    vscode.window.showErrorMessage("createReportFolder: "+ error);
    }
}

checkFolderExistOrNot(folderPath){
fs.stat(folderPath, function(err, stat) {
            if(err == null) {
                console.log('File exists');
                //vscode.window.showInformationMessage("checkFolderExistOrNot: Folder Alread Exists.. ");
            } else if(err.code == 'ENOENT') {
               fs.mkdir(folderPath); 
               console.log("checkFolderExistOrNot: Folder is Created..");
               //vscode.window.showInformationMessage("checkFolderExistOrNot: Folder is Created.. ");
            } else {
                 console.log('Some other error: ', err.code);
                 vscode.window.showErrorMessage("checkFolderExistOrNot: Unkown Error ErrCode: "+ err.code);
                return
            }
});
}


lintReportIterater(lintReportsList){
const vscodeDiagnosticArray = [];
lintReportsList.forEach((lintReport)=>{
this.generateLintReport(lintReport,vscodeDiagnosticArray);
});
if(vscodeDiagnosticArray.length === 0){
vscode.window.showInformationMessage("No Error in Current File Or Full Project.. ");
processBar_Info.hide();
return;
}
this.diagnosticCollection.set(vscodeDiagnosticArray);

}

generateLintReport(lintReport,vscodeDiagnosticFullArray) {
for(var ii = 0; ii<lintReport.files.length; ii++) {
let filePath=lintReport.files[ii].path;
let issuesList=lintReport.files[ii].issues;
for(var jj = 0; jj<issuesList.length; jj++) { 
let postition=issuesList[jj].line;
let severityValue=issuesList[jj].severity.toUpperCase();
updateStatusCount(severityValue);
const range =new vscode.Range(new vscode.Position(+postition -1, postition), new vscode.Position(+postition -1, 1));
const vscodeDiagnostic = new vscode.Diagnostic(range, issuesList[jj].message, this.diagnosticSeverityMap.get(severityValue));
vscodeDiagnostic.source = severityValue+","+issuesList[jj].reporter;
const fileUri = vscode.Uri.file(filePath);
vscodeDiagnosticFullArray.push([fileUri, [vscodeDiagnostic]]);
sonarAllArray.push([fileUri, [vscodeDiagnostic]]);
pushReportCategorywise(severityValue,fileUri,vscodeDiagnostic);

}
}
processBar_Info.hide();
}
 
isValidRuleKey(){
if(!validRuleFolderFlag){
       vscode.window.showErrorMessage("Your Rule Folder Id is Not Valid or Not Given Id Configjsontemplate.json.. Update Server Rule");
       return;
    }

}

generate_CssLint_Report(){
this.isValidRuleKey();
if(returnValue && validRuleFolderFlag){
 try{
 this.resetVariable();
 processBar_Info.text = ` $(sync) Processing...`;
 processBar_Info.show();
 const cssLintReport = JSON.parse(fs.readFileSync(rootReportPath+"/reports/sonar/csslint.json", 'utf8'));  
 textDocuments=null;
 lintReportsArrays.push(cssLintReport);
 this.lintReportIterater(lintReportsArrays);
 }catch(error){
 vscode.window.showErrorMessage("generate_CssLint_Report: "+String(error));
 processBar_Info.hide();
 } 
 }
 }
generateJs_ESLint_Report(){
this.isValidRuleKey();
if(returnValue && validRuleFolderFlag){
try{
this.resetVariable();
processBar_Info.text = ` $(sync) Processing...`;
processBar_Info.show();
const eslintLintReport = JSON.parse(fs.readFileSync(rootReportPath+"/reports/sonar/eslint.json", 'utf8'));
const jsHintLintReport = JSON.parse(fs.readFileSync(rootReportPath+"/reports/sonar/jshint.json", 'utf8'));

textDocuments=null;
lintReportsArrays.push(eslintLintReport);
lintReportsArrays.push(jsHintLintReport);
this.lintReportIterater(lintReportsArrays);

}catch(error){
vscode.window.showErrorMessage("generateJs_AngularLint_Report: "+String(error)); 
processBar_Info.hide();
}
}
}
generate_EsAngularlint_Report(){
 this.isValidRuleKey();
 if(returnValue && validRuleFolderFlag){
 try{
 this.resetVariable();
 processBar_Info.text = ` $(sync) Processing...`;
 processBar_Info.show();
 const esAngularLintReport = JSON.parse(fs.readFileSync(rootReportPath+"/reports/sonar/eslint-angular.json", 'utf8'));  
 textDocuments=null;
 lintReportsArrays.push(esAngularLintReport);
 this.lintReportIterater(lintReportsArrays);
 console.log("generate_EsAngularlint_Report");
 }catch(error){
 vscode.window.showErrorMessage("generate_EsAngularlint_Report: "+String(error)); 
 processBar_Info.hide();
 } 
 }
}

generate_HtmlLint_Report(){
 this.isValidRuleKey();
 if(returnValue && validRuleFolderFlag){
 try{
 this.resetVariable();
 processBar_Info.text = ` $(sync) Processing...`;
 processBar_Info.show();
 const htmlLintReport = JSON.parse(fs.readFileSync(rootReportPath+"/reports/sonar/htmlhint.json", 'utf8'));  
 textDocuments=null;
 lintReportsArrays.push(htmlLintReport);
 this.lintReportIterater(lintReportsArrays);
 console.log("generate_HtmlLint_Report");
 }catch(error){
 vscode.window.showErrorMessage("generate_HtmlLint_Report: "+String(error));
 processBar_Info.hide();
 } 
 }
 }

generate_Sass_ScssLint_Report(){
 this.isValidRuleKey();
 if(returnValue && validRuleFolderFlag){
 try{
 this.resetVariable(); 
 processBar_Info.text = ` $(sync) Processing...`;
 processBar_Info.show();
 const sass_ScssLintReport = JSON.parse(fs.readFileSync(rootReportPath+"/reports/sonar/sasslint.json", 'utf8'));  
 textDocuments=null;
 lintReportsArrays.push(sass_ScssLintReport);
 this.lintReportIterater(lintReportsArrays);
 console.log("generate_Sass_ScssLint_Report");

 }catch(error){
 vscode.window.showErrorMessage("generate_Sass_ScssLint_Report: "+String(error));
 processBar_Info.hide();
 } 
 }
 }

generate_Tslint_Report(){
 this.isValidRuleKey();
 if(returnValue && validRuleFolderFlag){
 try{
 this.resetVariable(); 
 processBar_Info.text = ` $(sync) Processing...`;
 processBar_Info.show();
 const tsLintReport = JSON.parse(fs.readFileSync(rootReportPath+"/reports/sonar/tslint.json", 'utf8'));  
 textDocuments=null;
 lintReportsArrays.push(tsLintReport);
 this.lintReportIterater(lintReportsArrays);
 }catch(error){
 vscode.window.showErrorMessage("generate_Tslint_Report: "+String(error));
 processBar_Info.hide();
 } 
 }
 }


generateJsonReport() {
var exec = require('child_process').exec;
var child;

child = exec("sreporter -c "+pathTo_Sreporter_FileExist, function (error, stdout, stderr) {
  console.log("stdout" +stdout.toString());
  console.log("stderr" +stderr.toString());
  if (error !== null) {
    console.log('exec error: ' + error);
  }
});
}

triggerFunctionCall(extType){
switch (extType) {
    case 'css':
        this.generate_CssLint_Report();
        break;
    case 'js':
        this.generateJs_ESLint_Report();
        break;
    case 'html':
        this.generate_HtmlLint_Report();
        break;
    case 'ts':
        this.generate_Tslint_Report();
        break;
    case 'sass': case 'scss':
        this.generate_Sass_ScssLint_Report();
        break;
    default:
        this.generate_EsAngularlint_Report();
        break;
}
}
sreportersFileGenerator(){

returnValue=checkJsonProjectKey(jsonFilePath,configJsonFilename);
this.isValidRuleKey();
console.log("returnValue" +jsonFilePath);
console.log("configJsonFilename" +configJsonFilename);
if(returnValue && validRuleFolderFlag ){
try{
fileExtType="";
if (!fs.existsSync(pathToSreporterFileExist)) {
	vscode.window.showErrorMessage('SonarFrontendFilenot exists...');
	return;
}

for (var i = 0; i < lintExcludePaths.length; i++) { 
    let excludePath="!"+lintExcludePaths[i];
    cssPath.push(excludePath);
    eslintPath.push(excludePath);
    eslintAngularPath.push(excludePath);
    jshintPath.push(excludePath);
    htmlHintPath.push(excludePath);
    tslintPath.push(excludePath);
    sassPath.push(excludePath);
    sassToScsslintPath.push(excludePath);
}  

var sreporters = { 
        "projectName" : "SonarWebReporter",
        "csslint" : { 
        "src"  : cssPath,
        "report"  : rootReportPath+"/reports/sonar/csslint.json",
        "rulesFile"  : pathTo_RulesOverWritePath+"/.csslintrc"},  

        "eslint" : { 
        "src"  : eslintPath,
        "report"  : rootReportPath+"/reports/sonar/eslint.json",
        "rulesFile"  : pathTo_RulesOverWritePath+"/.eslintrc"},

        "eslintangular" : { 
        "src"  : eslintAngularPath,
        "report"  : rootReportPath+"/reports/sonar/eslint-angular.json",
        "rulesFile"  : pathTo_RulesOverWritePath+"/.eslintangularrc"},

        "jshint" : { 
        "src"  : jshintPath,
        "report"  : rootReportPath+"/reports/sonar/jshint.json",
        "rulesFile"  : pathTo_RulesOverWritePath+"/.jshintrc"},

        "htmlhint" : { 
        "src"  : htmlHintPath,
        "report"  : rootReportPath+"/reports/sonar/htmlhint.json",
        "rulesFile"  : pathTo_RulesOverWritePath+"/.htmlhintrc"},

        "tslint" : { 
        "src"  : tslintPath,
        "report"  : rootReportPath+"/reports/sonar/tslint.json",
        "rulesFile"  : pathTo_RulesOverWritePath+"/tslint.json"},

        "sasslint" : { 
        "src"  : sassPath,
        "report"  : rootReportPath+"/reports/sonar/sasslint.json",
        "rulesFile"  : pathTo_RulesOverWritePath+"/.sass-lint.yml"},

        "sass-to-scsslint" : { 
        "src"  : sassToScsslintPath,
        "report"  : rootReportPath+"/reports/sonar/sass-to-scsslint.json",
        "rulesFile"  : pathTo_RulesOverWritePath+"/.sass-lint.yml"}
    }
this.resetVariable();
processBar_Info.text = ` $(sync) Processing...`;
processBar_Info.show();
this.writeSreporterConfigFile(sreporters);
}catch(error){
console.log("SreportersFileGenerator: "+error);
vscode.window.showErrorMessage('SreportersFileGenerator...'+error);
}
}
}

activate(subscriptions) {
        
        this.diagnosticSeverityMap = new Map();
        this.diagnosticSeverityMap.set("INFO", vscode.DiagnosticSeverity.Error);
        this.diagnosticSeverityMap.set("MINOR", vscode.DiagnosticSeverity.Error);
        this.diagnosticSeverityMap.set("MAJOR", vscode.DiagnosticSeverity.Error);
        this.diagnosticSeverityMap.set("CRITICAL", vscode.DiagnosticSeverity.Error);
        this.diagnosticSeverityMap.set("BLOCKER", vscode.DiagnosticSeverity.Error);
        this.diagnosticCollection = vscode.languages.createDiagnosticCollection();
        //vscode.workspace.onDidSaveTextDocument(this._onEvent, this);
        //this.doLint();
    }

    _onEvent(textDocument) {
        this.doLint(textDocument);
    }
    dispose() {
        this.diagnosticCollection.clear();
        this.diagnosticCollection.dispose();
        statusBar_All.hide();
        statusBar_Minor.hide();
        statusBar_Major.hide();
        statusBar_Critical.hide();
        statusBar_Blocker.hide();
        statusBar_Info.hide();
        sonarCriticalArray.clear();
        sonarCriticalArray.dispose();
        sonarMajorArray.clear();
        sonarMajorArray.dispose();
        sonarMinorArray.clear();
        sonarMinorArray.dispose();
        sonarBlockerArray.clear();
        sonarBlockerArray.dispose();
        sonarAllArray.clear();
        sonarAllArray.dispose();
        sonarInfoArray.clear();
        sonarInfoArray.dispose();
        lintReportsArrays.clear();
        lintReportsArrays.dispose();
        processBar_Info.hide()
        lintExcludePaths.clear();
        lintExcludePaths.dispose();
    }
    resetVariable(){
        this.diagnosticCollection.clear();
         info_Count=0;
         minor_Count=0;
         major_Count=0;
         critical_Count=0;
         blocker_Count=0;
         all_Count=0;
         sonarCriticalArray = [];
         sonarMajorArray = [];
         sonarMinorArray = [];
         sonarBlockerArray = [];
         sonarAllArray = [];
         sonarInfoArray = [];
         lintReportsArrays=[];
         statusBar_All.hide();
         statusBar_Minor.hide();
         statusBar_Major.hide();
         statusBar_Critical.hide();
         statusBar_Blocker.hide();
         statusBar_Info.hide();
         processBar_Info.hide();
         lintExcludePaths = [];
    }
    doLint(textDocument) {
        textDocuments=textDocument;
        this.resetVariable();
        processBar_Info.text = ` $(sync) Processing...`;
        processBar_Info.show();
        
        const configuration = vscode.workspace.getConfiguration("sonarqube-inject");
        const linterEnabled = Boolean(configuration.get("enableLinter"));
        if (!linterEnabled) {
            return;
        }
        if (textDocument) {
            const filename = textDocument.uri.fsPath;
            const arrFilename = filename.split(".");
            if (arrFilename.length === 0) {
                return;
            }
        }
        else {
            this.diagnosticCollection.clear();
        }
        const consoleEncoding = this.getConsoleEncoding();
        const args = this.getSpawnArgs(textDocument);
        let result = "";
        const sonarLintCS = spawn(this.getCommandId(),args,this.getSpawnOptions()).on("error", (err) => {
            vscode.window.showErrorMessage(String(err));
        });
        sonarLintCS.stderr.on("data", (buffer) => {
            result += iconv.decode(buffer, consoleEncoding);
        });
        sonarLintCS.stdout.on("data", (buffer) => {
            result += iconv.decode(buffer, consoleEncoding);
        });
        sonarLintCS.on("close", () => {
            try {
                result = result.trim();
                let errorMessage = "";
                let errorMode = false;
                 let errorMode1 = false;
                 let errorMode2 = false;
                const lines = result.split(/\r?\n/);
                const regex = /^.*\{(.*)\}\s+\{(.*)\}\s+\{(\d+):(\d+)\s-\s(\d+):(\d+)\}\s+\{(.*)\}\s+\{(.*)\}/;
                const regex1 = /^.*\{(.*)\}\s+\{(.*)\}\s+\{(null*):(null*)\s-\s(null*):(null*)\}\s+\{(.*)\}\s+\{(.*)\}/;
                const vscodeDiagnosticArray = [];
                const diagnosticFileMap = new Map();
			
                for (const line of lines) {
					let match = line.match(regex);
                    const match1 = line.match(regex1);
                    if(match1){
                    match=match1;
                    }
                    
                    if (match) {
                        updateStatusCount(match[2]);
                        const range = match1 ?  new vscode.Range(new vscode.Position(+1 - 1, +1), new vscode.Position(+1 - 1, +1)):
                        new vscode.Range(new vscode.Position(+match[3] - 1, +match[4]), new vscode.Position(+match[5] - 1, +match[6]));
                        const vscodeDiagnostic = new vscode.Diagnostic(range, match[8], this.diagnosticSeverityMap.get(match[2]));
                        vscodeDiagnostic.source = match[2];
                        const fileUri = vscode.Uri.file(match[1]);
                        vscodeDiagnosticArray.push([fileUri, [vscodeDiagnostic]]);
                        sonarAllArray.push([fileUri, [vscodeDiagnostic]]);
                        pushReportCategorywise(match[2],fileUri,vscodeDiagnostic);
                    }
                    else if (line.match(/.*ERROR: EXECUTION FAILURE*/)) {
                        errorMode1 = true;
                    }else if (line.match(/.*ERROR: Fail to request*/)) {
                        errorMode = true;
                    }else if (line.match(/.*WARN: No files to analyze*/)) {
                        errorMode2 = true;
                    }
                    
                    if (errorMode) {
                        errorMessage += line + " " + "--->You must start sonarqube server and bind with available project in sonarqube." + "\n";
                    }else if (errorMode1) {
                        errorMessage += line + "\n";
                    }else if(errorMode2){
                        errorMessage += line + " " + "--->May Be in package.json your source folder path is Invalid." + "\n";
                    }
                }

                if (textDocument) {
                    const tempDiagnosticArray = new Array();
                    vscodeDiagnosticArray.forEach((element) => {
                        element[1].forEach((diagnostic) => {
                        tempDiagnosticArray.push(diagnostic);
                        });
                    });
                    this.diagnosticCollection.set(textDocument.uri, tempDiagnosticArray);
                }else{
                   this.diagnosticCollection.set(vscodeDiagnosticArray);
                }
               
                
                if (vscodeDiagnosticArray.length == 0) {
                     statusBar_All.hide();
                     statusBar_Blocker.hide();
                     statusBar_Critical.hide();
                     statusBar_Info.hide();
                     statusBar_Major.hide();
                     statusBar_Minor.hide();
                     processBar_Info.hide();
                }else{
                    statusBar_All.text = vscodeDiagnosticArray.length !== 0 ? `$(sync) ${vscodeDiagnosticArray.length} All` : '$(sync) 0 All'; 
                    statusBar_All.command="sonarqube-inject.allErrors";
                    statusBar_All.show();
                    processBar_Info.hide();
                }
                if (errorMessage) {
                    console.log(errorMessage);
                    vscode.window.showErrorMessage(errorMessage);
                }
                
            }
            catch (err) {
                vscode.window.showErrorMessage(String(err));
            }
        });
    }
    ;

    updateBindings() {
        try{
        processBar_Info.text = ` $(sync) Processing...`;
        processBar_Info.show();
        const args = this.getSpawnArgs();
        args.push("-u");
        const consoleEncoding = this.getConsoleEncoding();
        let result = "";
        const sonarLintCS = spawn(this.getCommandId(), args, this.getSpawnOptions()).on("error", (err) => {
            vscode.window.showErrorMessage(String(err));
        });
        sonarLintCS.stderr.on("data", (buffer) => {
            result += iconv.decode(buffer, consoleEncoding);
        });
        sonarLintCS.stdout.on("data", (buffer) => {
            result += iconv.decode(buffer, consoleEncoding);
        });
        sonarLintCS.on("close", () => {
            console.log(result);
            //vscode.window.showInformationMessage("Bindings updated successefully.");
        });
        }catch(error){
            vscode.window.showInformationMessage("Bindings updated successefully."+ error);
            processBar_Info.hide();
        }

    }
    getSpawnOptions() {
        const options = {
            cwd: vscode.workspace.rootPath,
            env: process.env,
        };
        return options;
    }
    getSpawnArgs(textDocument) {
        const configuration = vscode.workspace.getConfiguration("sonarqube-inject");
        let sourcePath = String(configuration.get("sourcePath"));
        const testsPath = String(configuration.get("testsPath"));
        const exclude = String(configuration.get("exclude"));
        const charset = String(configuration.get("sourceEncoding"));
        const args = ["--reportType", "console"];
        if (textDocument) {
            sourcePath = path.relative(vscode.workspace.rootPath, textDocument.uri.fsPath);
            sourcePath = sourcePath.replace(/\\/g, "/");
        }
        if (sourcePath) {
            args.push("--src");
            args.push(sourcePath);
        }
        if (testsPath) {
            args.push("--tests");
            args.push(testsPath);
        }
        if (exclude) {
            args.push("--exclude");
            args.push(exclude);
        }
        if (charset) {
            args.push("--charset");
            args.push(charset);
        }
        return args;
    }
    getCommandId() {
        let command = "";
        const commandConfig = vscode.workspace.getConfiguration("sonarqube-inject").get("sonarlintPath");
        if (!commandConfig || String(commandConfig).length === 0) {
            command = path.resolve(__filename, "./../../../../tools/sonarlint-cli/bin/sonarlint");
        }
        else {
            command = String(commandConfig);
        }
        return command;
    }
    ;
    getConsoleEncoding() {
        const configuration = vscode.workspace.getConfiguration("sonarqube-inject");
        let consoleEncoding;
        let consoleEncodingDefaultValue;
        if (this.isWindows) {
            consoleEncoding = String(configuration.get("windowsConsoleEncoding"));
            consoleEncodingDefaultValue = "windows-1251";
        }
        else {
            consoleEncoding = String(configuration.get("unixConsoleEncoding"));
            consoleEncodingDefaultValue = "utf8";
        }
        if (!consoleEncoding) {
            consoleEncoding = consoleEncodingDefaultValue;
        }
        return consoleEncoding;
    }
    isWindows() {
        return os.platform() === "win32";
    }

    categoryErrorReport(categoryTexts){
        try{
        let vscodeSeperateDiagnosticArray=[];
        if(categoryTexts === "MINOR"){
         vscodeSeperateDiagnosticArray=sonarMinorArray;
        }else if(categoryTexts === "MAJOR"){
         vscodeSeperateDiagnosticArray=sonarMajorArray;
        }else if(categoryTexts === "CRITICAL"){
         vscodeSeperateDiagnosticArray=sonarCriticalArray;
        }else if(categoryTexts === "BLOCKER"){
         vscodeSeperateDiagnosticArray=sonarBlockerArray;
        }else if(categoryTexts === "AllERRORS"){
         vscodeSeperateDiagnosticArray=sonarAllArray;
        }else if(categoryTexts === "INFO"){
         vscodeSeperateDiagnosticArray=sonarInfoArray;
        }
        if(vscodeSeperateDiagnosticArray.length >0){
        this.diagnosticCollection.clear();
        
        if(textDocuments){
            console.log("textDocuments "+textDocuments.uri);
        const tempSeperateDiagnosticArray = new Array();
                    vscodeSeperateDiagnosticArray.forEach((element) => {
                        element[1].forEach((diagnostic) => {
						tempSeperateDiagnosticArray.push(diagnostic);
                        });
                    });
        this.diagnosticCollection.set(textDocuments.uri, tempSeperateDiagnosticArray);
        vscode.commands.executeCommand("workbench.actions.view.problems");
        }else{
		this.diagnosticCollection.set(vscodeSeperateDiagnosticArray);
        vscode.commands.executeCommand("workbench.actions.view.problems");
        }
        }
    }catch(error){
    vscode.window.showErrorMessage("error"+error);
        }
    }
}
exports.default = LintProvider;
//# sourceMappingURL=lintProvider.js.map

function updateStatusCount(errortType){

                    switch (errortType) {
                    case 'MINOR':
                    minor_Count+=1;
                    all_Count+=1;
                    statusBar_Minor.text = minor_Count !== 0 ? `$(inbox) ${minor_Count} Minor` : '$(inbox) 0 Minor'; 
                    statusBar_Minor.command="sonarqube-inject.minorErrors";
                    statusBar_Minor.show();
                    break;

                    case 'MAJOR':
                    major_Count+=1;
                    all_Count+=1;
                    statusBar_Major.text = major_Count !== 0 ? `$(git-branch) ${major_Count} Major` : '$(git-branch) 0 Major';
                    statusBar_Major.command="sonarqube-inject.majorErrors";
                    statusBar_Major.show(); 
                    break;

                    case 'CRITICAL':
                    critical_Count+=1;
                    all_Count+=1;
                    statusBar_Critical.text = critical_Count !== 0 ? `$(link-external) ${critical_Count} Critical` : '$(link-external) 0 Critical';
                    statusBar_Critical.command="sonarqube-inject.criticalErrors";
                    statusBar_Critical.show();
                    break;

                    case 'BLOCKER':
                    blocker_Count+=1;
                    all_Count+=1;
                    statusBar_Blocker.text = blocker_Count !== 0 ? ` $(link) ${blocker_Count} Blocker` : '$(link) 0 Blocker';   
                    statusBar_Blocker.command="sonarqube-inject.blockersErrors";
                    statusBar_Blocker.show();
                    break;

                    case 'INFO':
                    info_Count+=1;
                    all_Count+=1;
                    statusBar_Info.text = info_Count !== 0 ? ` $(pin) ${info_Count} Info` : '$(pin) 0 Info';   
                    statusBar_Info.command="sonarqube-inject.infoErrors";
                    statusBar_Info.show();
                    break;

                    default:
                        break;
                }
            }
function pushReportCategorywise(categoryText,fileUri,diagnosticObject){
    if(categoryText === "MINOR"){
     sonarMinorArray.push([fileUri, [diagnosticObject]]);
    }else if(categoryText === "MAJOR"){
     sonarMajorArray.push([fileUri, [diagnosticObject]]);
    }else if(categoryText === "CRITICAL"){
     sonarCriticalArray.push([fileUri, [diagnosticObject]]);
    }else if(categoryText === "BLOCKER"){
     sonarBlockerArray.push([fileUri, [diagnosticObject]]);
    }else if(categoryText === "INFO"){
     sonarInfoArray.push([fileUri, [diagnosticObject]]);
    }
}

function checkJsonProjectKey(configJsonPath ,configFilename){
    validRuleFolderName="";
    lintExcludePaths="";
    const configJsonData = JSON.parse(fs.readFileSync(configJsonPath, 'utf8'));
    console.log("configJsonData.projectkey" +configJsonData.projectkey);
    let flagValue=0;
    if(configJsonData.projectkey.length === 0){
        vscode.window.showInformationMessage("Must Give valid Rule Folder Name " +configFilename);
        return false ;
    }else{
        validRuleFolderName=configJsonData.projectkey;
        lintExcludePaths=configJsonData.excludepaths;
        return true;
    }
}