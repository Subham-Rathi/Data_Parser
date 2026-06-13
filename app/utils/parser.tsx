type ParsedData = {
  name: string;
  mobile: string;
  address: string;
  pincode: string;
};

const FIELD_LABELS = [
  "Name",
  "Mobile",
  "Phone no\\.?",
  "Phone",
  "Contact no\\.?",
  "Contact",
  "Address",
  "H\\.no\\.?",
  "H no\\.?",
  "Pin code",
  "Pincode",
];

const LABEL_SEPARATOR = "\\s*(?::\\s*-?|-)\\s*";
const FIELD_LABEL_PATTERN = FIELD_LABELS.join("|");

function splitBulkUserData(text: string): string[] {
  const cleanText = text.replace(/\r/g, "").trim();

  if (!cleanText) return [];

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

  const getValue = (labels: string[]): string => {
    const regex = new RegExp(
      `(?:${labels.join("|")})${LABEL_SEPARATOR}([\\s\\S]*?)(?=\\s*(?:${FIELD_LABEL_PATTERN})${LABEL_SEPARATOR}|$)`,
      "i"
    );
    const match = cleanText.match(regex);
    return match ? cleanFieldValue(match[1]) : "";
  };

  data.name = cleanNameValue(getValue(["Name"]));
  data.mobile = getValue(["Mobile", "Phone no\\.?", "Phone", "Contact no\\.?", "Contact"]);
  data.address = getValue(["Address", "H\\.no\\.?", "H no\\.?"]);
  data.pincode = getValue(["Pin code", "Pincode"]);

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

  if (data.address) {
    data.address = removeKnownValues(data.address, data.mobile, data.pincode);
  }

  const lines = cleanText.split("\n").map(l => l.trim()).filter(Boolean);

  if (!data.name && lines.length > 0) {
    data.name = cleanNameValue(lines[0]);
  }

  if (!data.address) {
    let temp = cleanText;

    if (data.name) temp = temp.replace(data.name, "");
    if (data.mobile) temp = temp.replace(data.mobile, "");
    if (data.pincode) temp = temp.replace(data.pincode, "");

    temp = temp.replace(
      new RegExp(`(?:${FIELD_LABEL_PATTERN})${LABEL_SEPARATOR}`, "gi"),
      ""
    );

    data.address = cleanFieldValue(temp);
  }

  return data;
}

export function parseBulkUserDataAdvanced(text: string): ParsedData[] {
  return splitBulkUserData(text).map(parseUserDataAdvanced);
}

function removeKnownValues(value: string, mobile: string, pincode: string): string {
  let cleanValue = value;

  if (mobile) cleanValue = cleanValue.replace(mobile, "");
  if (pincode) cleanValue = cleanValue.replace(pincode, "");

  return cleanFieldValue(cleanValue);
}

function cleanFieldValue(value: string): string {
  return value
    .replace(/\s+/g, " ")
    .replace(/^\s*[:-]+\s*/, "")
    .replace(/\s*[:-]+\s*$/, "")
    .trim();
}

function cleanNameValue(value: string): string {
  const cleanValue = cleanFieldValue(value);

  return /\d/.test(cleanValue) ? "" : cleanValue;
}
