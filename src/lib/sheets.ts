import "server-only";
import type { AnalyticsRecord } from "@/types";

/**
 * Optional Google Sheets sync.
 *
 * The platform works fully without Google Sheets — local JSON is the source of
 * truth. If the following env vars are present, every view/download is mirrored
 * to a sheet with columns: ID | Video Name | Views | Downloads | Upload Date.
 *
 *   GOOGLE_SHEETS_ID
 *   GOOGLE_SERVICE_ACCOUNT_EMAIL
 *   GOOGLE_PRIVATE_KEY            (with \n escaped newlines)
 *   GOOGLE_SHEETS_TAB            (optional, defaults to "Sheet1")
 */

const SHEET_ID = process.env.GOOGLE_SHEETS_ID;
const CLIENT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
const TAB = process.env.GOOGLE_SHEETS_TAB || "Sheet1";

export const sheetsEnabled = Boolean(SHEET_ID && CLIENT_EMAIL && PRIVATE_KEY);

// row index cache so we can update in place instead of appending duplicates
let rowIndex: Map<string, number> | null = null;
let authClientPromise: Promise<unknown> | null = null;

async function getAuth() {
  if (!sheetsEnabled) return null;
  if (!authClientPromise) {
    authClientPromise = (async () => {
      const { JWT } = await import("google-auth-library");
      const client = new JWT({
        email: CLIENT_EMAIL,
        key: PRIVATE_KEY,
        scopes: ["https://www.googleapis.com/spreadsheets"].map(
          (s) => `https://www.googleapis.com/auth/${s.split("/").pop()}`,
        ),
      });
      await client.authorize();
      return client;
    })();
  }
  return authClientPromise;
}

async function sheetsFetch(
  pathSuffix: string,
  init?: RequestInit,
): Promise<Response> {
  const client = (await getAuth()) as {
    getRequestHeaders: (url?: string) => Promise<Record<string, string>>;
  } | null;
  if (!client) throw new Error("sheets disabled");
  const headers = await client.getRequestHeaders();
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}${pathSuffix}`;
  return fetch(url, {
    ...init,
    headers: { ...headers, "Content-Type": "application/json", ...init?.headers },
  });
}

async function ensureHeaderAndIndex() {
  if (rowIndex) return;
  rowIndex = new Map();
  const res = await sheetsFetch(
    `/values/${encodeURIComponent(`${TAB}!A:E`)}`,
  );
  if (!res.ok) return;
  const data = (await res.json()) as { values?: string[][] };
  const rows = data.values ?? [];
  if (rows.length === 0) {
    await sheetsFetch(
      `/values/${encodeURIComponent(`${TAB}!A1`)}:append?valueInputOption=RAW`,
      {
        method: "POST",
        body: JSON.stringify({
          values: [["ID", "Video Name", "Views", "Downloads", "Upload Date"]],
        }),
      },
    );
    return;
  }
  rows.forEach((row, i) => {
    if (i === 0) return; // header
    if (row[0]) rowIndex!.set(row[0], i + 1); // 1-based sheet row
  });
}

export async function syncRowToSheet(
  id: string,
  rec: AnalyticsRecord,
  title?: string,
) {
  if (!sheetsEnabled) return;
  await ensureHeaderAndIndex();
  const existing = rowIndex!.get(id);
  const values = [[id, title ?? id, rec.views, rec.downloads, new Date().toISOString()]];
  if (existing) {
    await sheetsFetch(
      `/values/${encodeURIComponent(`${TAB}!A${existing}:E${existing}`)}?valueInputOption=RAW`,
      { method: "PUT", body: JSON.stringify({ values }) },
    );
  } else {
    const res = await sheetsFetch(
      `/values/${encodeURIComponent(`${TAB}!A1`)}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
      { method: "POST", body: JSON.stringify({ values }) },
    );
    if (res.ok) rowIndex!.set(id, rowIndex!.size + 2);
  }
}

export async function logPaymentToSheet(
  categorySlug: string,
  utr: string,
  amount: string,
  uniqueId: string
) {
  if (!sheetsEnabled) return;
  const PAYMENT_TAB = process.env.GOOGLE_SHEETS_PAYMENTS_TAB || "Payments";
  
  const values = [[
    new Date().toISOString(),
    categorySlug,
    utr,
    amount,
    uniqueId,
    "Pending Verification"
  ]];

  try {
    await sheetsFetch(
      `/values/${encodeURIComponent(`${PAYMENT_TAB}!A1`)}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
      { method: "POST", body: JSON.stringify({ values }) },
    );
  } catch (err) {
    console.error("Failed to log payment to sheets:", err);
  }
}
