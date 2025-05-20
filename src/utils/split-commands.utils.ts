export const splitCommands = (value: string): string[] => {
  const commands = [];

  let current = "";
  let inQuotes = false;

  for (let i = 0; i < value.length; i++) {
    const char = value[i];

    // Toggle state when encountering a quote.
    if (char === '"') inQuotes = !inQuotes;

    // When we hit a semicolon outside quotes, we finish a command.
    if (char === ";" && !inQuotes) {
      // Add the command if it's not empty, trimming extra whitespace.
      if (current.trim()) {
        commands.push(current.trim());
      }
      current = "";
    } else {
      current += char;
    }
  }

  // Push the last command if there is one.
  if (current.trim()) {
    commands.push(current.trim());
  }

  return commands;
};
