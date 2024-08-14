/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

export type DivProps = React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
>

export type FormProps = React.DetailedHTMLProps<
    React.FormHTMLAttributes<HTMLFormElement>,
    HTMLFormElement
>

export type UlProps = React.HTMLAttributes<HTMLUListElement>

type PrimitiveType = number | string | boolean

/** Object types that should never be mapped */
type AtomicObject = Function | Promise<any> | Date | RegExp

/**
 * If the lib "ES2015.Collection" is not included in tsconfig.json,
 * types like ReadonlyArray, WeakMap etc. fall back to `any` (specified nowhere)
 * or `{}` (from the node types), in both cases entering an infinite recursion in
 * pattern matching type mappings
 * This type can be used to cast these types to `void` in these cases.
 */
export type IfAvailable<T, Fallback = void> =
    // fallback if any
    true | false extends (T extends never ? true : false)
        ? Fallback // fallback if empty type
        : keyof T extends never
          ? Fallback // original type
          : T

/**
 * These should also never be mapped but must be tested after regular Map and
 * Set
 */
type WeakReferences = IfAvailable<WeakMap<any, any>> | IfAvailable<WeakSet<any>>

/** Convert a mutable type into a readonly type */
export type Immutable<T> = T extends PrimitiveType
    ? T
    : T extends AtomicObject
      ? T
      : T extends ReadonlyMap<infer K, infer V> // Map extends ReadonlyMap
        ? ReadonlyMap<Immutable<K>, Immutable<V>>
        : T extends ReadonlySet<infer V> // Set extends ReadonlySet
          ? ReadonlySet<Immutable<V>>
          : T extends WeakReferences
            ? T
            : T extends object
              ? { readonly [K in keyof T]: Immutable<T[K]> }
              : T
