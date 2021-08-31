"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UNCHANGED_SCENE = exports.TOKEN_FIELD_NAME = exports.DEFAULT_INTERACTION_SETTING = exports.DEFAULT_TIMEZONE = exports.DEFAULT_LOCATION_LAT = exports.DEFAULT_LOCATION_LONG = exports.DEFAULT_INPUT_TYPE = exports.DEFAULT_SURFACE = exports.DEFAULT_LOCALE = exports.FALLBACK_LOCALES = exports.SUPPORTED_LOCALES = void 0;
/**
 * List of supported action locales by the library, which does not require
 * fallback.
 */
exports.SUPPORTED_LOCALES = [
    'en-US',
    'fr-FR',
    'ja-JP',
    'de-DE',
    'ko-KR',
    'es-ES',
    'pt-BR',
    'it-IT',
    'ru-RU',
    'hi-IN',
    'th-TH',
    'id-ID',
    'da-DK',
    'no-NO',
    'nl-NL',
    'sv-SE',
    'tr-TR',
    'pl-PL',
    'zh-HK',
    'zh-TW',
];
/** Fallback locales mapping for i18n configuration. */
exports.FALLBACK_LOCALES = {
    'en-GB': 'en-US',
    'en-AU': 'en-US',
    'en-SG': 'en-US',
    'en-CA': 'en-US',
    'en-IN': 'en-US',
    'en-BE': 'en-US',
    'fr-CA': 'fr-FR',
    'fr-BE': 'fr-FR',
    'es-419': 'es-ES',
    'nl-BE': 'nl-NL',
    'de-AT': 'de-DE',
    'de-CH': 'de-DE',
    'de-BE': 'de-DE',
};
/** The default library locale. */
exports.DEFAULT_LOCALE = exports.SUPPORTED_LOCALES[0];
/** The default library surface. */
exports.DEFAULT_SURFACE = 'PHONE';
/** The default library user input type. */
exports.DEFAULT_INPUT_TYPE = 'VOICE';
/** The default library longitude. */
exports.DEFAULT_LOCATION_LONG = 37.422;
/** The default library latitude . */
exports.DEFAULT_LOCATION_LAT = -122.084;
/** The default library timezone. */
exports.DEFAULT_TIMEZONE = 'America/Los_Angeles';
/** The library's interaction defaults. */
exports.DEFAULT_INTERACTION_SETTING = {
    input: {
        type: exports.DEFAULT_INPUT_TYPE,
    },
    deviceProperties: {
        locale: exports.DEFAULT_LOCALE,
        surface: exports.DEFAULT_SURFACE,
        timeZone: exports.DEFAULT_TIMEZONE,
        location: {
            coordinates: {
                latitude: exports.DEFAULT_LOCATION_LAT,
                longitude: exports.DEFAULT_LOCATION_LONG,
            },
        },
    },
};
/** Conversation token field name. */
exports.TOKEN_FIELD_NAME = 'conversationToken';
/**
 * Returned scene name string, incase the scene did not change in the last
 * dialog turn.
 */
exports.UNCHANGED_SCENE = '_UNCHANGED_';
//# sourceMappingURL=constants.js.map