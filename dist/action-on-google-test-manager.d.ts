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
 */
/**
 * @fileoverview Implementation of test handler around the Actions API, used to
 * setup and conveniently create tests.
 */
import { protos } from '@assistant/actions';
import { ActionsApiHelper } from './actions-api-helper';
/** Map that controls the assert's comparing mode. */
interface AssertValueArgs {
    /** Whether an exact match is expected. Default is false. */
    isExact?: boolean;
    /** Whether to do a regexp match. Default is false. */
    isRegexp?: boolean;
}
/** Test suite configuration interface. */
export interface TestSuiteConfig {
    /** the tested project ID. */
    projectId: string;
    /** optional override of the suite default interaction params. */
    interactionParams?: protos.google.actions.sdk.v2.ISendInteractionRequest;
    /** optional custom actions API endpoint. */
    actionsApiCustomEndpoint?: string;
}
/**
 * A class implementing a testing framework wrapping manager class.
 */
export declare class ActionsOnGoogleTestManager {
    actionsApiHelper: ActionsApiHelper;
    latestResponse: protos.google.actions.sdk.v2.ISendInteractionResponse | null;
    suiteInteractionDefaults: protos.google.actions.sdk.v2.ISendInteractionRequest;
    testInteractionDefaults: protos.google.actions.sdk.v2.ISendInteractionRequest;
    lastUserQuery: string | null | undefined;
    /**
     * Sets up all the needed objects and settings of a Suite.
     */
    constructor({ projectId, interactionParams, actionsApiCustomEndpoint, }: TestSuiteConfig);
    /**
     * Cleans up the test scenario temporary artifacts. Should run after each
     * test scenario.
     */
    cleanUpAfterTest(): void;
    /** Send a query to your action */
    sendQuery(queryText: string): Promise<protos.google.actions.sdk.v2.ISendInteractionResponse>;
    /** Send an interaction object to your action  */
    sendInteraction(interactionParams: protos.google.actions.sdk.v2.ISendInteractionRequest): Promise<protos.google.actions.sdk.v2.ISendInteractionResponse>;
    /** Send a 'stop' query, to stop/exit the action. */
    sendStop(): Promise<protos.google.actions.sdk.v2.ISendInteractionResponse>;
    /** Calls the 'writePreview' API method from draft. */
    writePreviewFromDraft(): Promise<void>;
    /** Calls the 'writePreview' API method from submitted version number. */
    writePreviewFromVersion(versionNumber: number): Promise<void>;
    /** Overrides the suite interaction defaults. */
    setSuiteInteractionDefaults(interactionParams: protos.google.actions.sdk.v2.ISendInteractionRequest): void;
    /** Updates the suite interaction defaults. */
    updateSuiteInteractionDefaults(interactionParams: protos.google.actions.sdk.v2.ISendInteractionRequest): void;
    /** Sets the default locale for the suite. */
    setSuiteLocale(locale: string): void;
    /** Sets the default surface for the suite. */
    setSuiteSurface(surface: string): void;
    /**
     * Sets the default locale for the current test scenario. Only needed for
     * tests that are for different locales from the suite locale.
     */
    setTestLocale(locale: string): void;
    /**
     * Sets the default surface for the current test scenario. Only needed for
     * tests that are for different surface from the suite surface.
     */
    setTestSurface(surface: string): void;
    /** Overrides the test scenario interaction defaults. */
    setTestInteractionDefaults(interactionParams: protos.google.actions.sdk.v2.ISendInteractionRequest): void;
    /** Updates the test scenario interaction defaults. */
    updateTestInteractionDefaults(interactionParams: protos.google.actions.sdk.v2.ISendInteractionRequest): void;
    /** Returns the test scenario interaction defaults. */
    getTestInteractionMergedDefaults(): protos.google.actions.sdk.v2.ISendInteractionRequest;
    /**
     * Asserts the response Speech (concatenation of the first_simple and
     * last_simple Speech)
     */
    assertSpeech(expected: string | string[], assertParams?: AssertValueArgs, response?: protos.google.actions.sdk.v2.ISendInteractionResponse): void;
    /**
     * Asserts the response Text (concatenation of the first_simple and
     * last_simple Text)
     */
    assertText(expected: string | string[], assertParams?: AssertValueArgs, response?: protos.google.actions.sdk.v2.ISendInteractionResponse): void;
    /** Asserts the response's Intent. */
    assertIntent(expected: string, response?: protos.google.actions.sdk.v2.ISendInteractionResponse): void;
    /** Asserts a response's Intent Parameter value. */
    assertIntentParameter(parameterName: string, expected: any, response?: protos.google.actions.sdk.v2.ISendInteractionResponse): void;
    /** Asserts the response's Last Scene. */
    assertScene(expected: string, response?: protos.google.actions.sdk.v2.ISendInteractionResponse): void;
    /** Asserts the prompt response. */
    assertPrompt(expected: protos.google.actions.sdk.v2.conversation.IPrompt, requireExact?: boolean, response?: protos.google.actions.sdk.v2.ISendInteractionResponse): void;
    /** Asserts the Suggestion Chips. */
    assertSuggestions(expected: protos.google.actions.sdk.v2.conversation.ISuggestion[], requireExact?: boolean, response?: protos.google.actions.sdk.v2.ISendInteractionResponse): void;
    /** Asserts the Canvas URL. */
    assertCanvasURL(expected: string | undefined | null, response?: protos.google.actions.sdk.v2.ISendInteractionResponse): void;
    /** Asserts the Canvas Data. */
    assertCanvasData(expected: any[], requireExact?: boolean, response?: protos.google.actions.sdk.v2.ISendInteractionResponse): void;
    /** Asserts that the conversation ended, based on the response. */
    assertConversationEnded(response?: protos.google.actions.sdk.v2.ISendInteractionResponse): void;
    /** Asserts that the conversation did not end, based on the response. */
    assertConversationNotEnded(response?: protos.google.actions.sdk.v2.ISendInteractionResponse): void;
    /**
     * Asserts the session storage parameter value, in the given response.
     */
    assertSessionParam(name: string, expected: any, response?: protos.google.actions.sdk.v2.ISendInteractionResponse): void;
    /**
     * Asserts the user storage parameter value, in the given response.
     */
    assertUserParam(name: string, expected: any, response?: protos.google.actions.sdk.v2.ISendInteractionResponse): void;
    /**
     * Asserts the home storage parameter value, in the given response.
     */
    assertHomeParam(name: string, expected: any, response?: protos.google.actions.sdk.v2.ISendInteractionResponse): void;
    /** Asserts the Card response. */
    assertCard(expected: protos.google.actions.sdk.v2.conversation.ICard, requireExact?: boolean, response?: protos.google.actions.sdk.v2.ISendInteractionResponse): void;
    /** Asserts the Media response. */
    assertMedia(expected: protos.google.actions.sdk.v2.conversation.IMedia, requireExact?: boolean, response?: protos.google.actions.sdk.v2.ISendInteractionResponse): void;
    /** Asserts the Collection response. */
    assertCollection(expected: protos.google.actions.sdk.v2.conversation.ICollection, requireExact?: boolean, response?: protos.google.actions.sdk.v2.ISendInteractionResponse): void;
    /** Asserts the Image response. */
    assertImage(expected: protos.google.actions.sdk.v2.conversation.IImage, requireExact?: boolean, response?: protos.google.actions.sdk.v2.ISendInteractionResponse): void;
    /** Asserts the Table response. */
    assertTable(expected: protos.google.actions.sdk.v2.conversation.ITable, requireExact?: boolean, response?: protos.google.actions.sdk.v2.ISendInteractionResponse): void;
    /** Asserts the List response. */
    assertList(expected: protos.google.actions.sdk.v2.conversation.IList, requireExact?: boolean, response?: protos.google.actions.sdk.v2.ISendInteractionResponse): void;
    /**
     * Asserts the expected intents for the checked query using the matchIntents
     * API call.
     */
    assertTopMatchedIntent(query: string, expectedIntent: string, requiredPlace: number | undefined, queryLanguage: string): Promise<void>;
    /**
     * Asserts that all queries in YAML file matches the expected top matched
     * intent, checked by using the matchIntents API call.
     * Will fail if any of the queries did not match the expected intent.
     */
    assertMatchIntentsFromYamlFile(yamlFile: string, queriesLanguage?: string): Promise<void>;
    /** Gets the intents for the checked query using the matchIntents API call. */
    getMatchIntents(query: string, queryLanguage: string): Promise<protos.google.actions.sdk.v2.IMatchIntentsResponse>;
    /** Gets the matched intents' names using the matchIntents API call. */
    getMatchIntentsList(query: string, queryLanguage: string): Promise<string[]>;
    /** Gets the latest turn full response. */
    getLatestResponse(): protos.google.actions.sdk.v2.ISendInteractionResponse | null;
    /**
     * Gets the response Speech (concatenation of the first_simple and last_simple
     * Speech)
     */
    getSpeech(response?: protos.google.actions.sdk.v2.ISendInteractionResponse): string | undefined | null;
    /**
     * Gets the response Text (concatenation of the first_simple and last_simple
     * Text)
     */
    getText(response?: protos.google.actions.sdk.v2.ISendInteractionResponse): string | undefined | null;
    /** Gets the intent, from the response. */
    getIntent(response?: protos.google.actions.sdk.v2.ISendInteractionResponse): string;
    /** Gets the current intent parameter value, from the response. */
    getIntentParameter(parameterName: string, response?: protos.google.actions.sdk.v2.ISendInteractionResponse): any | null;
    /** Gets the last scene, from the response. */
    getScene(response?: protos.google.actions.sdk.v2.ISendInteractionResponse): string;
    /** Gets the Prompt. */
    getPrompt(response?: protos.google.actions.sdk.v2.ISendInteractionResponse): protos.google.actions.sdk.v2.conversation.IPrompt | undefined | null;
    /**
     * Gets the Canvas Data.
     */
    getSuggestions(response?: protos.google.actions.sdk.v2.ISendInteractionResponse): protos.google.actions.sdk.v2.conversation.ISuggestion[] | undefined | null;
    /** Gets the Prompt Content, if exists. */
    getContent(response?: protos.google.actions.sdk.v2.ISendInteractionResponse): protos.google.actions.sdk.v2.conversation.IContent | undefined | null;
    /** Gets the Card response, if exists. */
    getCard(response?: protos.google.actions.sdk.v2.ISendInteractionResponse): protos.google.actions.sdk.v2.conversation.ICard | undefined | null;
    /** Gets the Image response, if exists. */
    getImage(response?: protos.google.actions.sdk.v2.ISendInteractionResponse): protos.google.actions.sdk.v2.conversation.IImage | undefined | null;
    /** Gets the Table response, if exists. */
    getTable(response?: protos.google.actions.sdk.v2.ISendInteractionResponse): protos.google.actions.sdk.v2.conversation.ITable | undefined | null;
    /** Gets the Collection response, if exists. */
    getCollection(response?: protos.google.actions.sdk.v2.ISendInteractionResponse): protos.google.actions.sdk.v2.conversation.ICollection | undefined | null;
    /** Gets the List response, if exists. */
    getList(response?: protos.google.actions.sdk.v2.ISendInteractionResponse): protos.google.actions.sdk.v2.conversation.IList | undefined | null;
    /** Gets the Media response, if exists. */
    getMedia(response?: protos.google.actions.sdk.v2.ISendInteractionResponse): protos.google.actions.sdk.v2.conversation.IMedia | undefined | null;
    /** Returns whether the conversation ended, based on the response. */
    getIsConversationEnded(response?: protos.google.actions.sdk.v2.ISendInteractionResponse): boolean;
    /**
     * Returns the value of the session param from the response.
     */
    getSessionParam(name: string, response?: protos.google.actions.sdk.v2.ISendInteractionResponse): any;
    /**
     * Returns the value of the user param from the response.
     */
    getUserParam(name: string, response?: protos.google.actions.sdk.v2.ISendInteractionResponse): any;
    /**
     * Returns the value of the home (household) storage param from the response.
     */
    getHomeParam(name: string, response?: protos.google.actions.sdk.v2.ISendInteractionResponse): any;
    /**
     * Gets the Canvas URL from the response.
     */
    getCanvasURL(response?: protos.google.actions.sdk.v2.ISendInteractionResponse): string | undefined | null;
    /**
     * Gets the Canvas Data.
     */
    getCanvasData(response?: protos.google.actions.sdk.v2.ISendInteractionResponse): any[] | undefined | null;
    /** Gets the execution state. */
    private getExecutionState;
    /** Gets the latest ActionsBuilderEvent. */
    private getLatestActionsBuilderEvent;
    /** Returns the i18n value of the key. */
    private i18n;
    /** Updates the current locale for the i18n util functions. */
    private updateCurrentLocale;
    /**
     * Asserts the value matched the expected string or array of string.
     */
    private assertValueCommon;
    /** Throws an error with a given message. */
    throwError(errorStr: string): void;
    /** Gets the text of 'stop' query in the requested locale. */
    private getStopQuery;
    /** Gets top matched intent name from the MatchedIntent response. */
    private getTopMatchIntentFromMatchResponse;
    /** Validates that the response content is valid */
    private validateSendInteractionResponse;
}
export {};
