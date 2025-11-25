import { ActionCtx } from "../_generated/server";
import { api } from "../_generated/api";
import { Id } from "../_generated/dataModel";
import { v } from "convex/values";

// Tool definitions for the AI agent

export const toolDefinitions = [
  {
    name: "createTask",
    description: "Create a new task with a title, optional description, priority, due date, and project assignment",
    parameters: {
      type: "object",
      properties: {
        title: {
          type: "string",
          description: "The title of the task",
        },
        description: {
          type: "string",
          description: "Optional description of the task",
        },
        priority: {
          type: "string",
          enum: ["p1", "p2", "p3", "p4"],
          description: "Priority level: p1 (high/red), p2 (medium/orange), p3 (normal/blue), p4 (low/gray). Defaults to p4.",
        },
        projectId: {
          type: "string",
          description: "ID of the project to assign this task to. Use 'inbox' for the inbox project.",
        },
        dueDate: {
          type: "string",
          description: "Due date in ISO format (YYYY-MM-DD) or relative like 'today', 'tomorrow'",
        },
      },
      required: ["title", "projectId"],
    },
  },
  {
    name: "listTasks",
    description: "List tasks with optional filters by project, status (active/completed), priority, or date range",
    parameters: {
      type: "object",
      properties: {
        projectId: {
          type: "string",
          description: "Filter by project ID",
        },
        status: {
          type: "string",
          enum: ["active", "completed", "all"],
          description: "Filter by task status. Defaults to 'active'",
        },
        priority: {
          type: "string",
          enum: ["p1", "p2", "p3", "p4"],
          description: "Filter by priority level",
        },
        view: {
          type: "string",
          enum: ["today", "upcoming", "all"],
          description: "Special views: 'today' for today's tasks, 'upcoming' for next 7 days",
        },
      },
    },
  },
  {
    name: "updateTask",
    description: "Update properties of an existing task",
    parameters: {
      type: "object",
      properties: {
        taskId: {
          type: "string",
          description: "The ID of the task to update",
        },
        title: {
          type: "string",
          description: "New title for the task",
        },
        description: {
          type: "string",
          description: "New description for the task",
        },
        priority: {
          type: "string",
          enum: ["p1", "p2", "p3", "p4"],
          description: "New priority level",
        },
        dueDate: {
          type: "string",
          description: "New due date in ISO format or relative date",
        },
      },
      required: ["taskId"],
    },
  },
  {
    name: "completeTask",
    description: "Mark a task as complete",
    parameters: {
      type: "object",
      properties: {
        taskId: {
          type: "string",
          description: "The ID of the task to complete",
        },
      },
      required: ["taskId"],
    },
  },
  {
    name: "deleteTask",
    description: "Delete a task permanently. Should confirm with user before calling.",
    parameters: {
      type: "object",
      properties: {
        taskId: {
          type: "string",
          description: "The ID of the task to delete",
        },
      },
      required: ["taskId"],
    },
  },
  {
    name: "createProject",
    description: "Create a new project with a name, color, and optional description",
    parameters: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "The name of the project",
        },
        color: {
          type: "string",
          description: "Color hex code for the project (e.g., '#ff0000')",
        },
        isFavorite: {
          type: "boolean",
          description: "Whether to mark this project as a favorite. Defaults to false.",
        },
      },
      required: ["name", "color"],
    },
  },
  {
    name: "listProjects",
    description: "List all projects with their task counts",
    parameters: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "updateProject",
    description: "Update properties of an existing project",
    parameters: {
      type: "object",
      properties: {
        projectId: {
          type: "string",
          description: "The ID of the project to update",
        },
        name: {
          type: "string",
          description: "New name for the project",
        },
        color: {
          type: "string",
          description: "New color hex code",
        },
        isFavorite: {
          type: "boolean",
          description: "Update favorite status",
        },
      },
      required: ["projectId"],
    },
  },
  {
    name: "deleteProject",
    description: "Delete a project and all its tasks. Should confirm with user before calling.",
    parameters: {
      type: "object",
      properties: {
        projectId: {
          type: "string",
          description: "The ID of the project to delete",
        },
      },
      required: ["projectId"],
    },
  },
  {
    name: "getProjectTasks",
    description: "Get all tasks in a specific project",
    parameters: {
      type: "object",
      properties: {
        projectId: {
          type: "string",
          description: "The ID of the project",
        },
      },
      required: ["projectId"],
    },
  },
];

// Helper function to parse relative dates
function parseDate(dateStr: string): number | undefined {
  if (!dateStr) return undefined;

  const now = new Date();
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  if (dateStr === "today") {
    return today.getTime();
  }

  if (dateStr === "tomorrow") {
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.getTime();
  }

  if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return new Date(dateStr).getTime();
  }

  return undefined;
}

// Tool execution functions
export async function executeCreateTask(
  ctx: ActionCtx,
  params: {
    title: string;
    description?: string;
    priority?: "p1" | "p2" | "p3" | "p4";
    projectId: string;
    dueDate?: string;
  }
) {
  try {
    const projectId = params.projectId as Id<"projects">;
    const dueDate = params.dueDate ? parseDate(params.dueDate) : undefined;

    const taskId = await ctx.runMutation(api.tasksMutation.create, {
      title: params.title,
      description: params.description,
      priority: params.priority || "p4",
      projectId,
      dueDate,
    });

    return {
      success: true,
      message: `Task "${params.title}" created successfully`,
      taskId,
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to create task: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

export async function executeListTasks(
  ctx: ActionCtx,
  params: {
    projectId?: string;
    status?: "active" | "completed" | "all";
    priority?: "p1" | "p2" | "p3" | "p4";
    view?: "today" | "upcoming" | "all";
  }
) {
  try {
    let tasks;

    if (params.view === "today") {
      tasks = await ctx.runQuery(api.tasksQuery.listByToday);
    } else if (params.view === "upcoming") {
      tasks = await ctx.runQuery(api.tasksQuery.listByUpcoming);
    } else if (params.projectId) {
      const projectId = params.projectId as Id<"projects">;
      tasks = await ctx.runQuery(api.tasksQuery.listByProject, { projectId });
    } else if (params.status === "completed") {
      tasks = await ctx.runQuery(api.tasksQuery.listCompleted);
    } else if (params.status === "active") {
      tasks = await ctx.runQuery(api.tasksQuery.listActive);
    } else {
      tasks = await ctx.runQuery(api.tasksQuery.list);
    }

    // Apply priority filter if specified
    if (params.priority) {
      tasks = tasks.filter((task) => task.priority === params.priority);
    }

    return {
      success: true,
      tasks: tasks.map((task) => ({
        id: task._id,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        projectId: task.projectId,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString() : undefined,
        createdAt: new Date(task.createdAt).toISOString(),
      })),
      count: tasks.length,
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to list tasks: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

export async function executeUpdateTask(
  ctx: ActionCtx,
  params: {
    taskId: string;
    title?: string;
    description?: string;
    priority?: "p1" | "p2" | "p3" | "p4";
    dueDate?: string;
  }
) {
  try {
    const taskId = params.taskId as Id<"tasks">;
    const dueDate = params.dueDate ? parseDate(params.dueDate) : undefined;

    await ctx.runMutation(api.tasksMutation.update, {
      id: taskId,
      title: params.title,
      description: params.description,
      priority: params.priority,
      dueDate,
    });

    return {
      success: true,
      message: "Task updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to update task: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

export async function executeCompleteTask(
  ctx: ActionCtx,
  params: { taskId: string }
) {
  try {
    const taskId = params.taskId as Id<"tasks">;
    await ctx.runMutation(api.tasksMutation.toggleComplete, { id: taskId });

    return {
      success: true,
      message: "Task marked as complete",
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to complete task: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

export async function executeDeleteTask(
  ctx: ActionCtx,
  params: { taskId: string }
) {
  try {
    const taskId = params.taskId as Id<"tasks">;
    await ctx.runMutation(api.tasksMutation.delete_, { id: taskId });

    return {
      success: true,
      message: "Task deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to delete task: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

export async function executeCreateProject(
  ctx: ActionCtx,
  params: {
    name: string;
    color: string;
    isFavorite?: boolean;
  }
) {
  try {
    const projectId = await ctx.runMutation(api.projectsMutation.create, {
      name: params.name,
      color: params.color,
      isFavorite: params.isFavorite || false,
    });

    return {
      success: true,
      message: `Project "${params.name}" created successfully`,
      projectId,
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to create project: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

export async function executeListProjects(ctx: ActionCtx) {
  try {
    const projects = await ctx.runQuery(api.projectsQuery.listWithTaskCounts);

    return {
      success: true,
      projects: projects.map((project) => ({
        id: project._id,
        name: project.name,
        color: project.color,
        isFavorite: project.isFavorite,
        totalTasks: project.totalTasks,
        activeTasks: project.activeTasks,
        completedTasks: project.completedTasks,
      })),
      count: projects.length,
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to list projects: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

export async function executeUpdateProject(
  ctx: ActionCtx,
  params: {
    projectId: string;
    name?: string;
    color?: string;
    isFavorite?: boolean;
  }
) {
  try {
    const projectId = params.projectId as Id<"projects">;

    await ctx.runMutation(api.projectsMutation.update, {
      id: projectId,
      name: params.name,
      color: params.color,
      isFavorite: params.isFavorite,
    });

    return {
      success: true,
      message: "Project updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to update project: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

export async function executeDeleteProject(
  ctx: ActionCtx,
  params: { projectId: string }
) {
  try {
    const projectId = params.projectId as Id<"projects">;
    await ctx.runMutation(api.projectsMutation.delete_, { id: projectId });

    return {
      success: true,
      message: "Project and all its tasks deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to delete project: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

export async function executeGetProjectTasks(
  ctx: ActionCtx,
  params: { projectId: string }
) {
  try {
    const projectId = params.projectId as Id<"projects">;
    const tasks = await ctx.runQuery(api.tasksQuery.listByProject, {
      projectId,
    });

    return {
      success: true,
      tasks: tasks.map((task) => ({
        id: task._id,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString() : undefined,
      })),
      count: tasks.length,
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to get project tasks: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

// Main tool executor that routes to the appropriate function
export async function executeTool(
  ctx: ActionCtx,
  toolName: string,
  params: any
): Promise<any> {
  switch (toolName) {
    case "createTask":
      return executeCreateTask(ctx, params);
    case "listTasks":
      return executeListTasks(ctx, params);
    case "updateTask":
      return executeUpdateTask(ctx, params);
    case "completeTask":
      return executeCompleteTask(ctx, params);
    case "deleteTask":
      return executeDeleteTask(ctx, params);
    case "createProject":
      return executeCreateProject(ctx, params);
    case "listProjects":
      return executeListProjects(ctx);
    case "updateProject":
      return executeUpdateProject(ctx, params);
    case "deleteProject":
      return executeDeleteProject(ctx, params);
    case "getProjectTasks":
      return executeGetProjectTasks(ctx, params);
    default:
      return {
        success: false,
        message: `Unknown tool: ${toolName}`,
      };
  }
}
