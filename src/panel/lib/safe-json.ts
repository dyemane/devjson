/**
 * Safe JSON parser that preserves numeric precision.
 *
 * Standard JSON.parse converts all numbers to IEEE 754 doubles, which silently
 * loses precision for integers > Number.MAX_SAFE_INTEGER (2^53 - 1). This is a
 * real problem for financial APIs, Snowflake IDs, Twitter/Discord IDs, etc.
 *
 * Strategy: Use a regex-based pre-pass to wrap unsafe integers in a tagged
 * string, then parse normally. The tree renderer detects the tag and displays
 * the original value with a visual indicator.
 */

/** Sentinel prefix for numbers that exceed safe integer range.
 *  Uses a Unicode private-use-area char to avoid collisions with real data. */
export const BIGINT_PREFIX = "\uE000BIGINT:";

/**
 * Matches JSON number literals that are unsafe integers.
 * An unsafe integer is one that:
 *  - Has no decimal point or exponent (i.e. is an integer)
 *  - Has absolute value > Number.MAX_SAFE_INTEGER (9007199254740991)
 *
 * The regex matches number values in JSON context (after : or [ or , or start).
 */
const UNSAFE_INT_RE = /(?<=[:,\[]\s*)-?\d{16,}(?=\s*[,\]\}])|(?<=[:,\[]\s*)-?\d{16,}(?=\s*$)/g;

/**
 * Parse JSON with large integer preservation.
 * Numbers with more than 15 significant digits that are integers get
 * wrapped in a sentinel string so the original text is preserved.
 */
export function safeJsonParse(text: string): unknown {
  // Pre-process: find integer literals that might lose precision
  const processed = text.replace(
    // Match integer number tokens in JSON (no dot, no exponent)
    // This regex handles the JSON grammar for number tokens
    /(?<=[:\[,\s]|^)(-?\d{16,})(?=[,\]\}\s]|$)/gm,
    (match) => {
      // Only wrap if the integer is actually unsafe
      const n = Number(match);
      if (!Number.isSafeInteger(n)) {
        return `"${BIGINT_PREFIX}${match}"`;
      }
      return match;
    },
  );

  return JSON.parse(processed);
}

/** Check if a parsed value is a wrapped BigInt string */
export function isBigIntValue(value: unknown): value is string {
  return typeof value === "string" && value.startsWith(BIGINT_PREFIX);
}

/** Get the original numeric string from a wrapped BigInt value */
export function unwrapBigInt(value: string): string {
  return value.slice(BIGINT_PREFIX.length);
}
