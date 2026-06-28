import { saveAs } from "file-saver";

export default function download(
  locale: string,
  type: "CV"
): (e: React.MouseEvent) => void;

export default function download(
  locale: string,
  type: "CERTIFICATE",
  name: string
): (e: React.MouseEvent) => void;

export default function download(
  locale: string,
  type: "CV" | "CERTIFICATE",
  name?: string
) {
  return async (e: React.MouseEvent) => {
    e.preventDefault();

    const safeName = name?.replace(/\s+/g, "_") ?? "unknown";

    const fileName =
      type === "CERTIFICATE"
        ? `RuiOliveira_${type}_${safeName}.pdf`
        : `RuiOliveira_${type}-${locale.toUpperCase()}.pdf`;

    try {
      const res = await fetch(`/resource/${fileName}`);
      if (!res.ok) throw new Error("File not found");

      const pdf = await res.blob();
      saveAs(pdf, fileName);
    } catch (err) {
      console.error(err);
    }
  };
}
export function isFileAvailable(locale: string, type: "CV"): Promise<boolean>;
export function isFileAvailable(
  locale: string,
  type: "CERTIFICATE",
  name: string
): Promise<boolean>;

export async function isFileAvailable(
  locale: string,
  type: "CV" | "CERTIFICATE",
  name?: string
): Promise<boolean> {
  const fileName =
    type === "CERTIFICATE"
      ? `RuiOliveira_${type}_${name?.replace(/\s+/g, "")}.pdf`
      : `RuiOliveira_${type}-${locale.toUpperCase()}.pdf`;

  const fileUrl = `/resource/${fileName}`;

  try {
    const response = await fetch(fileUrl, { method: "HEAD" });

    if (!response.ok) return false;

    const contentType = response.headers.get("Content-Type");

    if (contentType && contentType.includes("text/html")) {
      console.warn(
        `File fallback intercepted for ${fileName} (Returned HTML instead of PDF)`
      );
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Error checking availability for ${fileName}:`, error);
    return false;
  }
}
