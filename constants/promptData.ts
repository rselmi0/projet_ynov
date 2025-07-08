import { PromptCategory, PromptItem } from '../types/ai';

export const promptCategories: PromptCategory[] = [
  {
    id: 'creative',
    name: 'Creative Writing',
    icon: 'Pen',
    prompts: [
      {
        id: 'story',
        title: 'Story Generator',
        content: 'Write a creative short story about a mysterious object found in an old attic. Include vivid descriptions and an unexpected twist.',
        category: 'creative',
        icon: 'BookOpen',
      },
      {
        id: 'poem',
        title: 'Poetry Assistant',
        content: 'Create a beautiful poem about the changing seasons. Use metaphors and imagery to capture the transition from winter to spring.',
        category: 'creative',
        icon: 'Feather',
      },
      {
        id: 'character',
        title: 'Character Development',
        content: 'Help me develop a compelling fictional character. Include their background, personality traits, motivations, and potential story arcs.',
        category: 'creative',
        icon: 'Users',
      },
    ],
  },
  {
    id: 'business',
    name: 'Business & Strategy',
    icon: 'Briefcase',
    prompts: [
      {
        id: 'marketing',
        title: 'Marketing Strategy',
        content: 'Create a comprehensive marketing strategy for a new product launch. Include target audience analysis, channels, and key messaging.',
        category: 'business',
        icon: 'TrendingUp',
      },
      {
        id: 'business-plan',
        title: 'Business Plan',
        content: 'Help me outline a business plan for a tech startup. Include market analysis, revenue model, and growth strategy.',
        category: 'business',
        icon: 'FileText',
      },
      {
        id: 'pitch',
        title: 'Pitch Deck',
        content: 'Create a compelling pitch deck outline for investors. Include problem statement, solution, market opportunity, and financial projections.',
        category: 'business',
        icon: 'PresentationChart',
      },
    ],
  },
  {
    id: 'learning',
    name: 'Learning & Education',
    icon: 'GraduationCap',
    prompts: [
      {
        id: 'explain',
        title: 'Concept Explanation',
        content: 'Explain quantum computing in simple terms that a beginner can understand. Use analogies and examples to make it clear.',
        category: 'learning',
        icon: 'Lightbulb',
      },
      {
        id: 'study-plan',
        title: 'Study Plan',
        content: 'Create a structured study plan for learning a new programming language. Include milestones, resources, and practice projects.',
        category: 'learning',
        icon: 'Calendar',
      },
      {
        id: 'quiz',
        title: 'Quiz Generator',
        content: 'Create a challenging quiz about world history with 10 multiple-choice questions. Include explanations for each answer.',
        category: 'learning',
        icon: 'HelpCircle',
      },
    ],
  },
  {
    id: 'coding',
    name: 'Programming',
    icon: 'Code',
    prompts: [
      {
        id: 'debug',
        title: 'Code Review',
        content: 'Review my code for best practices, potential bugs, and performance improvements. Provide specific suggestions and explanations.',
        category: 'coding',
        icon: 'Bug',
      },
      {
        id: 'algorithm',
        title: 'Algorithm Design',
        content: 'Help me design an efficient algorithm to solve a specific problem. Explain the approach, time complexity, and implementation details.',
        category: 'coding',
        icon: 'Cpu',
      },
      {
        id: 'architecture',
        title: 'System Architecture',
        content: 'Design a scalable system architecture for a web application. Include database design, API structure, and deployment considerations.',
        category: 'coding',
        icon: 'Layers',
      },
    ],
  },
  {
    id: 'productivity',
    name: 'Productivity',
    icon: 'Zap',
    prompts: [
      {
        id: 'schedule',
        title: 'Time Management',
        content: 'Help me create an optimal daily schedule that balances work, personal time, and self-care. Include time-blocking techniques.',
        category: 'productivity',
        icon: 'Clock',
      },
      {
        id: 'goals',
        title: 'Goal Setting',
        content: 'Help me set SMART goals for the next quarter. Include specific actions, measurable outcomes, and accountability measures.',
        category: 'productivity',
        icon: 'Target',
      },
      {
        id: 'habits',
        title: 'Habit Formation',
        content: 'Create a plan to build positive habits and break negative ones. Include strategies for consistency and motivation.',
        category: 'productivity',
        icon: 'Repeat',
      },
    ],
  },
];

// Simplified prompt list for labels
export const quickPrompts: PromptItem[] = [
  {
    id: 'explain',
    title: 'Explain',
    content: 'Explain this concept in simple terms',
    category: 'learning',
  },
  {
    id: 'summarize',
    title: 'Summarize',
    content: 'Summarize the key points of this topic',
    category: 'productivity',
  },
  {
    id: 'brainstorm',
    title: 'Brainstorm',
    content: 'Help me brainstorm creative ideas for',
    category: 'creative',
  },
  {
    id: 'code-help',
    title: 'Code Help',
    content: 'Help me with this coding problem',
    category: 'coding',
  },
  {
    id: 'write',
    title: 'Write',
    content: 'Help me write professional content about',
    category: 'business',
  },
  {
    id: 'analyze',
    title: 'Analyze',
    content: 'Analyze and provide insights on',
    category: 'business',
  },
  {
    id: 'translate',
    title: 'Translate',
    content: 'Translate this text to',
    category: 'productivity',
  },
  {
    id: 'improve',
    title: 'Improve',
    content: 'Help me improve this text',
    category: 'creative',
  },
]; 