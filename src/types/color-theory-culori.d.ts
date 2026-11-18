/*** Completes the published color-theory functional Culori subpath until its declaration bundle exposes Culori's public exports. */
export {};

declare module '@ankhorage/color-theory/culori/fn' {
  interface OklchColor {
    readonly mode: 'oklch';
    readonly l: number;
    readonly c: number;
    readonly h?: number;
  }

  export function converter(mode: 'oklch'): (color: string) => OklchColor | undefined;
  export function formatHex(color: OklchColor): string | undefined;
}
