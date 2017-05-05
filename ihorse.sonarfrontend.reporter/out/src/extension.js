"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// The module "vscode" contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const fs = require("async-file");
const extract = require("extract-zip");
const os = require("os");
const path = require("path");
const request = require("request");
const vscode = require("vscode");
const lintProvider_1 = require("./features/lintProvider");
const globalTemplate_1 = require("./templates/globalTemplate");
const sonarlintTemplate_1 = require("./templates/sonarlintTemplate");
const pathToExtract = path.join(__filename, "./../../../tools");
const pathToDownload = path.join(pathToExtract, "sonarlint-cli.zip");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    return __awaiter(this, void 0, void 0, function* () {
        const sonarLintExists = yield fs.exists(pathToDownload);
        if (!sonarLintExists) {
            //vscode.window.showInformationMessage("SonarLint utility wasn't found. Installation is started.");
           // install(context);
            //return;
        }
        addSubscriptions(context);
    });
}
exports.activate = activate;
function install(context) {
    const sonarlintCLILocation = "https://github.com/nixel2007/sonarlint-cli/releases/download/console-report-1.1/sonarlint-cli.zip";
    const options = {
        url: sonarlintCLILocation,
    };
    const configuration = vscode.workspace.getConfiguration();
    const proxy = configuration.get("http.proxy") || configuration.get("https.proxy");
    if (proxy) {
        options.proxy = proxy;
    }
    const proxyStrictSSL = configuration.get("http.proxyStrictSSL");
    if (typeof proxyStrictSSL !== "undefined") {
        options.strictSSL = Boolean(proxyStrictSSL);
    }
    return request(options)
        .pipe(fs.createWriteStream(pathToDownload))
        .on("finish", () => {
        extract(pathToDownload, { dir: pathToExtract }, (err) => __awaiter(this, void 0, void 0, function* () {
            if (err) {
                console.log(err);
                vscode.window.showErrorMessage(err.message);
                return;
            }
            yield fs.chmod(path.join(pathToExtract, "sonarlint-cli", "bin", "sonarlint"), "755");
            vscode.window.showInformationMessage("SonarLint was installed.");
            addSubscriptions(context);
        }));
    })
        .on("error", (err) => {
        console.error(err);
        vscode.window.showErrorMessage(err);
    });
}
function addSubscriptions(context) {
    const linter = new lintProvider_1.default();
    linter.activate(context.subscriptions);

    context.subscriptions.push(vscode.commands.registerCommand("sonarqube-inject.updateBindings", () => {
        linter.updateSonarLintRules();
    }));
    context.subscriptions.push(vscode.commands.registerCommand("sonarqube-inject.minorErrors", () => {
        linter.categoryErrorReport("MINOR");
    }));

    context.subscriptions.push(vscode.commands.registerCommand("sonarqube-inject.majorErrors", () => {
        linter.categoryErrorReport("MAJOR");
    }));

    context.subscriptions.push(vscode.commands.registerCommand("sonarqube-inject.criticalErrors", () => {
        linter.categoryErrorReport("CRITICAL");
    }));

    context.subscriptions.push(vscode.commands.registerCommand("sonarqube-inject.blockersErrors", () => {
        linter.categoryErrorReport("BLOCKER");
    }));

    context.subscriptions.push(vscode.commands.registerCommand("sonarqube-inject.allErrors", () => {
        linter.categoryErrorReport("AllERRORS");
    }));  

    context.subscriptions.push(vscode.commands.registerCommand("sonarqube-inject.infoErrors", () => {
        linter.categoryErrorReport("INFO");
    })); 

    context.subscriptions.push(vscode.commands.registerCommand("sonarqube-inject.sreportersfilegenerator", () => {
        linter.sreportersFileGenerator();
    }));

    context.subscriptions.push(vscode.commands.registerCommand("sonarqube-inject.generate-csslint-report", () => {
        linter.generate_CssLint_Report();
    }));

    context.subscriptions.push(vscode.commands.registerCommand("sonarqube-inject.generate-js-eslint-report", () => {
        linter.generateJs_ESLint_Report();
    }));

    context.subscriptions.push(vscode.commands.registerCommand("sonarqube-inject.generate-htmllint-report", () => {
        linter.generate_HtmlLint_Report();
    }));

    context.subscriptions.push(vscode.commands.registerCommand("sonarqube-inject.generate-sass-scsslint-report", () => {
        linter.generate_Sass_ScssLint_Report();
    }));

    context.subscriptions.push(vscode.commands.registerCommand("sonarqube-inject.generate-tslint-report", () => {
        linter.generate_Tslint_Report();
    }));

    context.subscriptions.push(vscode.commands.registerCommand("sonarqube-inject.generate-esangular-lint-report", () => {
        linter.generate_EsAngularlint_Report();
    }));
    
    context.subscriptions.push(vscode.commands.registerCommand("sonarqube-inject.generate-single-file-report", () => {
        linter.generate_Current_File_Report();
    }));

    context.subscriptions.push(vscode.commands.registerCommand("sonarqube-inject.clear-all-rule-errors", () => {
        linter.clearAllRuleErrorList();
    }));      
}
function createGlobalJson() {
    return __awaiter(this, void 0, void 0, function* () {
        const rootPath = path.join(os.homedir(), ".sonarlint");
        if (!rootPath) {
            vscode.window.showInformationMessage("SonarLint binary is not installed.");
            return;
        }
        const confPath = path.join(rootPath, "conf");
        try {
            yield fs.stat(confPath);
        }
        catch (error) {
            try {
                yield fs.mkdir(confPath);
            }
            catch (error) {
                vscode.window.showErrorMessage(error);
            }
        }
        const filename = "global.json";
        createConfigFile(confPath, filename, new globalTemplate_1.default());
    });
}
function createSonarlintJson() {
    return __awaiter(this, void 0, void 0, function* () {
        const rootPath = vscode.workspace.rootPath;
        const filename = "sonarlint.json";
        createConfigFile(rootPath, filename, new sonarlintTemplate_1.default());
    });
}
function createConfigFile(rootPath, filename, template) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!rootPath) {
            return;
        }
        const filePath = path.join(rootPath, filename);
        const action = "Open " + filename;
        let selectedAction;
        try {
            yield fs.stat(filePath);
            selectedAction = yield vscode.window.showInformationMessage(filename + " already exists", action);
        }
        catch (error) {
            try {
                yield fs.writeFile(filePath, JSON.stringify(template.getTemplateObject(), undefined, 4));
                selectedAction = yield vscode.window.showInformationMessage(filename + " was created", action);
            }
            catch (error) {
                vscode.window.showErrorMessage(error);
            }
        }
        if (selectedAction) {
            const textDocument = yield vscode.workspace.openTextDocument(filePath);
            yield vscode.window.showTextDocument(textDocument);
        }
    });
}