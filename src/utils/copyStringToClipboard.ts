export default async function copyStringToClipboard(
  text: string
): Promise<boolean> {
  if (!navigator.clipboard) {
    return fallbackCopyStringToClipboard(text);
  }

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (er) {
    return false;
  }
}

function fallbackCopyStringToClipboard(text: string): boolean {
  const textArea = document.createElement("textarea");
  textArea.value = text;

  // Avoid scrolling to bottom
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    document.execCommand("copy");
    document.body.removeChild(textArea);
    return true;
  } catch (err) {
    document.body.removeChild(textArea);
    return false;
  }
}
