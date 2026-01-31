export default function parseValue(value: any) {
  let parsedValue;

  if (typeof value === "string") {
    try {
      parsedValue = JSON.parse(value);
    } catch (error) {
      console.error("Error parsing token:", error);
      parsedValue = value; // fall back to the original token if parsing fails
    }
  } else {
    parsedValue = value;
  }

  if (!parsedValue) {
    console.error("Invalid value :-", parsedValue);
  }

  return parsedValue;
}