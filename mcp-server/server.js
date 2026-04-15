import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import https from "https";

const API_BASE = process.env.API_BASE || "http://localhost:8080";

async function fetchAPI(endpoint) {
  return new Promise((resolve, reject) => {
    const url = new URL(endpoint, API_BASE);
    const protocol = url.protocol === "https:" ? https : require("http");

    protocol.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch {
          resolve(data);
        }
      });
    }).on("error", reject);
  });
}

const server = new Server(
  {
    name: "student-management",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

const students = new Map([
  [1, { id: 1, name: "Ahmet Yılmaz", email: "ahmet@edu.tr", grade: 85, attendance: 92 }],
  [2, { id: 2, name: "Ayşe Demir", email: "ayse@edu.tr", grade: 78, attendance: 88 }],
  [3, { id: 3, name: "Mehmet Çelik", email: "mehmet@edu.tr", grade: 91, attendance: 95 }],
]);

const courses = new Map([
  [1, { id: 1, name: "Matematik", teacher: "Prof. Kaya", credits: 4 }],
  [2, { id: 2, name: "Fizik", teacher: "Prof. Arslan", credits: 4 }],
  [3, { id: 3, name: "Kimya", teacher: "Prof. Yıldırım", credits: 3 }],
]);

const tools = [
  {
    name: "get_student_info",
    description: "Get information about a specific student by ID",
    inputSchema: {
      type: "object",
      properties: {
        studentId: { type: "number", description: "The student's ID" },
      },
      required: ["studentId"],
    },
  },
  {
    name: "get_all_students",
    description: "Get a list of all students in the system",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "get_student_grades",
    description: "Get grades for a specific student",
    inputSchema: {
      type: "object",
      properties: {
        studentId: { type: "number", description: "The student's ID" },
      },
      required: ["studentId"],
    },
  },
  {
    name: "get_student_attendance",
    description: "Get attendance percentage for a specific student",
    inputSchema: {
      type: "object",
      properties: {
        studentId: { type: "number", description: "The student's ID" },
      },
      required: ["studentId"],
    },
  },
  {
    name: "get_courses",
    description: "Get all available courses",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "get_course_details",
    description: "Get details about a specific course",
    inputSchema: {
      type: "object",
      properties: {
        courseId: { type: "number", description: "The course's ID" },
      },
      required: ["courseId"],
    },
  },
];

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "get_student_info": {
        const data = await fetchAPI(`/api/students/${args.studentId}`);
        return {
          content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
      }
      case "get_all_students": {
        const data = await fetchAPI("/api/students");
        return {
          content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
      }
      case "get_student_grades": {
        const data = await fetchAPI(`/api/students/${args.studentId}/grades`);
        return {
          content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
      }
      case "get_student_attendance": {
        const data = await fetchAPI(`/api/students/${args.studentId}/attendance`);
        return {
          content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
      }
      case "get_courses": {
        const data = await fetchAPI("/api/courses");
        return {
          content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
      }
      case "get_course_details": {
        const data = await fetchAPI(`/api/courses/${args.courseId}`);
        return {
          content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
      }
      default:
        return {
          content: [{ type: "text", text: `Unknown tool: ${name}` }],
        };
    }
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error: ${error.message}` }],
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main();