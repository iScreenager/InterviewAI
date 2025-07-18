import { Category } from "@/types";
import {
  Code,
  Database,
  SquareChevronRight,
  Workflow,
  User,
  GraduationCapIcon,
} from "lucide-react";

export const techCategories: Category[] = [
  {
    key: "frontend",
    title: "Frontend",
    heading: "Select Your Tech Stack",
    description: "Choose the technologies you want to be interviewed on",
    icon: Code,
    default: [
      { stack: "React", select: false },
      { stack: "Next.js", select: false },
      { stack: "Vue.js", select: false },
      { stack: "Angular", select: false },
      { stack: "Javascript", select: false },
      { stack: "HTML/CSS", select: false },
    ],
  },
  {
    key: "backend",
    title: "Backend",
    icon: SquareChevronRight,
    default: [
      { stack: "Node.js", select: false },
      { stack: "Express", select: false },
      { stack: "Spring Boot", select: false },
      { stack: "Django", select: false },
      { stack: "Ruby on Rails", select: false },
      { stack: ".NET Core", select: false },
      { stack: "NestJS", select: false },
    ],
  },
  {
    key: "database",
    title: "Database",
    icon: Database,
    default: [
      { stack: "MySQL", select: false },
      { stack: "PostgreSQL", select: false },
      { stack: "MongoDB", select: false },
      { stack: "Redis", select: false },
      { stack: "SQLite", select: false },
      { stack: "Firebase Realtime DB", select: false },
    ],
  },
  {
    key: "devops",
    title: "DevOps",
    icon: Workflow,
    default: [
      { stack: "Docker", select: false },
      { stack: "Kubernetes", select: false },
      { stack: "GitHub Actions", select: false },
      { stack: "Jenkins", select: false },
      { stack: "Terraform", select: false },
      { stack: "AWS", select: false },
    ],
  },
];

export const roleCategories: Category[] = [
  {
    key: "role",
    title: "Role",
    heading: "Select Your Roles",
    description: "Choose the position you're interviewing for",
    icon: User,
    default: [
      { stack: "Frontend Developer", select: false },
      { stack: "Backend Developer", select: false },
      { stack: "Full Stack Developer", select: false },
      { stack: "DevOps Engineer", select: false },
      { stack: "Software Architect", select: false },
      { stack: "Mobile Developer", select: false },
    ],
  },
];

export const experienceCategories: Category[] = [
  {
    key: "experience",
    title: "Experience",
    heading: "Select Your Position Level",
    description: "Choose your experience level for appropriate questions",
    icon: GraduationCapIcon,
    default: [
      { stack: "Intern (0 years)", select: false },
      { stack: "Junior (0-1 years)", select: false },
      { stack: "Mid-level (1-3 years)", select: false },
      { stack: "Senior (3-5 years)", select: false },
      { stack: "Lead (5+ years)", select: false },
    ],
  },
];
