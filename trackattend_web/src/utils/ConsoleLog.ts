const red = "\x1b[31m";  /// error and crash 
const green = "\x1b[32m"; /// navigation flow
const yellow = "\x1b[33m"; /// function yellow
const blue = "\x1b[34m"; /// context 
const magenta = "\x1b[35m";  /// unique fetch
const bold = "\x1b[1m";  /// any specific bold 
const underline = "\x1b[4m";
const reset = "\x1b[0m";

// New log function with color support
export default function log(message: string, style: string) {
  let formattedMessage = message;

  // Apply style if provided
  if (style == "red") {
    formattedMessage = `${red}${message}${reset}`;
  } else if (style == "green") {
    formattedMessage = `${green}${message}${reset}`;
  } else if (style == "yellow") {
    formattedMessage = `${yellow}${message}${reset}`;
  } else if (style == "blue") {
    formattedMessage = `${blue}${message}${reset}`;
  } else if (style == "magenta") {
    formattedMessage = `${magenta}${message}${reset}`;
  } else if (style == "bold") {
    formattedMessage = `${bold}${message}${reset}`;
  } else if (style == "underline") {
    formattedMessage = `${underline}${message}${reset}`;
  } else {
    formattedMessage = message;
  }
  console.log(formattedMessage);
}
