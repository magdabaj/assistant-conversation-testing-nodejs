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
 * @fileoverview Implementation of API calls to the Actions API.
 */
import { protos, v2 } from '@assistant/actions';
/** The ActionsApiHelper config. */
export interface ActionsApiHelperConfig {
    /** the tested project ID. */
    projectId: string;
    /** optional custom actions API endpoint. */
    actionsApiCustomEndpoint?: string;
}
/**
 * A class that implements API calls for Actions API.
 */
export declare class ActionsApiHelper {
    projectId: string;
    actionsSdkClient: v2.ActionsSdkClient;
    actionsTestingClient: v2.ActionsTestingClient;
    constructor({ projectId, actionsApiCustomEndpoint, }: ActionsApiHelperConfig);
    /** Calls the 'sendInteraction' API method. */
    sendInteraction(interactionData: protos.google.actions.sdk.v2.ISendInteractionRequest): Promise<protos.google.actions.sdk.v2.ISendInteractionResponse>;
    /** Calls the 'matchIntents' API method. */
    matchIntents(matchIntentsData: protos.google.actions.sdk.v2.IMatchIntentsRequest): Promise<protos.google.actions.sdk.v2.IMatchIntentsResponse>;
    /** Calls the 'writePreview' API method from draft. */
    writePreviewFromDraft(): Promise<void>;
    /** Calls the 'writePreview' API method from submitted version number. */
    writePreviewFromVersion(versionNumber: number): Promise<void>;
    /** Calls the 'writePreview' API method given a write preview request. */
    private _writePreview;
    /** Gets a resonse promise and callback for a stream request. */
    private _getStreamResponsePromise;
}
