"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionsApiHelper = void 0;
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
/* eslint-disable  @typescript-eslint/no-explicit-any */
/**
 * @fileoverview Implementation of API calls to the Actions API.
 */
const actions_1 = require("@assistant/actions");
const ACTIONS_API_PROD_ENDPOINT = 'actions.googleapis.com';
/**
 * A class that implements API calls for Actions API.
 */
class ActionsApiHelper {
    constructor({ projectId, actionsApiCustomEndpoint = ACTIONS_API_PROD_ENDPOINT, }) {
        this.projectId = projectId;
        const options = {
            projectId,
            apiEndpoint: actionsApiCustomEndpoint,
        };
        this.actionsSdkClient = new actions_1.v2.ActionsSdkClient(options);
        this.actionsTestingClient = new actions_1.v2.ActionsTestingClient(options);
    }
    /** Calls the 'sendInteraction' API method. */
    async sendInteraction(interactionData) {
        try {
            interactionData.project = `projects/${this.projectId}`;
            const res = await this.actionsTestingClient.sendInteraction(interactionData);
            return res[0];
        }
        catch (err) {
            throw new Error(`sendInteraction API call failed: ${err}`);
        }
    }
    /** Calls the 'matchIntents' API method. */
    async matchIntents(matchIntentsData) {
        try {
            matchIntentsData.project = `projects/${this.projectId}`;
            const res = await this.actionsTestingClient.matchIntents(matchIntentsData);
            return res[0];
        }
        catch (err) {
            throw new Error(`matchIntents API call failed: ${err}`);
        }
    }
    /** Calls the 'writePreview' API method from draft. */
    async writePreviewFromDraft() {
        await this._writePreview({
            parent: `projects/${this.projectId}`,
            previewSettings: { sandbox: { value: true } },
            draft: {},
        });
    }
    /** Calls the 'writePreview' API method from submitted version number. */
    async writePreviewFromVersion(versionNumber) {
        await this._writePreview({
            parent: `projects/${this.projectId}`,
            previewSettings: { sandbox: { value: true } },
            submittedVersion: {
                version: `projects/${this.projectId}/versions/${versionNumber}`,
            },
        });
    }
    /** Calls the 'writePreview' API method given a write preview request. */
    _writePreview(request) {
        const [responsePromise, responseCallback,] = this._getStreamResponsePromise();
        const writePreviewStream = this.actionsSdkClient.writePreview(responseCallback);
        writePreviewStream.write(request);
        writePreviewStream.end();
        return responsePromise;
    }
    /** Gets a resonse promise and callback for a stream request. */
    _getStreamResponsePromise() {
        let writeSuccess, writeFailure;
        const responsePromise = new Promise((resolve, reject) => {
            writeSuccess = resolve;
            writeFailure = reject;
        });
        const responseCallback = (err, resp) => {
            !err ? writeSuccess(resp) : writeFailure(err);
        };
        return [responsePromise, responseCallback];
    }
}
exports.ActionsApiHelper = ActionsApiHelper;
//# sourceMappingURL=actions-api-helper.js.map