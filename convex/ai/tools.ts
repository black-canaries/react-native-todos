// @ts-nocheck - Type inference issues with createTool and zod schemas
import { createTool, type ToolCtx } from "@convex-dev/agent";
import { z } from "zod";
import { api } from "../_generated/api";
import { Id } from "../_generated/dataModel";

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

// Task Tools

export const createTask = createTool({
  description: "Create a new task with a title, optional description, priority, due date, and project assignment",
  args: z.object({
    title: z.string().describe("The title of the task"),
    description: z.string().optional().describe("Optional description of the task"),
    priority: z.enum(["p1", "p2", "p3", "p4"]).default("p4").describe("Priority level: p1 (high/red), p2 (medium/orange), p3 (normal/blue), p4 (low/gray)"),
    projectId: z.string().describe("ID of the project to assign this task to"),
    dueDate: z.string().optional().describe("Due date in ISO format (YYYY-MM-DD) or relative like 'today', 'tomorrow'"),
  }),
  handler: async (ctx: ToolCtx, args) => {
    try {
      const projectId = args.projectId as Id<"projects">;
      const dueDate = args.dueDate ? parseDate(args.dueDate) : undefined;

      const taskId = await ctx.runMutation(api.tasksMutation.create, {
        title: args.title,
        description: args.description,
        priority: args.priority,
        projectId,
        dueDate,
      });

      return {
        success: true,
        message: `Task "${args.title}" created successfully`,
        taskId,
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to create task: ${error instanceof Error ? error.message : "Unknown error"}`,
      };
    }
  },
});

export const listTasks = createTool({
  description: "List tasks with optional filters by project, status (active/completed), priority, or date range",
  args: z.object({
    projectId: z.string().optional().describe("Filter by project ID"),
    status: z.enum(["active", "completed", "all"]).default("active").describe("Filter by task status"),
    priority: z.enum(["p1", "p2", "p3", "p4"]).optional().describe("Filter by priority level"),
    view: z.enum(["today", "upcoming", "all"]).optional().describe("Special views: 'today' for today's tasks, 'upcoming' for next 7 days"),
  }),
  handler: async (ctx: ToolCtx, args) => {
    try {
      let tasks;

      if (args.view === "today") {
        tasks = await ctx.runQuery(api.tasksQuery.listByToday);
      } else if (args.view === "upcoming") {
        tasks = await ctx.runQuery(api.tasksQuery.listByUpcoming);
      } else if (args.projectId) {
        const projectId = args.projectId as Id<"projects">;
        tasks = await ctx.runQuery(api.tasksQuery.listByProject, { projectId });
      } else if (args.status === "completed") {
        tasks = await ctx.runQuery(api.tasksQuery.listCompleted);
      } else if (args.status === "active") {
        tasks = await ctx.runQuery(api.tasksQuery.listActive);
      } else {
        tasks = await ctx.runQuery(api.tasksQuery.list);
      }

      // Apply priority filter if specified
      if (args.priority) {
        tasks = tasks.filter((task) => task.priority === args.priority);
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
  },
});

export const updateTask = createTool({
  description: "Update properties of an existing task",
  args: z.object({
    taskId: z.string().describe("The ID of the task to update"),
    title: z.string().optional().describe("New title for the task"),
    description: z.string().optional().describe("New description for the task"),
    priority: z.enum(["p1", "p2", "p3", "p4"]).optional().describe("New priority level"),
    dueDate: z.string().optional().describe("New due date in ISO format or relative date"),
  }),
  handler: async (ctx: ToolCtx, args) => {
    try {
      const taskId = args.taskId as Id<"tasks">;
      const dueDate = args.dueDate ? parseDate(args.dueDate) : undefined;

      await ctx.runMutation(api.tasksMutation.update, {
        id: taskId,
        title: args.title,
        description: args.description,
        priority: args.priority,
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
  },
});

export const completeTask = createTool({
  description: "Mark a task as complete or toggle its completion status",
  args: z.object({
    taskId: z.string().describe("The ID of the task to complete"),
  }),
  handler: async (ctx: ToolCtx, args) => {
    try {
      const taskId = args.taskId as Id<"tasks">;
      await ctx.runMutation(api.tasksMutation.toggleComplete, { id: taskId });

      return {
        success: true,
        message: "Task completion toggled",
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to complete task: ${error instanceof Error ? error.message : "Unknown error"}`,
      };
    }
  },
});

export const deleteTask = createTool({
  description: "Delete a task permanently. Should confirm with user before calling.",
  args: z.object({
    taskId: z.string().describe("The ID of the task to delete"),
  }),
  handler: async (ctx: ToolCtx, args) => {
    try {
      const taskId = args.taskId as Id<"tasks">;
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
  },
});

// Project Tools

export const createProject = createTool({
  description: "Create a new project with a name, color, and optional favorite status",
  args: z.object({
    name: z.string().describe("The name of the project"),
    color: z.string().describe("Color hex code for the project (e.g., '#ff0000')"),
    isFavorite: z.boolean().default(false).describe("Whether to mark this project as a favorite"),
  }),
  handler: async (ctx: ToolCtx, args) => {
    try {
      const projectId = await ctx.runMutation(api.projectsMutation.create, {
        name: args.name,
        color: args.color,
        isFavorite: args.isFavorite,
      });

      return {
        success: true,
        message: `Project "${args.name}" created successfully`,
        projectId,
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to create project: ${error instanceof Error ? error.message : "Unknown error"}`,
      };
    }
  },
});

export const listProjects = createTool({
  description: "List all projects with their task counts",
  args: z.object({}),
  handler: async (ctx: ToolCtx) => {
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
  },
});

export const updateProject = createTool({
  description: "Update properties of an existing project",
  args: z.object({
    projectId: z.string().describe("The ID of the project to update"),
    name: z.string().optional().describe("New name for the project"),
    color: z.string().optional().describe("New color hex code"),
    isFavorite: z.boolean().optional().describe("Update favorite status"),
  }),
  handler: async (ctx: ToolCtx, args) => {
    try {
      const projectId = args.projectId as Id<"projects">;

      await ctx.runMutation(api.projectsMutation.update, {
        id: projectId,
        name: args.name,
        color: args.color,
        isFavorite: args.isFavorite,
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
  },
});

export const deleteProject = createTool({
  description: "Delete a project and all its tasks. Should confirm with user before calling.",
  args: z.object({
    projectId: z.string().describe("The ID of the project to delete"),
  }),
  handler: async (ctx: ToolCtx, args) => {
    try {
      const projectId = args.projectId as Id<"projects">;
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
  },
});

export const getProjectTasks = createTool({
  description: "Get all tasks in a specific project",
  args: z.object({
    projectId: z.string().describe("The ID of the project"),
  }),
  handler: async (ctx: ToolCtx, args) => {
    try {
      const projectId = args.projectId as Id<"projects">;
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
  },
});

// Label Tools

export const createLabel = createTool({
  description: "Create a new label with a name and color",
  args: z.object({
    name: z.string().describe("The name of the label"),
    color: z.string().describe("Color hex code for the label (e.g., '#ff0000')"),
  }),
  handler: async (ctx: ToolCtx, args) => {
    try {
      const labelId = await ctx.runMutation(api.labelsMutation.create, {
        name: args.name,
        color: args.color,
      });

      return {
        success: true,
        message: `Label "${args.name}" created successfully`,
        labelId,
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to create label: ${error instanceof Error ? error.message : "Unknown error"}`,
      };
    }
  },
});

export const listLabels = createTool({
  description: "List all labels",
  args: z.object({}),
  handler: async (ctx: ToolCtx) => {
    try {
      const labels = await ctx.runQuery(api.labelsQuery.list);

      return {
        success: true,
        labels: labels.map((label) => ({
          id: label._id,
          name: label.name,
          color: label.color,
        })),
        count: labels.length,
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to list labels: ${error instanceof Error ? error.message : "Unknown error"}`,
      };
    }
  },
});

export const updateLabel = createTool({
  description: "Update properties of an existing label",
  args: z.object({
    labelId: z.string().describe("The ID of the label to update"),
    name: z.string().optional().describe("New name for the label"),
    color: z.string().optional().describe("New color hex code"),
  }),
  handler: async (ctx: ToolCtx, args) => {
    try {
      const labelId = args.labelId as Id<"labels">;

      await ctx.runMutation(api.labelsMutation.update, {
        id: labelId,
        name: args.name,
        color: args.color,
      });

      return {
        success: true,
        message: "Label updated successfully",
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to update label: ${error instanceof Error ? error.message : "Unknown error"}`,
      };
    }
  },
});

export const deleteLabel = createTool({
  description: "Delete a label. It will be removed from all tasks that use it.",
  args: z.object({
    labelId: z.string().describe("The ID of the label to delete"),
  }),
  handler: async (ctx: ToolCtx, args) => {
    try {
      const labelId = args.labelId as Id<"labels">;
      await ctx.runMutation(api.labelsMutation.delete_, { id: labelId });

      return {
        success: true,
        message: "Label deleted successfully",
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to delete label: ${error instanceof Error ? error.message : "Unknown error"}`,
      };
    }
  },
});

// Export all tools as a ToolSet
export const taskManagementTools = {
  createTask,
  listTasks,
  updateTask,
  completeTask,
  deleteTask,
  createProject,
  listProjects,
  updateProject,
  deleteProject,
  getProjectTasks,
  createLabel,
  listLabels,
  updateLabel,
  deleteLabel,
};
