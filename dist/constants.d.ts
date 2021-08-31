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
 * @fileoverview Used to store export constant values / default config values
 */
import { protos } from '@assistant/actions';
/**
 * List of supported action locales by the library, which does not require
 * fallback.
 */
export declare const SUPPORTED_LOCALES: string[];
/** Fallback locales mapping for i18n configuration. */
export declare const FALLBACK_LOCALES: {
    'en-GB': string;
    'en-AU': string;
    'en-SG': string;
    'en-CA': string;
    'en-IN': string;
    'en-BE': string;
    'fr-CA': string;
    'fr-BE': string;
    'es-419': string;
    'nl-BE': string;
    'de-AT': string;
    'de-CH': string;
    'de-BE': string;
};
/** The default library locale. */
export declare const DEFAULT_LOCALE: string;
/** The default library surface. */
export declare const DEFAULT_SURFACE = "PHONE";
/** The default library user input type. */
export declare const DEFAULT_INPUT_TYPE = "VOICE";
/** The default library longitude. */
export declare const DEFAULT_LOCATION_LONG = 37.422;
/** The default library latitude . */
export declare const DEFAULT_LOCATION_LAT = -122.084;
/** The default library timezone. */
export declare const DEFAULT_TIMEZONE = "America/Los_Angeles";
/** The library's interaction defaults. */
export declare const DEFAULT_INTERACTION_SETTING: protos.google.actions.sdk.v2.ISendInteractionRequest;
/** Conversation token field name. */
export declare const TOKEN_FIELD_NAME = "conversationToken";
/**
 * Returned scene name string, incase the scene did not change in the last
 * dialog turn.
 */
export declare const UNCHANGED_SCENE = "_UNCHANGED_";
