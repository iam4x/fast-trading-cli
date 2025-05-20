import { describe, test, expect } from "bun:test";

import { splitCommands } from "./split-commands.utils";

describe("splitCommands utility function", () => {
  test("should split a string by semicolons", () => {
    const result = splitCommands("command1; command2; command3");
    expect(result).toEqual(["command1", "command2", "command3"]);
  });

  test("should ignore semicolons inside quotes", () => {
    const result = splitCommands(
      'command1; command2 "with; semicolon"; command3',
    );
    expect(result).toEqual([
      "command1",
      'command2 "with; semicolon"',
      "command3",
    ]);
  });

  test("should handle balanced quotes properly", () => {
    const result = splitCommands('command1 "quoted text"; command2');
    expect(result).toEqual(['command1 "quoted text"', "command2"]);
  });

  test("should trim whitespace from commands", () => {
    const result = splitCommands("  command1  ;   command2  ;  command3  ");
    expect(result).toEqual(["command1", "command2", "command3"]);
  });

  test("should ignore empty commands", () => {
    const result = splitCommands("command1;;command2;  ;command3");
    expect(result).toEqual(["command1", "command2", "command3"]);
  });

  test("should handle empty input string", () => {
    const result = splitCommands("");
    expect(result).toEqual([]);
  });

  test("should handle string with only whitespace", () => {
    const result = splitCommands("   ");
    expect(result).toEqual([]);
  });

  test("should handle string with no semicolons", () => {
    const result = splitCommands("single command");
    expect(result).toEqual(["single command"]);
  });

  test("should handle string with trailing semicolon", () => {
    const result = splitCommands("command1; command2;");
    expect(result).toEqual(["command1", "command2"]);
  });

  test("should handle unbalanced quotes", () => {
    const result = splitCommands('command1 "unbalanced; command2');
    expect(result).toEqual(['command1 "unbalanced; command2']);
  });

  test("should preserve spacing within commands", () => {
    const result = splitCommands(
      "create table users (id INT, name TEXT); select * from users",
    );
    expect(result).toEqual([
      "create table users (id INT, name TEXT)",
      "select * from users",
    ]);
  });

  test("should handle complex quoted content", () => {
    const result = splitCommands(
      'insert into messages values("Hello; world"); select * from messages',
    );
    expect(result).toEqual([
      'insert into messages values("Hello; world")',
      "select * from messages",
    ]);
  });
});
