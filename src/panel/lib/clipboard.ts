export function copyToClipboard(text: string): boolean {
  // navigator.clipboard is blocked in DevTools panel context by Chrome's
  // permissions policy, so we use execCommand which works reliably here.
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand("copy");
    return true;
  } catch {
    return false;
  } finally {
    document.body.removeChild(textarea);
  }
}
