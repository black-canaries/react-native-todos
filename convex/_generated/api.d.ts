/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as init from "../init.js";
import type * as labelsMutation from "../labelsMutation.js";
import type * as labelsQuery from "../labelsQuery.js";
import type * as projectsMutation from "../projectsMutation.js";
import type * as projectsQuery from "../projectsQuery.js";
import type * as tasksMutation from "../tasksMutation.js";
import type * as tasksQuery from "../tasksQuery.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  init: typeof init;
  labelsMutation: typeof labelsMutation;
  labelsQuery: typeof labelsQuery;
  projectsMutation: typeof projectsMutation;
  projectsQuery: typeof projectsQuery;
  tasksMutation: typeof tasksMutation;
  tasksQuery: typeof tasksQuery;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
