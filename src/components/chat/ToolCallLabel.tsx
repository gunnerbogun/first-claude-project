"use client";

import type { ToolInvocation } from "ai";

function getFilename(path: string): string {
  return path.split("/").pop() || path;
}

export function getToolCallLabel(tool: ToolInvocation): string {
  const args = tool.args as Record<string, unknown>;
  const path = typeof args.path === "string" ? args.path : "";
  const filename = getFilename(path);

  if (tool.toolName === "str_replace_editor") {
    switch (args.command) {
      case "create":
        return `Creating ${filename}`;
      case "str_replace":
      case "insert":
        return `Editing ${filename}`;
      case "view":
        return `Viewing ${filename}`;
      case "undo_edit":
        return `Undoing edit in ${filename}`;
    }
  }

  if (tool.toolName === "file_manager") {
    switch (args.command) {
      case "rename":
        return `Renaming ${filename}`;
      case "delete":
        return `Deleting ${filename}`;
    }
  }

  return tool.toolName;
}

interface ToolCallLabelProps {
  tool: ToolInvocation;
}

export function ToolCallLabel({ tool }: ToolCallLabelProps) {
  return <span className="text-neutral-700">{getToolCallLabel(tool)}</span>;
}
