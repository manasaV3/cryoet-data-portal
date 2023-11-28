/**
 * This module contains typing information for accessing i18n resources. This is
 * what allows us to provide static typing and autocomplete for i18n keys.
 *
 * This works by using type imports to import the type of the i18n JSON files
 * since TypeScript has support for importing JSON with full type information.
 * This allows us to pass the information to `react-i18next` so that the i18n
 * keys can be generated "dynamically" using type inference.
 *
 * When adding a new namespace file, you'll need to do the following things:
 *
 * 1. Create a new namespace JSON file in the English locale directory.
 * 2. Import the JSON file type.
 * 3. Add the JSON file type to the `I18nResources` object in
 *    `src/constants/i18n.ts` with the key matching the base filename.
 * 4. Add the namespace to the namespace array used by the
 *    `serverSideTranslations()` function for each page that uses the locale.
 */

import type { KeyPrefix } from 'i18next'

import translation from '../../public/locales/en/translation.json'

/**
 * Dictionary of all i18n resources. This is used for generating type
 * information and providing mock i18n data for unit testing.
 */
const I18nResources = {
  translation,
}

/**
 * Type for all i18n resources. This is used for generating type
 * information for `react-i18next`. The key is an i18n namespace and should
 * match the name of the base filename.
 */
export type I18nResourceMap = typeof I18nResources

/**
 * Type for all i18n namespace string keys.
 */
export type I18nNamespace = keyof typeof I18nResources

/**
 * Ambient module declaration responsible for passing the `I18nResourceMap` type
 * to `i18next` to generate type information for i18n keys.
 * https://react.i18next.com/latest/typescript
 */
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'en'
    resources: I18nResourceMap
  }
}

export type I18nKeys = KeyPrefix<I18nNamespace>
