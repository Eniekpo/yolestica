import {
  Code2,
  ChartNoAxesCombined,
  GraduationCap,
  Workflow,
  Headset,
  MonitorCog,
  PenTool,
  Shapes,
} from "lucide-react";
export const services = [
  {
    key: "WEB",
    slug: "full-stack-web-development",
    name: "Full-Stack Web Development",
    short: "Web development",
    icon: Code2,
    caption:
      "Turn your business idea into a fast, usable website with the systems behind it built to work together.",
    description:
      "From your first landing page to a custom business application, get a website built around how your business works. Frontend interfaces, backend logic and database integration come together in one considered solution. You receive a responsive, maintainable product with a clear handover.",
    features: [
      "Responsive websites & applications",
      "Backend APIs & database integration",
      "Performance, SEO & deployment",
    ],
  },
  {
    key: "DATA",
    slug: "data-analysis-insights",
    name: "Data Analysis & Insights",
    short: "Data & insights",
    icon: ChartNoAxesCombined,
    caption:
      "Turn scattered data into clear reports that help you decide what to do next.",
    description:
      "Make sense of spreadsheets, operational data and business questions. Data cleaning, analysis and purposeful dashboards help you see patterns and understand the numbers behind them. Get usable findings with the context to act on them.",
    features: [
      "Data cleaning & exploration",
      "Power BI & Tableau dashboards",
      "Clear reporting & recommendations",
    ],
  },
  {
    key: "TUTORIALS",
    slug: "frontend-backend-development-tutorials",
    name: "Frontend & Backend Development Tutorials",
    short: "Development tutorials",
    icon: GraduationCap,
    caption:
      "Build practical development skills through guided lessons and projects you can explain and extend.",
    description:
      "Learn frontend and backend development through virtual sessions matched to your starting point. Build real projects, work through problems and understand why the code works. Sessions combine guided practice, feedback and clear next steps.",
    features: [
      "Personalized virtual lessons",
      "Frontend & backend projects",
      "Code review & practical feedback",
    ],
  },
  {
    key: "AUTOMATION",
    slug: "ai-automation-solutions",
    name: "AI Automation Solutions",
    short: "AI automation",
    icon: Workflow,
    caption:
      "Reduce repetitive work with AI-assisted workflows designed around your team’s everyday tasks.",
    description:
      "Connect the tools you already use and reduce repetitive manual steps. We identify useful automation opportunities, build workflows and include human review where it matters. Documentation and practical guidance help your team run the solution confidently.",
    features: [
      "Workflow discovery & mapping",
      "AI-assisted integrations",
      "Human review & monitoring",
    ],
  },
  {
    key: "CUSTOMER_SUPPORT",
    slug: "customer-support-solutions",
    name: "Customer Support Solutions",
    short: "Customer support",
    icon: Headset,
    caption:
      "Make it easier to manage customer questions and give consistent, useful responses.",
    description:
      "Give customer conversations a clearer process, from the first question to resolution. Set up support tools, useful knowledge resources and sensible routing for your team. The outcome is a support workflow that is easier to manage and improve.",
    features: [
      "Helpdesk setup & organization",
      "Knowledge bases & response guides",
      "Support workflow improvements",
    ],
  },
  {
    key: "IT_SUPPORT",
    slug: "it-support",
    name: "IT Support",
    short: "IT support",
    icon: MonitorCog,
    caption:
      "Resolve technical obstacles and keep the tools you depend on working reliably.",
    description:
      "Get practical help with the technical issues that interrupt your work. Troubleshoot software, configure everyday tools and make your setup easier to maintain. Support scope and availability are agreed before work begins.",
    features: [
      "Software troubleshooting",
      "Tool setup & configuration",
      "Ongoing support by agreement",
    ],
  },
  {
    key: "CONTENT",
    slug: "ai-powered-content-creation",
    name: "AI-Powered Content Creation",
    short: "Content creation",
    icon: PenTool,
    caption:
      "Turn your expertise into clear, useful content with AI-assisted production and human review.",
    description:
      "Create content that reflects your business and answers your audience’s questions. AI-assisted drafting is paired with editing for accuracy, clarity and tone. Get structured content for your website, social channels or campaigns.",
    features: [
      "Website & social content",
      "Content planning & repurposing",
      "Human editing & brand consistency",
    ],
  },
  {
    key: "DESIGN",
    slug: "ai-powered-graphic-design",
    name: "AI-Powered Graphic Design",
    short: "Graphic design",
    icon: Shapes,
    caption:
      "Communicate your ideas with coherent visual assets shaped around your brand and message.",
    description:
      "Translate your brief into clear visual communication with AI-assisted exploration and considered refinement. Create graphics for social posts, campaigns and digital content. Deliverables and usage requirements are agreed upfront.",
    features: [
      "Digital campaign graphics",
      "Social media visual assets",
      "Consistent brand-led direction",
    ],
  },
] as const;
export const serviceKeys = [
  "WEB",
  "DATA",
  "TUTORIALS",
  "AUTOMATION",
  "CUSTOMER_SUPPORT",
  "IT_SUPPORT",
  "CONTENT",
  "DESIGN",
] as const;
export const processSteps = [
  [
    "Discover",
    "Start with the right questions.",
    "We talk through your goals, challenges and what a useful outcome looks like.",
  ],
  [
    "Plan",
    "Know what happens next.",
    "Agree on a practical scope, deliverables and a timeline before the work begins.",
  ],
  [
    "Build",
    "See your ideas take shape.",
    "Work progresses with clear updates and opportunities for focused feedback.",
  ],
  [
    "Support",
    "Move forward with confidence.",
    "Get a thoughtful handover and agree on any ongoing support you need.",
  ],
];
export const socials = [
  ["LinkedIn", "https://www.linkedin.com/in/yolestica"],
  ["X", "https://x.com/yolestica"],
  ["Facebook", "https://www.facebook.com/Yoletech"],
  ["Instagram", "https://www.instagram.com/Yoletech12"],
  ["TikTok", "https://www.tiktok.com/@yoletech"],
  ["YouTube", "https://www.youtube.com/@yole-tech"],
];
export const navLinks = [
  ["HOME", "/"],
  ["ABOUT", "/about"],
  ["SERVICES", "/services"],
  ["PRICING", "/pricing"],
  ["BLOG", "/blog"],
  ["CONTACT", "/contact"],
];
export const whatsapp = "https://wa.me/2348025526389";
