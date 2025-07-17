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
var fs = require("fs");
var path = require("path");
var dotenv = require("dotenv");
dotenv.config();
console.log('DEBUG ENV:', {
    AWS_S3_BUCKET: process.env.AWS_S3_BUCKET,
    AWS_REGION: process.env.AWS_REGION,
    AWS_S3_REPORT_PREFIX: process.env.AWS_S3_REPORT_PREFIX,
    AWS_S3_SCREENSHOT_PREFIX: process.env.AWS_S3_SCREENSHOT_PREFIX
});
console.log('✅ AlwaysJsonReporter loaded');
var AlwaysJsonReporter = /** @class */ (function () {
    function AlwaysJsonReporter(options) {
        this.options = options;
    }
    AlwaysJsonReporter.prototype.onEnd = function () {
        return __awaiter(this, void 0, void 0, function () {
            function collect(suites) {
                var _a, _b;
                if (!suites)
                    return;
                for (var _i = 0, suites_1 = suites; _i < suites_1.length; _i++) {
                    var suite = suites_1[_i];
                    if (suite.suites)
                        collect(suite.suites);
                    if (suite.specs) {
                        for (var _c = 0, _d = suite.specs; _c < _d.length; _c++) {
                            var spec = _d[_c];
                            for (var _e = 0, _f = spec.tests; _e < _f.length; _e++) {
                                var test = _f[_e];
                                for (var _g = 0, _h = test.results; _g < _h.length; _g++) {
                                    var result = _h[_g];
                                    // Treat any non-passed status as a failure for reporting
                                    var isFailure = result.status !== 'passed' && result.status !== 'skipped';
                                    allTests.push({
                                        title: spec.title,
                                        file: spec.file,
                                        line: spec.line,
                                        status: result.status,
                                        error: ((_a = result.error) === null || _a === void 0 ? void 0 : _a.message) || (result.errors && ((_b = result.errors[0]) === null || _b === void 0 ? void 0 : _b.message)) || '',
                                        attachments: result.attachments || [],
                                        isFailure: isFailure
                                    });
                                }
                            }
                        }
                    }
                }
            }
            var jsonReportPath, report, allTests, counts, failedTests, passedTests, messageText, webhookUrl, htmlReportPath, htmlReportLink, reportUrl, screenshotUrl, total, duration, testDate, passPercent, hasFailures, mainTitle, introMsg, reportMarkdownLink, message, fetchFn, response, text, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        jsonReportPath = path.join(process.cwd(), 'test-results', 'results.json');
                        if (!fs.existsSync(jsonReportPath)) {
                            jsonReportPath = path.join(process.cwd(), 'test-results', 'playwright-report.json');
                        }
                        try {
                            if (fs.existsSync(jsonReportPath)) {
                                report = JSON.parse(fs.readFileSync(jsonReportPath, 'utf-8'));
                                console.log('DEBUG: Found test results at:', jsonReportPath);
                            }
                            else {
                                console.log('DEBUG: No test results file found at any location');
                                console.log('DEBUG: This might mean no tests were executed');
                                return [2 /*return*/]; // Exit gracefully if no results file exists
                            }
                        }
                        catch (e) {
                            console.error('❌ Could not read Playwright JSON report:', e);
                            return [2 /*return*/];
                        }
                        allTests = [];
                        collect(report.suites);
                        counts = { passed: 0, failed: 0, skipped: 0 };
                        allTests.forEach(function (t) {
                            if (t.status === 'passed')
                                counts.passed++;
                            else if (t.status === 'skipped')
                                counts.skipped++;
                            else
                                counts.failed++;
                        });
                        failedTests = allTests.filter(function (t) { return t.isFailure; });
                        passedTests = allTests.filter(function (t) { return t.status === 'passed'; });
                        messageText = "**Test Results**\n- Passed: ".concat(counts.passed, "\n- Failed: ").concat(counts.failed, "\n- Skipped: ").concat(counts.skipped, "\n");
                        if (failedTests.length > 0) {
                            messageText += "\n**\u274C Failed Tests:**\n";
                            messageText += failedTests.map(function (f) {
                                var msg = "**".concat(f.title, "**\nFile: ").concat(f.file, ":").concat(f.line, "\nStatus: ").concat(f.status, "\nError: ").concat(f.error);
                                var screenshots = (f.attachments || []).filter(function (a) { return a.name && a.name.toLowerCase().includes('screenshot') && a.path; });
                                var logs = (f.attachments || []).filter(function (a) { return a.name && a.name.toLowerCase().includes('log') && a.path; });
                                if (screenshots.length > 0) {
                                    // msg += `\nScreenshots: ${screenshots.map(s => `[${path.basename(s.path)}](${s.path})`).join(', ')}`;
                                }
                                if (logs.length > 0) {
                                    msg += "\nLogs: ".concat(logs.map(function (l) { return "[".concat(path.basename(l.path), "](").concat(l.path, ")"); }).join(', '));
                                }
                                return msg;
                            }).join('\n\n');
                        }
                        else {
                            messageText += "\n\u2705 All tests passed!";
                        }
                        if (passedTests.length > 0) {
                            messageText += "\n\n**\u2705 Passed Tests:**\n";
                            messageText += passedTests.map(function (f) {
                                var msg = "**".concat(f.title, "**\nFile: ").concat(f.file, ":").concat(f.line);
                                return msg;
                            }).join('\n\n');
                        }
                        // Print the full summary and details to the console for local review
                        console.log('DEBUG: Test counts:', counts);
                        console.log('DEBUG: Failed tests:', JSON.stringify(failedTests, null, 2));
                        console.log('DEBUG: Passed tests:', JSON.stringify(passedTests, null, 2));
                        console.log('DEBUG: Message text preview:\n', messageText);
                        if (counts.failed !== failedTests.length) {
                            console.warn("WARNING: Failed test count (".concat(counts.failed, ") does not match failed test details (").concat(failedTests.length, "). Some failures may not be listed."));
                        }
                        webhookUrl = process.env.TEAMS_WEBHOOK_URL;
                        console.log('DEBUG: Using webhook URL:', webhookUrl);
                        if (!webhookUrl) {
                            console.log('⚠️  No Teams webhook URL configured, skipping notification');
                            return [2 /*return*/];
                        }
                        htmlReportPath = path.join(process.cwd(), 'playwright-report', 'index.html');
                        htmlReportLink = '';
                        if (fs.existsSync(htmlReportPath)) {
                            htmlReportLink = "\n\n[View HTML Report](".concat(htmlReportPath, ")");
                        }
                        reportUrl = "https://".concat(process.env.AWS_S3_BUCKET, ".s3.").concat(process.env.AWS_REGION, ".amazonaws.com/").concat(process.env.AWS_S3_REPORT_PREFIX, "/index.html");
                        screenshotUrl = function (filename) {
                            return "https://".concat(process.env.AWS_S3_BUCKET, ".s3.").concat(process.env.AWS_REGION, ".amazonaws.com/").concat(process.env.AWS_S3_SCREENSHOT_PREFIX, "/").concat(filename);
                        };
                        total = counts.passed + counts.failed + counts.skipped;
                        duration = process.env.TEST_START_TIME ? "".concat(Math.round((Date.now() - new Date(process.env.TEST_START_TIME).getTime()) / 1000), "s") : '';
                        testDate = process.env.TEST_START_TIME ? new Date(process.env.TEST_START_TIME).toLocaleString() : new Date().toLocaleString();
                        passPercent = total > 0 ? ((counts.passed / total) * 100).toFixed(1) : '0.0';
                        hasFailures = failedTests.length > 0;
                        mainTitle = hasFailures ? '**🟢 Testing Report Prod - Issues Detected**' : '**🟢 Testing Now Prod - All Green!**';
                        introMsg = hasFailures
                            ? "\n\n**\u2757 Issues detected in this run. Please review the failures below.**\n\n"
                            : "\n\n\u2705 All tests passed. No issues detected.\n\n";
                        reportMarkdownLink = "**[\uD83D\uDD0E View Detailed HTML Report](".concat(reportUrl, ")**\n\n");
                        message = {
                            "@type": "MessageCard",
                            "@context": "http://schema.org/extensions",
                            "themeColor": hasFailures ? "FF0000" : "00FF00",
                            "summary": hasFailures ? "Playwright Test Failures" : "Playwright All Tests Passed",
                            "title": hasFailures ? "Playwright Test Failures" : "Playwright All Tests Passed",
                            "sections": [
                                {
                                    "activityTitle": mainTitle,
                                    "activitySubtitle": "Test Date: ".concat(testDate),
                                    "text": reportMarkdownLink + introMsg +
                                        "**Test Results**\n\n" +
                                        "- **\u2705 Passed:** ".concat(counts.passed, "\n") +
                                        "- **\u274C Failed:** ".concat(counts.failed, "\n") +
                                        "- **\u23ED\uFE0F Skipped:** ".concat(counts.skipped, "\n") +
                                        "- **\uD83E\uDDEE Total:** ".concat(total, "\n") +
                                        "- **\u23F1\uFE0F Duration:** ".concat(duration, "\n") +
                                        "- **\uD83D\uDCC5 Date:** ".concat(testDate, "\n") +
                                        "- **\uD83D\uDCCA Pass %:** ".concat(passPercent, "%\n\n"),
                                    "markdown": true
                                },
                                hasFailures ? {
                                    "activityTitle": "**❌ Failed Tests**",
                                    "activitySubtitle": "Showing ".concat(failedTests.length, " failure(s) below") + '\n',
                                    "facts": failedTests.map(function (f) {
                                        // Only use the filename for screenshot links
                                        var screenshotAttachment = (f.attachments || []).find(function (a) { return a.name && a.name.toLowerCase().includes('screenshot') && a.path; });
                                        var screenshotLink = '';
                                        if (screenshotAttachment && screenshotAttachment.path) {
                                            var filename = screenshotAttachment.path.split(/[\\/]/).pop();
                                            // screenshotLink = screenshotUrl(filename);
                                        }
                                        return {
                                            "name": f.title,
                                            "value": "File: ".concat(f.file, ":").concat(f.line, "\nStatus: ").concat(f.status, "\nError: ").concat(f.error) // + (screenshotLink ? `\n[Screenshot](${screenshotLink})` : '')
                                        };
                                    }),
                                    "markdown": true
                                } : null
                            ].filter(Boolean),
                            "potentialAction": [
                                {
                                    "@type": "OpenUri",
                                    "name": hasFailures ? "🔴 View Latest Test Report" : "🟢 View Latest Test Report",
                                    "targets": [
                                        { "os": "default", "uri": reportUrl }
                                    ]
                                }
                            ]
                        };
                        fetchFn = typeof fetch === 'function'
                            ? fetch
                            : function () {
                                var args = [];
                                for (var _i = 0; _i < arguments.length; _i++) {
                                    args[_i] = arguments[_i];
                                }
                                return Promise.resolve().then(function () { return require('node-fetch'); }).then(function (_a) {
                                    var fetch = _a.default;
                                    return fetch.apply(void 0, args);
                                });
                            };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        console.log('DEBUG: Sending Teams notification...');
                        return [4 /*yield*/, fetchFn(webhookUrl, {
                                method: 'POST',
                                body: JSON.stringify(message),
                                headers: { 'Content-Type': 'application/json' }
                            })];
                    case 2:
                        response = _a.sent();
                        console.log('DEBUG: Teams response status:', response.status);
                        if (!response.ok) return [3 /*break*/, 3];
                        console.log('✅ Teams notification sent successfully');
                        return [3 /*break*/, 5];
                    case 3:
                        console.error('❌ Failed to send Teams notification:', response.status, response.statusText);
                        return [4 /*yield*/, response.text()];
                    case 4:
                        text = _a.sent();
                        console.error('❌ Teams response body:', text);
                        _a.label = 5;
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_1 = _a.sent();
                        console.error('❌ Error sending Teams notification:', error_1);
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    return AlwaysJsonReporter;
}());
exports.default = AlwaysJsonReporter;
