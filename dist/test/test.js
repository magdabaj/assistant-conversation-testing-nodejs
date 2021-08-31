"use strict";
/**
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
/**
 * @fileoverview Unit tests for the Library.
 */
/* eslint-disable  node/no-unpublished-import */
/* eslint-disable  prefer-arrow-callback */
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
require("mocha");
const chai_1 = require("chai");
const constants = __importStar(require("../constants"));
const index_1 = require("../index");
const merge_1 = require("../merge");
const mockResponse1 = __importStar(require("./mock-response1.json"));
const test_data_1 = require("./test-data");
describe('ActionsOnGoogleTestManager', function () {
    let test;
    /** Updates the response's content part. */
    function updatedResponseContent(baseResponse, updatedContent) {
        baseResponse.output.actionsBuilderPrompt = { content: updatedContent };
    }
    /** Initializes the latest turn response to the mock response. */
    function initLatestResponse() {
        test.latestResponse = merge_1.deepClone(mockResponse1);
    }
    before('before all', function () {
        test = new index_1.ActionsOnGoogleTestManager({ projectId: 'FAKE_PROJECT_ID' });
    });
    it('should set default locale and surface', async function () {
        const newLocale = 'en-US';
        const newSurface = 'PHONE';
        chai_1.assert.deepEqual(test.getTestInteractionMergedDefaults(), constants.DEFAULT_INTERACTION_SETTING);
        const expectedDeviceProperties = constants.DEFAULT_INTERACTION_SETTING.deviceProperties;
        chai_1.assert.deepOwnInclude(test.getTestInteractionMergedDefaults(), {
            deviceProperties: expectedDeviceProperties,
        });
        test.setSuiteLocale(newLocale);
        expectedDeviceProperties.locale = newLocale;
        chai_1.assert.deepOwnInclude(test.getTestInteractionMergedDefaults(), {
            deviceProperties: expectedDeviceProperties,
        });
        expectedDeviceProperties.surface = newSurface;
        test.setSuiteSurface(newSurface);
        chai_1.assert.deepOwnInclude(test.getTestInteractionMergedDefaults(), {
            deviceProperties: expectedDeviceProperties,
        });
    });
    it('should get and assert speech from latest response', async function () {
        initLatestResponse();
        const expectedSpeech = 'Welcome to Facts about Google! What type of facts would you like to hear?';
        chai_1.assert.equal(test.getSpeech(), expectedSpeech);
        chai_1.expect(() => test.assertSpeech(expectedSpeech)).not.to.throw();
        chai_1.expect(() => test.assertSpeech(expectedSpeech, {
            isExact: true,
        })).not.to.throw();
        chai_1.expect(() => test.assertSpeech('Welcome')).not.to.throw();
        chai_1.expect(() => test.assertSpeech(['Welcome to .* about Google!'], {
            isRegexp: true,
        })).not.to.throw();
        chai_1.expect(() => test.assertSpeech(['no match', 'Welcome to Facts about Google!'])).not.to.throw();
        chai_1.expect(() => test.assertSpeech('bad')).to.throw();
        chai_1.expect(() => test.assertSpeech(['bad', 'bad2'])).to.throw();
        chai_1.expect(() => test.assertSpeech(['bad .* about Google!', 'bad'], {
            isRegexp: true,
        })).to.throw();
        chai_1.expect(() => test.assertSpeech(['Welcome to Facts about Google!'], {
            isExact: true,
        })).to.throw();
    });
    it('should get and assert text from latest response', async function () {
        initLatestResponse();
        const expectedText = 'Welcome to Facts about Google! What type of facts would you like to hear?';
        chai_1.assert.equal(test.getText(), expectedText);
        chai_1.expect(() => test.assertText(expectedText)).not.to.throw();
        chai_1.expect(() => test.assertText(expectedText, { isExact: true })).not.to.throw();
        chai_1.expect(() => test.assertText('Welcome')).not.to.throw();
        chai_1.expect(() => test.assertText(['Welcome to .* about Google!'], {
            isRegexp: true,
        })).not.to.throw();
        chai_1.expect(() => test.assertText(['no match', 'Welcome to Facts about Google!'])).not.to.throw();
        chai_1.expect(() => test.assertText('bad')).to.throw();
        chai_1.expect(() => test.assertText(['bad', 'bad2'])).to.throw();
        chai_1.expect(() => test.assertText(['bad .* about Google!', 'bad'], {
            isRegexp: true,
        })).to.throw();
        chai_1.expect(() => test.assertText(['Welcome to Facts about Google!'], {
            isExact: true,
        })).to.throw();
    });
    it('should get and assert matched intent from latest response', async function () {
        initLatestResponse();
        chai_1.assert.equal(test.getIntent(), 'actions.intent.MAIN');
        chai_1.expect(() => test.assertIntent('actions.intent.MAIN')).not.to.throw();
        chai_1.expect(() => test.assertIntent('BAD_INTENT')).to.throw();
    });
    it('should get and assert intent parameter from latest response', async function () {
        initLatestResponse();
        chai_1.assert.equal(test.getIntentParameter('intentParamString'), 'value');
        chai_1.assert.equal(test.getIntentParameter('intentParamInt'), 5);
        chai_1.assert.equal(test.getIntentParameter('badName'), null);
        chai_1.expect(() => test.assertIntentParameter('intentParamString', 'value')).not.to.throw();
        chai_1.expect(() => test.assertIntentParameter('intentParamInt', 5)).not.to.throw();
        chai_1.expect(() => test.assertIntentParameter('BadIntentParamName', 'blabla')).to.throw();
        chai_1.expect(() => test.assertIntentParameter('intentParamString', 'blabla')).to.throw();
        chai_1.expect(() => test.assertIntentParameter('intentParamInt', 101)).to.throw();
        chai_1.expect(() => test.assertIntentParameter('intentParamInt', 'blabla')).to.throw();
    });
    it('should get and assert current scene from latest response', async function () {
        initLatestResponse();
        chai_1.assert.equal(test.getScene(), 'Welcome');
        chai_1.expect(() => test.assertScene('Welcome')).not.to.throw();
        chai_1.expect(() => test.assertScene('BAD_SCENE_NAME')).to.throw();
    });
    it('should get and assert session parameters from latest response', async function () {
        initLatestResponse();
        chai_1.assert.equal(test.getSessionParam('categoryType'), 'cats');
        chai_1.expect(() => test.assertSessionParam('categoryType', 'cats')).not.to.throw();
        chai_1.expect(() => test.assertSessionParam('factsNumber', 1)).not.to.throw();
        chai_1.expect(() => test.assertSessionParam('currentFactsData', {
            title: 'Fact fake title',
        })).not.to.throw();
        chai_1.expect(() => test.assertSessionParam('categoryType', 'bad')).to.throw();
        chai_1.expect(() => test.assertSessionParam('factsNumber', 10)).to.throw();
        chai_1.expect(() => test.assertSessionParam('missingKey', 'bad')).to.throw();
        chai_1.expect(() => test.assertSessionParam('currentFactsData', {
            title: 'Wrong title',
        })).to.throw();
        chai_1.expect(() => test.assertSessionParam('currentFactsData', {
            'bad key': 'Wrong title',
        })).to.throw();
    });
    it('should get and assert user parameters from latest response', async function () {
        initLatestResponse();
        chai_1.assert.equal(test.getUserParam('userCategoryType'), 'cats');
        chai_1.expect(() => test.assertUserParam('userCategoryType', 'cats')).not.to.throw();
        chai_1.expect(() => test.assertUserParam('userFactsNumber', 1)).not.to.throw();
        chai_1.expect(() => test.assertUserParam('userCategoryType', 'bad')).to.throw();
        chai_1.expect(() => test.assertUserParam('userFactsNumber', 10)).to.throw();
        chai_1.expect(() => test.assertUserParam('missingKey', 'bad')).to.throw();
    });
    it('should get home parameters from latest response', async () => {
        initLatestResponse();
        chai_1.assert.equal(test.getHomeParam('homeStorageParam'), 'home param value');
        chai_1.expect(() => test.assertHomeParam('homeStorageParam', 'home param value')).not.to.throw();
        chai_1.expect(() => test.assertHomeParam('homeStorageParam', 'bad')).to.throw();
        chai_1.expect(() => test.assertHomeParam('missingKey', 'bad')).to.throw();
    });
    it('should get and assert content from latest response', async () => {
        initLatestResponse();
        const content = { card: test_data_1.EXAMPLE_CARD };
        updatedResponseContent(test.latestResponse, content);
        chai_1.assert.equal(test.getContent(), content);
    });
    it('should get and assert prompt from latest response', async () => {
        initLatestResponse();
        const prompt = {
            firstSimple: {
                speech: 'Welcome to Facts about Google! What type of facts would you like to hear?',
                text: 'Welcome to Facts about Google! What type of facts would you like to hear?',
            },
            suggestions: [{ title: 'Headquarters' }, { title: 'History' }],
        };
        test.latestResponse.output.actionsBuilderPrompt = prompt;
        chai_1.assert.equal(test.getPrompt(), prompt);
        chai_1.expect(() => test.assertPrompt({
            firstSimple: {
                speech: 'Welcome to Facts about Google! What type of facts would you like to hear?',
                text: 'Welcome to Facts about Google! What type of facts would you like to hear?',
            },
        })).not.to.throw();
        chai_1.expect(() => test.assertPrompt(prompt)).not.to.throw();
        chai_1.expect(() => test.assertPrompt(prompt, true)).not.to.throw();
    });
    it('should get and assert suggestions from latest response', async () => {
        initLatestResponse();
        chai_1.assert.deepEqual(test.getSuggestions(), test_data_1.EXAMPLE_SUGGESTIONS);
        chai_1.expect(() => test.assertSuggestions(test_data_1.EXAMPLE_SUGGESTIONS, true)).not.to.throw();
        chai_1.expect(() => test.assertSuggestions(test_data_1.EXAMPLE_SUGGESTIONS)).not.to.throw();
        chai_1.expect(() => test.assertSuggestions([{ title: 'Headquarters' }])).to.throw();
    });
    it('should get and assert card from latest response', async () => {
        initLatestResponse();
        updatedResponseContent(test.latestResponse, { card: test_data_1.EXAMPLE_CARD });
        chai_1.assert.equal(test.getCard(), test_data_1.EXAMPLE_CARD);
        chai_1.expect(() => test.assertCard(test_data_1.EXAMPLE_CARD)).not.to.throw();
        chai_1.expect(() => test.assertCard(test_data_1.EXAMPLE_CARD, true)).not.to.throw();
        chai_1.expect(() => test.assertCard({ title: 'Card Title' })).not.to.throw();
        chai_1.expect(() => test.assertCard({ image: test_data_1.EXAMPLE_IMAGE })).not.to.throw();
        chai_1.expect(() => test.assertCard({ title: 'Card Title' }, true)).to.throw();
        chai_1.expect(() => test.assertCard({ title: 'Bad Card Title' })).to.throw();
    });
    it('should get and assert image from latest response', async () => {
        initLatestResponse();
        updatedResponseContent(test.latestResponse, { image: test_data_1.EXAMPLE_IMAGE });
        chai_1.assert.equal(test.getImage(), test_data_1.EXAMPLE_IMAGE);
        chai_1.expect(() => test.assertImage(test_data_1.EXAMPLE_IMAGE)).not.to.throw();
        chai_1.expect(() => test.assertImage(test_data_1.EXAMPLE_IMAGE, true)).not.to.throw();
        chai_1.expect(() => test.assertImage({ url: test_data_1.EXAMPLE_IMAGE.url })).not.to.throw();
        chai_1.expect(() => test.assertImage({ url: test_data_1.EXAMPLE_IMAGE.url }, true)).to.throw();
        chai_1.expect(() => test.assertImage({ url: 'Bad URL' })).to.throw();
    });
    it('should get and assert list from latest response', async () => {
        initLatestResponse();
        updatedResponseContent(test.latestResponse, { list: test_data_1.EXAMPLE_LIST });
        chai_1.assert.equal(test.getList(), test_data_1.EXAMPLE_LIST);
        chai_1.expect(() => test.assertList(test_data_1.EXAMPLE_LIST)).not.to.throw();
        chai_1.expect(() => test.assertList(test_data_1.EXAMPLE_LIST, true)).not.to.throw();
        chai_1.expect(() => test.assertList({ title: test_data_1.EXAMPLE_LIST.title })).not.to.throw();
        chai_1.expect(() => test.assertList({ title: test_data_1.EXAMPLE_LIST.title }, true)).to.throw();
        chai_1.expect(() => test.assertList({ title: 'Bad List Title' })).to.throw();
    });
    it('should get and assert collection from latest response', async () => {
        initLatestResponse();
        updatedResponseContent(test.latestResponse, {
            collection: test_data_1.EXAMPLE_COLLECTION,
        });
        chai_1.assert.equal(test.getCollection(), test_data_1.EXAMPLE_COLLECTION);
        chai_1.expect(() => test.assertCollection(test_data_1.EXAMPLE_COLLECTION)).not.to.throw();
        chai_1.expect(() => test.assertCollection(test_data_1.EXAMPLE_COLLECTION, true)).not.to.throw();
        chai_1.expect(() => test.assertCollection({
            title: test_data_1.EXAMPLE_COLLECTION.title,
        })).not.to.throw();
        chai_1.expect(() => test.assertCollection({ title: test_data_1.EXAMPLE_COLLECTION.title }, true)).to.throw();
        chai_1.expect(() => test.assertCollection({
            title: 'Bad Collection Title',
        })).to.throw();
    });
    it('should get and assert table from latest response', async () => {
        initLatestResponse();
        updatedResponseContent(test.latestResponse, { table: test_data_1.EXAMPLE_TABLE });
        chai_1.assert.equal(test.getTable(), test_data_1.EXAMPLE_TABLE);
        chai_1.expect(() => test.assertTable(test_data_1.EXAMPLE_TABLE)).not.to.throw();
        chai_1.expect(() => test.assertTable(test_data_1.EXAMPLE_TABLE, true)).not.to.throw();
        chai_1.expect(() => test.assertTable({
            title: test_data_1.EXAMPLE_TABLE.title,
        })).not.to.throw();
        chai_1.expect(() => test.assertTable({ title: test_data_1.EXAMPLE_TABLE.title }, true)).to.throw();
        chai_1.expect(() => test.assertTable({ title: 'Bad Table Title' })).to.throw();
    });
    it('should get and assert media from latest response', async () => {
        initLatestResponse();
        updatedResponseContent(test.latestResponse, { media: test_data_1.EXAMPLE_MEDIA });
        chai_1.assert.equal(test.getMedia(), test_data_1.EXAMPLE_MEDIA);
        chai_1.expect(() => test.assertMedia(test_data_1.EXAMPLE_MEDIA)).not.to.throw();
        chai_1.expect(() => test.assertMedia(test_data_1.EXAMPLE_MEDIA, true)).not.to.throw();
        chai_1.expect(() => test.assertMedia({
            mediaType: test_data_1.EXAMPLE_MEDIA.mediaType,
        })).not.to.throw();
        chai_1.expect(() => test.assertMedia({ mediaType: test_data_1.EXAMPLE_MEDIA.mediaType }, true)).to.throw();
        chai_1.expect(() => test.assertMedia({ mediaType: 'MEDIA_STATUS_ACK' })).to.throw();
    });
    it('should get and assert canvas data from latest response', async () => {
        initLatestResponse();
        test.latestResponse.output.canvas = test_data_1.EXAMPLE_CANVAS;
        chai_1.assert.equal(test.getCanvasData(), test_data_1.EXAMPLE_CANVAS.data);
        chai_1.expect(() => test.assertCanvasData(test_data_1.EXAMPLE_CANVAS.data)).not.to.throw();
        chai_1.expect(() => test.assertCanvasData(test_data_1.EXAMPLE_CANVAS.data, true)).not.to.throw();
        chai_1.expect(() => test.assertCanvasData([{ elem1Key1: 'value' }, {}])).not.to.throw();
        chai_1.expect(() => test.assertCanvasData([{ elem1Key1: 'value' }, { elem2Key1: 'value2' }])).not.to.throw();
        chai_1.expect(() => test.assertCanvasData([{ elem1Key1: 'value' }], true)).to.throw();
        chai_1.expect(() => test.assertCanvasData([{ elem1Key1: 'bad value' }, { elem2Key1: 'value2' }])).to.throw();
        chai_1.expect(() => test.assertCanvasData([{ wrong: 'Bad value' }])).to.throw();
    });
    it('should get and assert canvas url from latest response', async () => {
        initLatestResponse();
        test.latestResponse.output.canvas = test_data_1.EXAMPLE_CANVAS;
        chai_1.expect(() => test.assertCanvasURL(test_data_1.EXAMPLE_CANVAS.url)).not.to.throw();
        chai_1.assert.equal(test.getCanvasURL(), test_data_1.EXAMPLE_CANVAS.url);
        chai_1.expect(() => test.assertCanvasURL(test_data_1.EXAMPLE_CANVAS.url)).not.to.throw();
        chai_1.expect(() => test.assertCanvasURL('bad_url')).to.throw();
    });
    it('should detect when a conversation has not ended', async () => {
        initLatestResponse();
        chai_1.assert.equal(test.getIsConversationEnded(), false);
        chai_1.expect(() => test.assertConversationNotEnded()).not.to.throw();
        chai_1.expect(() => test.assertConversationEnded()).to.throw();
    });
    it('should detect when a conversation has ended', async () => {
        initLatestResponse();
        test.latestResponse.diagnostics.actionsBuilderEvents.slice(-1)[0].endConversation = true;
        chai_1.assert.equal(test.getIsConversationEnded(), true);
        chai_1.expect(() => test.assertConversationEnded()).not.to.throw();
        chai_1.expect(() => test.assertConversationNotEnded()).to.throw();
    });
});
//# sourceMappingURL=test.js.map