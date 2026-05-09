type ParsedData = {
  name: string;
  mobile: string;
  address: string;
  pincode: string;
};

const hasContactData = (text: string): boolean => {
  return /\b[6-9]\d{9}\b/.test(text) || /\b\d{6}\b/.test(text);
};

function splitBulkUserData(text: string): string[] {
  const cleanText = text.replace(/\r/g, "").trim();

  if (!cleanText) return [];

  const blankLineChunks = cleanText
    .split(/\n\s*\n+/)
    .map((chunk) => chunk.trim())
    .filter(Boolean);

  if (blankLineChunks.length > 1) {
    return blankLineChunks;
  }

  const nameChunks = cleanText
    .split(/(?=\bName\s*:)/i)
    .map((chunk) => chunk.trim())
    .filter(Boolean);

  if (nameChunks.length > 1) {
    return nameChunks;
  }

  const lines = cleanText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const contactLines = lines.filter(hasContactData);

  if (lines.length > 1 && contactLines.length === lines.length) {
    return lines;
  }

  return [cleanText];
}

export function parseUserDataAdvanced(text: string): ParsedData {
  const cleanText = text.replace(/\r/g, "").trim();

  const data: ParsedData = {
    name: "",
    mobile: "",
    address: "",
    pincode: "",
  };

  const getValue = (label: string): string => {
    const regex = new RegExp(
      `${label}:\\s*(.*?)(?=\\s+[A-Za-z ]+:|$)`,
      "i"
    );
    const match = cleanText.match(regex);
    return match ? match[1].trim() : "";
  };

  data.name = getValue("Name");
  data.mobile = getValue("Mobile");
  data.address = getValue("Address");
  data.pincode = getValue("Pin code");

  // fallback mobile
  if (!data.mobile) {
    const match = cleanText.match(/\b[6-9]\d{9}\b/);
    if (match) data.mobile = match[0];
  }

  // fallback pincode
  if (!data.pincode) {
    const match = cleanText.match(/\b\d{6}\b/);
    if (match) data.pincode = match[0];
  }

  const lines = cleanText.split("\n").map(l => l.trim()).filter(Boolean);

  if (!data.name && lines.length > 0) {
    data.name = lines[0];
  }

  if (!data.address) {
    let temp = cleanText;

    if (data.name) temp = temp.replace(data.name, "");
    if (data.mobile) temp = temp.replace(data.mobile, "");
    if (data.pincode) temp = temp.replace(data.pincode, "");

    temp = temp.replace(/Name:|Mobile:|Address:|Pin code:/gi, "");

    data.address = temp.trim();
  }

  return data;
}

export function parseBulkUserDataAdvanced(text: string): ParsedData[] {
  return splitBulkUserData(text).map(parseUserDataAdvanced);
}
