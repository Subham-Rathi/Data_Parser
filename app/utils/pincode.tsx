type Location = {
  city: string;
  state: string;
};

type PincodeInfoResult = {
  district?: string;
  state?: string;
};

type PincodeInfoResponse = {
  success?: boolean;
  results?: PincodeInfoResult[];
};

export async function getLocation(pincode: string): Promise<Location> {
  const cleanPincode = pincode.trim();

  if (!/^\d{6}$/.test(cleanPincode)) {
    return { city: "", state: "" };
  }

  try {
    const res = await fetch(
      `https://pincodesinfo.in/api/pincode/${cleanPincode}`
    );

    if (!res.ok) {
      throw new Error(`Pincode API failed with status ${res.status}`);
    }

    const data = (await res.json()) as PincodeInfoResponse;
    const firstResult = data.results?.[0];

    if (data.success && firstResult) {
      return {
        city: toTitleCase(firstResult.district ?? ""),
        state: toTitleCase(firstResult.state ?? ""),
      };
    }
  } catch (error) {
    console.error("Failed to fetch pincode location", error);
  }

  return { city: "", state: "" };
}

function toTitleCase(value: string): string {
  return value
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
