"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GlobalTemplate {
    getTemplateObject() {
        return {
            servers: [
                {
                    id: "localhost",
                    url: "http://localhost:9000",
                    token: ""
                }
                
            ],
        };
    }
}
exports.default = GlobalTemplate;
//# sourceMappingURL=globalTemplate.js.map