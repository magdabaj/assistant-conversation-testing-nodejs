"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionsOnGoogleTestManager = void 0;
const chai_1 = require("chai");
const fs = __importStar(require("fs"));
const i18n = __importStar(require("i18n"));
const yaml = __importStar(require("js-yaml"));
const actions_api_helper_1 = require("./actions-api-helper");
const constants = __importStar(require("./constants"));
const merge_1 = require("./merge");
const CANNOT_BE_CALLED_BEFORE_FIRST_QUERY_MESSAGE = 'cannot be called before first query';
i18n.configure({
    locales: constants.SUPPORTED_LOCALES,
    fallbacks: constants.FALLBACK_LOCALES,
    directory: __dirname + '/locales',
    defaultLocale: constants.DEFAULT_LOCALE,
});
/**
 * A class implementing a testing framework wrapping manager class.
 */
class ActionsOnGoogleTestManager {
    /**
     * Sets up all the needed objects and settings of a Suite.
     */
    constructor({ projectId, interactionParams = {}, actionsApiCustomEndpoint, }) {
        this.latestResponse = null;
        this.suiteInteractionDefaults = constants.DEFAULT_INTERACTION_SETTING;
        this.testInteractionDefaults = {};
        this.lastUserQuery = null;
        this.updateSuiteInteractionDefaults(interactionParams);
        this.cleanUpAfterTest();
        this.actionsApiHelper = new actions_api_helper_1.ActionsApiHelper({
            projectId,
            actionsApiCustomEndpoint,
        });
    }
    /**
     * Cleans up the test scenario temporary artifacts. Should run after each
     * test scenario.
     */
    cleanUpAfterTest() {
        this.lastUserQuery = null;
        this.latestResponse = null;
        this.testInteractionDefaults = {};
    }
    /** Send a query to your action */
    sendQuery(queryText) {
        console.info(`--- sendQuery called with '${queryText}'`);
        return this.sendInteraction({ input: { query: queryText } });
    }
    /** Send an interaction object to your action  */
    async sendInteraction(interactionParams) {
        const interactionMergeParams = merge_1.getDeepMerge(this.getTestInteractionMergedDefaults(), interactionParams);
        // Set the conversation token - if not the first query
        if (this.latestResponse) {
            chai_1.assert.isFalse(this.getIsConversationEnded(), 'Conversation ended unexpectedly in previous query.');
            interactionMergeParams[constants.TOKEN_FIELD_NAME] = this.latestResponse[constants.TOKEN_FIELD_NAME];
        }
        this.lastUserQuery = interactionMergeParams.input['query'];
        this.latestResponse = await this.actionsApiHelper.sendInteraction(interactionMergeParams);
        this.validateSendInteractionResponse(this.latestResponse);
        return this.latestResponse;
    }
    /** Send a 'stop' query, to stop/exit the action. */
    sendStop() {
        return this.sendQuery(this.getStopQuery());
    }
    /** Calls the 'writePreview' API method from draft. */
    async writePreviewFromDraft() {
        console.info('Starting writePreview From Draft');
        await this.actionsApiHelper.writePreviewFromDraft();
        console.info('writePreview From Draft completed');
    }
    /** Calls the 'writePreview' API method from submitted version number. */
    async writePreviewFromVersion(versionNumber) {
        console.info(`Starting writePreview From Version ${versionNumber}`);
        await this.actionsApiHelper.writePreviewFromVersion(versionNumber);
        console.info('writePreview From Version completed');
    }
    // -------------- Update/Set query params
    /** Overrides the suite interaction defaults. */
    setSuiteInteractionDefaults(interactionParams) {
        this.suiteInteractionDefaults = interactionParams;
    }
    /** Updates the suite interaction defaults. */
    updateSuiteInteractionDefaults(interactionParams) {
        this.suiteInteractionDefaults = merge_1.getDeepMerge(this.suiteInteractionDefaults, interactionParams);
    }
    // Update/Set query params
    /** Sets the default locale for the suite. */
    setSuiteLocale(locale) {
        this.updateSuiteInteractionDefaults({ deviceProperties: { locale } });
        this.updateCurrentLocale(locale);
    }
    /** Sets the default surface for the suite. */
    setSuiteSurface(surface) {
        const devicePropertiesSurface = surface;
        this.updateSuiteInteractionDefaults({
            deviceProperties: { surface: devicePropertiesSurface },
        });
    }
    // Update/Set query params
    /**
     * Sets the default locale for the current test scenario. Only needed for
     * tests that are for different locales from the suite locale.
     */
    setTestLocale(locale) {
        this.updateTestInteractionDefaults({ deviceProperties: { locale } });
        this.updateCurrentLocale(locale);
    }
    /**
     * Sets the default surface for the current test scenario. Only needed for
     * tests that are for different surface from the suite surface.
     */
    setTestSurface(surface) {
        const devicePropertiesSurface = surface;
        this.updateTestInteractionDefaults({
            deviceProperties: { surface: devicePropertiesSurface },
        });
    }
    /** Overrides the test scenario interaction defaults. */
    setTestInteractionDefaults(interactionParams) {
        this.testInteractionDefaults = interactionParams;
    }
    /** Updates the test scenario interaction defaults. */
    updateTestInteractionDefaults(interactionParams) {
        this.testInteractionDefaults = merge_1.getDeepMerge(this.testInteractionDefaults, interactionParams);
    }
    /** Returns the test scenario interaction defaults. */
    getTestInteractionMergedDefaults() {
        return merge_1.getDeepMerge(this.suiteInteractionDefaults, this.testInteractionDefaults);
    }
    // --------------- Asserts From Response:
    /**
     * Asserts the response Speech (concatenation of the first_simple and
     * last_simple Speech)
     */
    assertSpeech(expected, assertParams = {}, response) {
        const checkedResponse = response || this.latestResponse;
        chai_1.expect(checkedResponse, `assertSpeech ${CANNOT_BE_CALLED_BEFORE_FIRST_QUERY_MESSAGE}`).to.exist;
        const speech = this.getSpeech(checkedResponse);
        chai_1.assert.isDefined(speech, 'Speech field is missing from the last response: ' +
            JSON.stringify(speech));
        this.assertValueCommon(speech, expected, 'speech', assertParams);
    }
    /**
     * Asserts the response Text (concatenation of the first_simple and
     * last_simple Text)
     */
    assertText(expected, assertParams = {}, response) {
        const checkedResponse = response || this.latestResponse;
        chai_1.expect(checkedResponse, `assertText ${CANNOT_BE_CALLED_BEFORE_FIRST_QUERY_MESSAGE}`).to.exist;
        const text = this.getText(checkedResponse);
        chai_1.assert.isDefined(text, 'Text field is missing from the last response: ' + JSON.stringify(text));
        this.assertValueCommon(text, expected, 'text', assertParams);
    }
    /** Asserts the response's Intent. */
    assertIntent(expected, response) {
        const checkedResponse = response || this.latestResponse;
        chai_1.expect(checkedResponse, `assertIntent ${CANNOT_BE_CALLED_BEFORE_FIRST_QUERY_MESSAGE}`).to.exist;
        const intentName = this.getIntent(checkedResponse);
        chai_1.assert.equal(intentName, expected, 'Unexpected intent.');
    }
    /** Asserts a response's Intent Parameter value. */
    assertIntentParameter(parameterName, expected, response) {
        const checkedResponse = response || this.latestResponse;
        chai_1.expect(checkedResponse, `assertIntentParameter ${CANNOT_BE_CALLED_BEFORE_FIRST_QUERY_MESSAGE}`).to.exist;
        const parameterValue = this.getIntentParameter(parameterName, checkedResponse);
        chai_1.assert.exists(parameterValue, `Intent parameter ${parameterValue} has no value.`);
        chai_1.assert.deepEqual(parameterValue, expected, 'Unexpected intent parameter value.');
    }
    /** Asserts the response's Last Scene. */
    assertScene(expected, response) {
        const checkedResponse = response || this.latestResponse;
        chai_1.expect(checkedResponse, `assertScene ${CANNOT_BE_CALLED_BEFORE_FIRST_QUERY_MESSAGE}`).to.exist;
        const sceneName = this.getScene(checkedResponse);
        chai_1.assert.equal(sceneName, expected);
    }
    /** Asserts the prompt response. */
    assertPrompt(expected, requireExact = false, response) {
        const checkedResponse = response || this.latestResponse;
        chai_1.expect(checkedResponse, `assertPrompt ${CANNOT_BE_CALLED_BEFORE_FIRST_QUERY_MESSAGE}`).to.exist;
        const prompt = this.getPrompt(checkedResponse);
        if (requireExact) {
            chai_1.assert.deepEqual(prompt, expected);
        }
        else {
            chai_1.assert.deepOwnInclude(prompt, expected);
        }
    }
    /** Asserts the Suggestion Chips. */
    assertSuggestions(expected, requireExact = false, response) {
        const checkedResponse = response || this.latestResponse;
        chai_1.expect(checkedResponse, `assertSuggestions ${CANNOT_BE_CALLED_BEFORE_FIRST_QUERY_MESSAGE}`).to.exist;
        const suggestions = this.getSuggestions(checkedResponse);
        chai_1.assert.exists(suggestions);
        chai_1.assert.equal(suggestions.length, expected.length);
        // Note: since deepEqual and deepOwnInclude are not working on Arrays, so
        // we need to compare each element separately.
        for (let i = 0; i < suggestions.length; ++i) {
            if (requireExact) {
                chai_1.assert.deepEqual(suggestions[i], expected[i]);
            }
            else {
                chai_1.assert.deepOwnInclude(suggestions[i], expected[i]);
            }
        }
    }
    /** Asserts the Canvas URL. */
    assertCanvasURL(expected, response) {
        const checkedResponse = response || this.latestResponse;
        chai_1.expect(checkedResponse, `assertCanvasURL ${CANNOT_BE_CALLED_BEFORE_FIRST_QUERY_MESSAGE}`).to.exist;
        const canvasURL = this.getCanvasURL(checkedResponse);
        chai_1.assert.equal(canvasURL, expected);
    }
    /** Asserts the Canvas Data. */
    assertCanvasData(expected, requireExact = false, response) {
        const checkedResponse = response || this.latestResponse;
        chai_1.expect(checkedResponse, `assertCanvasData ${CANNOT_BE_CALLED_BEFORE_FIRST_QUERY_MESSAGE}`).to.exist;
        const canvasData = this.getCanvasData(checkedResponse);
        chai_1.assert.exists(canvasData);
        chai_1.assert.equal(canvasData.length, expected.length);
        // Note: since deepEqual and deepOwnInclude are not working on Arrays, so
        // we need to compare each element separately.
        for (let i = 0; i < canvasData.length; ++i) {
            if (requireExact) {
                chai_1.assert.deepEqual(canvasData[i], expected[i]);
            }
            else {
                chai_1.assert.deepOwnInclude(canvasData[i], expected[i]);
            }
        }
    }
    /** Asserts that the conversation ended, based on the response. */
    assertConversationEnded(response) {
        const checkedResponse = response || this.latestResponse;
        chai_1.expect(checkedResponse, `assertConversationEnded ${CANNOT_BE_CALLED_BEFORE_FIRST_QUERY_MESSAGE}`).to.exist;
        chai_1.assert.isTrue(this.getIsConversationEnded(checkedResponse), 'Failed since Conversation is not completed as expected.');
    }
    /** Asserts that the conversation did not end, based on the response. */
    assertConversationNotEnded(response) {
        const checkedResponse = response || this.latestResponse;
        chai_1.expect(checkedResponse, `assertConversationNotEnded ${CANNOT_BE_CALLED_BEFORE_FIRST_QUERY_MESSAGE}`).to.exist;
        chai_1.assert.isFalse(this.getIsConversationEnded(checkedResponse), 'Failed since Conversation has completed too early.');
    }
    /**
     * Asserts the session storage parameter value, in the given response.
     */
    assertSessionParam(name, expected, response) {
        const checkedResponse = response || this.latestResponse;
        chai_1.expect(checkedResponse, `assertSessionParam ${CANNOT_BE_CALLED_BEFORE_FIRST_QUERY_MESSAGE}`).to.exist;
        const value = this.getSessionParam(name, checkedResponse);
        chai_1.assert.deepEqual(value, expected, 'Unexpected SessionParam variable ' + name);
    }
    /**
     * Asserts the user storage parameter value, in the given response.
     */
    assertUserParam(name, expected, response) {
        const checkedResponse = response || this.latestResponse;
        chai_1.expect(checkedResponse, `assertUserParam ${CANNOT_BE_CALLED_BEFORE_FIRST_QUERY_MESSAGE}`).to.exist;
        const value = this.getUserParam(name, checkedResponse);
        chai_1.assert.deepEqual(value, expected, 'Unexpected UserParam variable ' + name);
    }
    /**
     * Asserts the home storage parameter value, in the given response.
     */
    assertHomeParam(name, expected, response) {
        const checkedResponse = response || this.latestResponse;
        chai_1.expect(checkedResponse, `assertHomeParam ${CANNOT_BE_CALLED_BEFORE_FIRST_QUERY_MESSAGE}`).to.exist;
        const value = this.getHomeParam(name, checkedResponse);
        chai_1.assert.deepEqual(value, expected, 'Unexpected HomeParam variable ' + name);
    }
    /** Asserts the Card response. */
    assertCard(expected, requireExact = false, response) {
        const checkedResponse = response || this.latestResponse;
        chai_1.expect(checkedResponse, `assertCard ${CANNOT_BE_CALLED_BEFORE_FIRST_QUERY_MESSAGE}`).to.exist;
        const card = this.getCard(checkedResponse);
        if (requireExact) {
            chai_1.assert.deepEqual(card, expected);
        }
        else {
            chai_1.assert.deepOwnInclude(card, expected);
        }
    }
    /** Asserts the Media response. */
    assertMedia(expected, requireExact = false, response) {
        const checkedResponse = response || this.latestResponse;
        chai_1.expect(checkedResponse, `assertMedia ${CANNOT_BE_CALLED_BEFORE_FIRST_QUERY_MESSAGE}`).to.exist;
        const media = this.getMedia(checkedResponse);
        if (requireExact) {
            chai_1.assert.deepEqual(media, expected);
        }
        else {
            chai_1.assert.deepOwnInclude(media, expected);
        }
    }
    /** Asserts the Collection response. */
    assertCollection(expected, requireExact = false, response) {
        const checkedResponse = response || this.latestResponse;
        chai_1.expect(checkedResponse, `assertCollection ${CANNOT_BE_CALLED_BEFORE_FIRST_QUERY_MESSAGE}`).to.exist;
        const collection = this.getCollection(checkedResponse);
        if (requireExact) {
            chai_1.assert.deepEqual(collection, expected);
        }
        else {
            chai_1.assert.deepOwnInclude(collection, expected);
        }
    }
    /** Asserts the Image response. */
    assertImage(expected, requireExact = false, response) {
        const checkedResponse = response || this.latestResponse;
        chai_1.expect(checkedResponse, `assertImage ${CANNOT_BE_CALLED_BEFORE_FIRST_QUERY_MESSAGE}`).to.exist;
        const image = this.getImage(checkedResponse);
        if (requireExact) {
            chai_1.assert.deepEqual(image, expected);
        }
        else {
            chai_1.assert.deepOwnInclude(image, expected);
        }
    }
    /** Asserts the Table response. */
    assertTable(expected, requireExact = false, response) {
        const checkedResponse = response || this.latestResponse;
        chai_1.expect(checkedResponse, `assertTable ${CANNOT_BE_CALLED_BEFORE_FIRST_QUERY_MESSAGE}`).to.exist;
        const table = this.getTable(checkedResponse);
        if (requireExact) {
            chai_1.assert.deepEqual(table, expected);
        }
        else {
            chai_1.assert.deepOwnInclude(table, expected);
        }
    }
    /** Asserts the List response. */
    assertList(expected, requireExact = false, response) {
        const checkedResponse = response || this.latestResponse;
        chai_1.expect(checkedResponse, `assertList ${CANNOT_BE_CALLED_BEFORE_FIRST_QUERY_MESSAGE}`).to.exist;
        const list = this.getList(checkedResponse);
        if (requireExact) {
            chai_1.assert.deepEqual(list, expected);
        }
        else {
            chai_1.assert.deepOwnInclude(list, expected);
        }
    }
    /**
     * Asserts the expected intents for the checked query using the matchIntents
     * API call.
     */
    async assertTopMatchedIntent(query, expectedIntent, requiredPlace = 1, queryLanguage) {
        const matchedIntents = await this.getMatchIntentsList(query, queryLanguage);
        if (!matchedIntents) {
            this.throwError(`Query ${query} did not match to any intent.`);
        }
        if (!matchedIntents ||
            !matchedIntents.slice(0, requiredPlace - 1).includes(expectedIntent)) {
            this.throwError(`Query ${query} expected matched intent ${expectedIntent} is not part of the top ${requiredPlace} matched intents: ${JSON.stringify(matchedIntents)}`);
        }
    }
    /**
     * Asserts that all queries in YAML file matches the expected top matched
     * intent, checked by using the matchIntents API call.
     * Will fail if any of the queries did not match the expected intent.
     */
    async assertMatchIntentsFromYamlFile(yamlFile, queriesLanguage) {
        const fileContents = fs.readFileSync(yamlFile, 'utf8');
        const yamlData = yaml.safeLoad(fileContents);
        chai_1.expect(yamlData, `failed to read file ${yamlFile}`).to.exist;
        chai_1.expect(yamlData['testCases'], `Missing 'testCases' from ${yamlFile}`).to
            .exist;
        const failedQueries = [];
        for (const testCase of yamlData.testCases) {
            if (!testCase['query']) {
                throw new Error('YAML file test entry is missing "query" field.');
            }
            if (!testCase['expectedIntent']) {
                throw new Error('YAML file test entry is missing "expectedIntent" field.');
            }
            let language = yamlData['defaultLanguage'];
            if (!language) {
                chai_1.expect(queriesLanguage, 'Failed since assertMatchIntentsFromYamlFile is missing a language').to.exist;
                language = queriesLanguage;
            }
            const matchResponse = await this.getMatchIntents(testCase.query, language);
            const topMatchedIntentName = this.getTopMatchIntentFromMatchResponse(matchResponse);
            if (topMatchedIntentName !== testCase['expectedIntent']) {
                failedQueries.push({
                    query: testCase['query'],
                    actual: topMatchedIntentName,
                    expected: testCase['expectedIntent'],
                });
            }
        }
        chai_1.expect(failedQueries, `The following queries have failed: ${JSON.stringify(failedQueries)}`).to.be.empty;
    }
    /** Gets the intents for the checked query using the matchIntents API call. */
    async getMatchIntents(query, queryLanguage) {
        const locale = queryLanguage ||
            this.getTestInteractionMergedDefaults().deviceProperties.locale;
        return this.actionsApiHelper.matchIntents({ locale, query });
    }
    /** Gets the matched intents' names using the matchIntents API call. */
    async getMatchIntentsList(query, queryLanguage) {
        const responseMatchIntents = await this.getMatchIntents(query, queryLanguage);
        chai_1.expect(responseMatchIntents['matchedIntents'], 'Failed to get matchedIntents section in from getMatchIntents response.').to.exist;
        return responseMatchIntents.matchedIntents.map(intent => {
            return intent.name;
        });
    }
    // --------------- Getters:
    /** Gets the latest turn full response. */
    getLatestResponse() {
        return this.latestResponse;
    }
    /**
     * Gets the response Speech (concatenation of the first_simple and last_simple
     * Speech)
     */
    getSpeech(response) {
        const checkedResponse = response || this.latestResponse;
        chai_1.expect(checkedResponse, `getSpeech ${CANNOT_BE_CALLED_BEFORE_FIRST_QUERY_MESSAGE}`).to.exist;
        if ('speech' in checkedResponse.output) {
            return checkedResponse.output.speech.join('');
        }
        return this.getText(checkedResponse);
    }
    /**
     * Gets the response Text (concatenation of the first_simple and last_simple
     * Text)
     */
    getText(response) {
        const checkedResponse = response || this.latestResponse;
        chai_1.expect(checkedResponse, `getText ${CANNOT_BE_CALLED_BEFORE_FIRST_QUERY_MESSAGE}`).to.exist;
        return checkedResponse.output['text'];
    }
    /** Gets the intent, from the response. */
    getIntent(response) {
        const checkedResponse = response || this.latestResponse;
        chai_1.expect(checkedResponse, `getIntent ${CANNOT_BE_CALLED_BEFORE_FIRST_QUERY_MESSAGE}`).to.exist;
        let intentName = null;
        if ('actionsBuilderEvents' in checkedResponse.diagnostics) {
            for (const actionsBuilderEvent of checkedResponse.diagnostics
                .actionsBuilderEvents) {
                if (actionsBuilderEvent['intentMatch'] &&
                    actionsBuilderEvent['intentMatch']['intentId']) {
                    intentName = actionsBuilderEvent['intentMatch']['intentId'];
                }
            }
        }
        chai_1.expect(intentName, `Unexpected issue: Failed to find intent name in the response ${JSON.stringify(checkedResponse)}`).to.exist;
        return intentName;
    }
    /** Gets the current intent parameter value, from the response. */
    getIntentParameter(parameterName, response) {
        const checkedResponse = response || this.latestResponse;
        chai_1.expect(checkedResponse, `getIntentParameter ${CANNOT_BE_CALLED_BEFORE_FIRST_QUERY_MESSAGE}`).to.exist;
        let intentMatch = null;
        if ('actionsBuilderEvents' in checkedResponse.diagnostics) {
            for (const actionsBuilderEvent of checkedResponse.diagnostics
                .actionsBuilderEvents) {
                if (actionsBuilderEvent['intentMatch']) {
                    intentMatch = actionsBuilderEvent['intentMatch'];
                }
            }
        }
        if (intentMatch &&
            intentMatch.intentParameters &&
            parameterName in intentMatch.intentParameters &&
            'resolved' in intentMatch.intentParameters[parameterName]) {
            return intentMatch.intentParameters[parameterName].resolved;
        }
        return null;
    }
    /** Gets the last scene, from the response. */
    getScene(response) {
        var _a;
        const checkedResponse = response || this.latestResponse;
        chai_1.expect(checkedResponse, `getScene ${CANNOT_BE_CALLED_BEFORE_FIRST_QUERY_MESSAGE}`).to.exist;
        return (((_a = this.getExecutionState(checkedResponse)) === null || _a === void 0 ? void 0 : _a.currentSceneId) ||
            constants.UNCHANGED_SCENE);
    }
    /** Gets the Prompt. */
    getPrompt(response) {
        var _a;
        const checkedResponse = response || this.latestResponse;
        chai_1.expect(checkedResponse, `getContent ${CANNOT_BE_CALLED_BEFORE_FIRST_QUERY_MESSAGE}`).to.exist;
        return (_a = checkedResponse.output) === null || _a === void 0 ? void 0 : _a.actionsBuilderPrompt;
    }
    /**
     * Gets the Canvas Data.
     */
    getSuggestions(response) {
        var _a;
        const checkedResponse = response || this.latestResponse;
        chai_1.expect(checkedResponse, `getSuggestions ${CANNOT_BE_CALLED_BEFORE_FIRST_QUERY_MESSAGE}`).to.exist;
        return (_a = this.getPrompt(response)) === null || _a === void 0 ? void 0 : _a.suggestions;
    }
    /** Gets the Prompt Content, if exists. */
    getContent(response) {
        var _a;
        return (_a = this.getPrompt(response)) === null || _a === void 0 ? void 0 : _a.content;
    }
    /** Gets the Card response, if exists. */
    getCard(response) {
        const content = this.getContent(response);
        return content === null || content === void 0 ? void 0 : content.card;
    }
    /** Gets the Image response, if exists. */
    getImage(response) {
        const content = this.getContent(response);
        return content === null || content === void 0 ? void 0 : content.image;
    }
    /** Gets the Table response, if exists. */
    getTable(response) {
        const content = this.getContent(response);
        return content === null || content === void 0 ? void 0 : content.table;
    }
    /** Gets the Collection response, if exists. */
    getCollection(response) {
        const content = this.getContent(response);
        return content === null || content === void 0 ? void 0 : content.collection;
    }
    /** Gets the List response, if exists. */
    getList(response) {
        const content = this.getContent(response);
        return content === null || content === void 0 ? void 0 : content.list;
    }
    /** Gets the Media response, if exists. */
    getMedia(response) {
        const content = this.getContent(response);
        return content === null || content === void 0 ? void 0 : content.media;
    }
    /** Returns whether the conversation ended, based on the response. */
    getIsConversationEnded(response) {
        const checkedResponse = response || this.latestResponse;
        chai_1.expect(checkedResponse, `getIsConversationEnded ${CANNOT_BE_CALLED_BEFORE_FIRST_QUERY_MESSAGE}`).to.exist;
        if (!('actionsBuilderEvents' in checkedResponse.diagnostics)) {
            return true;
        }
        const actionsBuilderEvent = this.getLatestActionsBuilderEvent(checkedResponse);
        // if (!this.getLatestActionsBuilderEvent(checkedResponse!)) return false;
        // return !!actionsBuilderEvent;
        console.log('checked response', checkedResponse);
        console.log('actionsBuilderEvent', actionsBuilderEvent);
        console.log('!!actionsBuilderEvent', !!actionsBuilderEvent);
        return !!actionsBuilderEvent || 'endConversation' in actionsBuilderEvent;
    }
    /**
     * Returns the value of the session param from the response.
     */
    getSessionParam(name, response) {
        const checkedResponse = response || this.latestResponse;
        chai_1.expect(checkedResponse, `getSessionParam ${CANNOT_BE_CALLED_BEFORE_FIRST_QUERY_MESSAGE}`).to.exist;
        let value = null;
        const executionState = this.getExecutionState(checkedResponse);
        if (executionState &&
            'sessionStorage' in executionState &&
            name in executionState.sessionStorage) {
            value = executionState.sessionStorage[name];
        }
        return value;
    }
    /**
     * Returns the value of the user param from the response.
     */
    getUserParam(name, response) {
        const checkedResponse = response || this.latestResponse;
        chai_1.expect(checkedResponse, `getUserParam ${CANNOT_BE_CALLED_BEFORE_FIRST_QUERY_MESSAGE}`).to.exist;
        let value = null;
        const executionState = this.getExecutionState(checkedResponse);
        if (executionState &&
            'userStorage' in executionState &&
            name in executionState.userStorage) {
            value = executionState.userStorage[name];
        }
        return value;
    }
    /**
     * Returns the value of the home (household) storage param from the response.
     */
    getHomeParam(name, response) {
        const checkedResponse = response || this.latestResponse;
        chai_1.expect(checkedResponse, `getHomeParam ${CANNOT_BE_CALLED_BEFORE_FIRST_QUERY_MESSAGE}`).to.exist;
        const executionState = this.getExecutionState(checkedResponse);
        let value = null;
        if (executionState &&
            'householdStorage' in executionState &&
            name in executionState.householdStorage) {
            value = executionState.householdStorage[name];
        }
        return value;
    }
    /**
     * Gets the Canvas URL from the response.
     */
    getCanvasURL(response) {
        var _a;
        const checkedResponse = response || this.latestResponse;
        chai_1.expect(checkedResponse, `getCanvasURL ${CANNOT_BE_CALLED_BEFORE_FIRST_QUERY_MESSAGE}`).to.exist;
        return (_a = checkedResponse.output.canvas) === null || _a === void 0 ? void 0 : _a.url;
    }
    /**
     * Gets the Canvas Data.
     */
    getCanvasData(response) {
        var _a;
        const checkedResponse = response || this.latestResponse;
        chai_1.expect(checkedResponse, `getCanvasData ${CANNOT_BE_CALLED_BEFORE_FIRST_QUERY_MESSAGE}`).to.exist;
        return (_a = checkedResponse.output.canvas) === null || _a === void 0 ? void 0 : _a.data;
    }
    /** Gets the execution state. */
    getExecutionState(response) {
        var _a;
        const checkedResponse = response || this.latestResponse;
        chai_1.expect(checkedResponse, `getExecutionState ${CANNOT_BE_CALLED_BEFORE_FIRST_QUERY_MESSAGE}`).to.exist;
        return (_a = this.getLatestActionsBuilderEvent(checkedResponse)) === null || _a === void 0 ? void 0 : _a.executionState;
    }
    /** Gets the latest ActionsBuilderEvent. */
    getLatestActionsBuilderEvent(response) {
        var _a, _b;
        const checkedResponse = response || this.latestResponse;
        chai_1.expect(checkedResponse, `getActionsBuilderLatestEvent ${CANNOT_BE_CALLED_BEFORE_FIRST_QUERY_MESSAGE}`).to.exist;
        return (_b = (_a = checkedResponse.diagnostics) === null || _a === void 0 ? void 0 : _a.actionsBuilderEvents) === null || _b === void 0 ? void 0 : _b.slice(-1)[0];
    }
    /** Returns the i18n value of the key. */
    i18n(name, params) {
        if (params) {
            return i18n.__(name, params);
        }
        return i18n.__(name);
    }
    /** Updates the current locale for the i18n util functions. */
    updateCurrentLocale(locale) {
        if (constants.SUPPORTED_LOCALES.concat(Object.keys(constants.FALLBACK_LOCALES)).indexOf(locale) === -1) {
            this.throwError(`The provided locale '${locale}' is not a supported 'Actions On Google' locale.`);
            return;
        }
        i18n.setLocale(locale);
    }
    /**
     * Asserts the value matched the expected string or array of string.
     */
    assertValueCommon(value, expected, checkName, args = {}) {
        const isExact = 'isExact' in args ? args.isExact : false;
        const isRegexp = 'isRegexp' in args ? args.isRegexp : false;
        const expectedList = Array.isArray(expected) ? expected : [expected];
        let isMatch = false;
        for (const expectedItem of expectedList) {
            if (isRegexp) {
                let itemRegexpMatch;
                if (isExact) {
                    itemRegexpMatch = value.match('^' + expectedItem + '$');
                }
                else {
                    itemRegexpMatch = value.match(expectedItem);
                }
                if (itemRegexpMatch) {
                    isMatch = true;
                }
            }
            else {
                let itemMatch;
                if (isExact) {
                    itemMatch = value === expectedItem;
                }
                else {
                    itemMatch = value.includes(expectedItem);
                }
                isMatch = isMatch || itemMatch;
            }
        }
        if (isMatch) {
            return;
        }
        let errorMessage = `Unexpected ${checkName}.\n --- Actual value is: ${JSON.stringify(value)}.\n --- Expected`;
        if (isRegexp) {
            errorMessage += ' to regexp match';
        }
        else {
            errorMessage += ' to match';
        }
        if (Array.isArray(expected)) {
            errorMessage += ' one of';
        }
        errorMessage += ':' + JSON.stringify(expected);
        this.throwError(errorMessage);
    }
    /** Throws an error with a given message. */
    throwError(errorStr) {
        console.error(errorStr + '\n  During user query: ' + this.lastUserQuery);
        throw new Error(errorStr + '\n  During user query: ' + this.lastUserQuery);
    }
    /** Gets the text of 'stop' query in the requested locale. */
    getStopQuery() {
        return this.i18n('cancel');
    }
    /** Gets top matched intent name from the MatchedIntent response. */
    getTopMatchIntentFromMatchResponse(matchResponse) {
        chai_1.expect(matchResponse['matchedIntents'], 'Failed to get matchedIntents section in from getMatchIntents response.').to.exist;
        if (matchResponse.matchedIntents.length > 0) {
            const topMatch = matchResponse.matchedIntents[0];
            if ('name' in topMatch) {
                return topMatch.name;
            }
        }
        return null;
    }
    /** Validates that the response content is valid */
    validateSendInteractionResponse(response) {
        chai_1.expect(response, 'Unexpected API call issue: Response is empty').to.exist;
        chai_1.expect(response.diagnostics, `Unexpected API call issue: Response 'diagnostics' is missing: ${JSON.stringify(response)}`).to.exist;
        chai_1.expect(response.output, "Unexpected API call issue: Response 'diagnostics' is missing").to.exist;
    }
}
exports.ActionsOnGoogleTestManager = ActionsOnGoogleTestManager;
//# sourceMappingURL=action-on-google-test-manager.js.map