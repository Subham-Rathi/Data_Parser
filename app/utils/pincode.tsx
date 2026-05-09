type Location = {
  city: string;
  state: string;
};

export async function getLocation(pincode: string): Promise<Location> {
  try {
    const res = await fetch(
      `https://api.postalpincode.in/pincode/${pincode}`
    );

    const data = await res.json();

    if (data[0].Status === "Success") {
      return {
        city: data[0].PostOffice[0].District,
        state: data[0].PostOffice[0].State,
      };
    }
  } catch {}

  return { city: "", state: "" };
}
