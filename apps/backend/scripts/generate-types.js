"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var core_1 = require("@mikro-orm/core");
var fs = require("fs");
var path = require("path");
/**
 * Path where the generated interfaces will be saved
 */
var OUTPUT_DIR = path.resolve(__dirname, '../../the-web-types/src/entities');
/**
 * Function to convert MikroORM types to TypeScript types
 */
function mapType(prop) {
    var typeMap = {
        string: 'string',
        number: 'number',
        boolean: 'boolean',
        Date: 'Date',
        BigInt: 'bigint',
        Buffer: 'Buffer',
        Channel: 'Channel',
        Category: 'Category',
        Server: 'Server',
        Message: 'Message',
        User: 'User',
        Json: 'any', // JSON fields are typically `any`
    };
    // Handle collection types (many-to-many or one-to-many relationships)
    if (Array.isArray(prop.type)) {
        console.log("\uD83D\uDD0D Collection detected for ".concat(prop.type[0].name)); // Log collection
        return "".concat(prop.type[0].name, "[]"); // If it's a collection (e.g., Message[]), return type array
    }
    // Handle ManyToOne or OneToOne relationships
    if (prop.entity) {
        console.log("\uD83D\uDD0D Relationship detected for ".concat(prop.entity.name));
        return prop.entity.name; // Return the related entity type (e.g., Category, Message)
    }
    // Handle other primitive types
    return typeMap[prop.type] || 'any';
}
function generateTypes() {
    return __awaiter(this, void 0, void 0, function () {
        var config, orm, metadata, entityNames, exports;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve("".concat(path.resolve(__dirname, '../mikro-orm.config'))).then(function (s) { return require(s); }).then(function (m) { return m.default; })];
                case 1:
                    config = _a.sent();
                    return [4 /*yield*/, core_1.MikroORM.init(config)];
                case 2:
                    orm = _a.sent();
                    if (!fs.existsSync(OUTPUT_DIR)) {
                        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
                    }
                    metadata = orm.getMetadata();
                    entityNames = Object.keys(metadata.getAll());
                    exports = entityNames.map(function (entityName) { return "export * from \"./entities/".concat(entityName, "\";"); }).join('\n');
                    entityNames.forEach(function (entityName) {
                        var meta = metadata.get(entityName);
                        // Track imports based on related entities
                        var neededImports = new Set();
                        // Start building the interface
                        var interfaceStr = "";
                        // Loop through properties and determine what imports are needed
                        interfaceStr += "export interface ".concat(entityName, " {\n");
                        Object.entries(meta.properties).forEach(function (_a) {
                            var field = _a[0], prop = _a[1];
                            console.log("\uD83D\uDD39 Field: ".concat(field), prop); // Debug each property
                            // Ensure 'prop' has the 'type' property
                            if (typeof prop !== 'object' || !('type' in prop)) {
                                console.warn("\u26A0\uFE0F Skipping field ".concat(field, " as it has no 'type'"));
                                return;
                            }
                            // Check for relationships and add to imports
                            if (prop.entity) {
                                // If it is a relationship, add related entity to imports
                                neededImports.add(prop.entity.name);
                            }
                            else if (Array.isArray(prop.type)) {
                                // If it is a collection, add the related type (array)
                                if (prop.type[0].name) {
                                    neededImports.add(prop.type[0].name); // Add the name of the related entity type
                                }
                            }
                            var tsType = mapType(prop);
                            interfaceStr += "  ".concat(field, ": ").concat(tsType, ";\n");
                        });
                        interfaceStr += "}\n";
                        // Create the imports at the top of the file based on needed imports
                        if (neededImports.size > 0) {
                            interfaceStr = "import { ".concat(Array.from(neededImports).join(', '), " } from \"./entities\";\n\n").concat(interfaceStr);
                        }
                        var filePath = path.join(OUTPUT_DIR, "".concat(entityName, ".ts"));
                        fs.writeFileSync(filePath, interfaceStr, 'utf8');
                        console.log("\u2705 Generated: ".concat(filePath));
                    });
                    // Write the index file
                    fs.writeFileSync(path.resolve(__dirname, '../../the-web-types/src/index.ts'), exports, 'utf8');
                    return [4 /*yield*/, orm.close()];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
generateTypes().catch(console.error);
