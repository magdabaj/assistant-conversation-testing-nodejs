"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EXAMPLE_CANVAS = exports.EXAMPLE_MEDIA = exports.EXAMPLE_TABLE = exports.EXAMPLE_COLLECTION = exports.EXAMPLE_LIST = exports.EXAMPLE_CARD = exports.EXAMPLE_IMAGE = exports.EXAMPLE_SUGGESTIONS = void 0;
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
 * @fileoverview Test data used by the library unit tests.
 */
const actions_1 = require("@assistant/actions");
/** Example Suggestions. */
exports.EXAMPLE_SUGGESTIONS = [
    { title: 'Headquarters' },
    { title: 'History' },
];
/** Example Image. */
exports.EXAMPLE_IMAGE = {
    url: 'https://developers.google.com/assistant/assistant_96.png',
    alt: 'Google Assistant logo',
};
/** Example Card. */
exports.EXAMPLE_CARD = {
    title: 'Card Title',
    subtitle: 'Card Subtitle',
    text: 'Card Content',
    image: exports.EXAMPLE_IMAGE,
};
/** Example List. */
exports.EXAMPLE_LIST = {
    title: 'List title',
    subtitle: 'List subtitle',
    items: [{ key: 'ITEM_1' }, { key: 'ITEM_2' }, { key: 'ITEM_3' }, { key: 'ITEM_4' }],
};
/** Example Collection. */
exports.EXAMPLE_COLLECTION = {
    title: 'Collection Title',
    subtitle: 'Collection subtitle',
    items: [{ key: 'ITEM_1' }, { key: 'ITEM_2' }, { key: 'ITEM_3' }, { key: 'ITEM_4' }],
};
/** Example Table. */
exports.EXAMPLE_TABLE = {
    title: 'Table Title',
    subtitle: 'Table Subtitle',
    image: exports.EXAMPLE_IMAGE,
    columns: [{ header: 'Column A' }, { header: 'Column B' }, { header: 'Column C' }],
    rows: [
        { cells: [{ text: 'A1' }, { text: 'B1' }, { text: 'C1' }] },
        { cells: [{ text: 'A2' }, { text: 'B2' }, { text: 'C2' }] },
        { cells: [{ text: 'A3' }, { text: 'B3' }, { text: 'C3' }] },
    ],
};
/** Example Media Card. */
exports.EXAMPLE_MEDIA = {
    optionalMediaControls: [
        actions_1.protos.google.actions.sdk.v2.conversation.Media.OptionalMediaControls
            .PAUSED,
        actions_1.protos.google.actions.sdk.v2.conversation.Media.OptionalMediaControls
            .STOPPED,
    ],
    mediaObjects: [
        {
            name: 'Media name',
            description: 'Media description',
            url: 'https://actions.google.com/sounds/v1/cartoon/cartoon_boing.ogg',
            image: { large: exports.EXAMPLE_IMAGE },
        },
    ],
    mediaType: 'AUDIO',
};
/** Example Canvas Response. */
exports.EXAMPLE_CANVAS = {
    url: 'https://canvas.url',
    data: [
        { elem1Key1: 'value', elem1Key2: 'value2' },
        { elem2Key1: 'value2' },
    ],
    suppressMic: true,
};
//# sourceMappingURL=test-data.js.map