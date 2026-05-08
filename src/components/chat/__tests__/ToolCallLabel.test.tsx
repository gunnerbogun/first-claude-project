import { test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { getToolCallLabel, ToolCallLabel } from "../ToolCallLabel";
import type { ToolInvocation } from "ai";

function makeTool(
  toolName: string,
  args: Record<string, unknown>,
  state: "call" | "result" = "call"
): ToolInvocation {
  return state === "result"
    ? { toolCallId: "1", toolName, args, state: "result", result: "ok" }
    : { toolCallId: "1", toolName, args, state: "call" };
}

test("str_replace_editor create returns Creating <filename>", () => {
  expect(
    getToolCallLabel(makeTool("str_replace_editor", { command: "create", path: "/App.jsx" }))
  ).toBe("Creating App.jsx");
});

test("str_replace_editor str_replace returns Editing <filename>", () => {
  expect(
    getToolCallLabel(makeTool("str_replace_editor", { command: "str_replace", path: "/src/Button.tsx" }))
  ).toBe("Editing Button.tsx");
});

test("str_replace_editor insert returns Editing <filename>", () => {
  expect(
    getToolCallLabel(makeTool("str_replace_editor", { command: "insert", path: "/index.tsx" }))
  ).toBe("Editing index.tsx");
});

test("str_replace_editor view returns Viewing <filename>", () => {
  expect(
    getToolCallLabel(makeTool("str_replace_editor", { command: "view", path: "/App.jsx" }))
  ).toBe("Viewing App.jsx");
});

test("str_replace_editor undo_edit returns Undoing edit in <filename>", () => {
  expect(
    getToolCallLabel(makeTool("str_replace_editor", { command: "undo_edit", path: "/App.jsx" }))
  ).toBe("Undoing edit in App.jsx");
});

test("file_manager rename returns Renaming <filename>", () => {
  expect(
    getToolCallLabel(makeTool("file_manager", { command: "rename", path: "/old.tsx", new_path: "/new.tsx" }))
  ).toBe("Renaming old.tsx");
});

test("file_manager delete returns Deleting <filename>", () => {
  expect(
    getToolCallLabel(makeTool("file_manager", { command: "delete", path: "/components/Card.tsx" }))
  ).toBe("Deleting Card.tsx");
});

test("unknown tool falls back to toolName", () => {
  expect(getToolCallLabel(makeTool("unknown_tool", {}))).toBe("unknown_tool");
});

test("str_replace_editor with nested path extracts only filename", () => {
  expect(
    getToolCallLabel(makeTool("str_replace_editor", { command: "create", path: "/src/components/Button.tsx" }))
  ).toBe("Creating Button.tsx");
});

test("ToolCallLabel renders friendly label text", () => {
  render(
    <ToolCallLabel
      tool={makeTool("str_replace_editor", { command: "create", path: "/App.jsx" })}
    />
  );
  expect(screen.getByText("Creating App.jsx")).toBeDefined();
});

test("ToolCallLabel renders result state label", () => {
  render(
    <ToolCallLabel
      tool={makeTool("str_replace_editor", { command: "str_replace", path: "/App.jsx" }, "result")}
    />
  );
  expect(screen.getByText("Editing App.jsx")).toBeDefined();
});
