declare module '@ankhorage/color-theory/culori' {
  interface OklchColor {
    readonly mode: 'oklch';
    readonly l: number;
    readonly c: number;
    readonly h?: number;
  }

  export function converter(mode: 'oklch'): (color: string) => OklchColor | undefined;
  export function formatHex(color: OklchColor): string | undefined;
}
