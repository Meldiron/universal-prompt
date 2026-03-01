export interface AIPlatform {
  id: string
  name: string
  url: (prompt: string) => string
  icon: string
  color: string
  description: string
  type: 'web' | 'desktop' | 'search'
}

export const platforms: AIPlatform[] = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    url: (prompt) => `https://chatgpt.com/?q=${encodeURIComponent(prompt)}`,
    icon: '/icons/chatgpt.svg',
    color: '#10a37f',
    description: 'OpenAI',
    type: 'web',
  },
  {
    id: 'claude',
    name: 'Claude',
    url: (prompt) => `https://claude.ai/new?q=${encodeURIComponent(prompt)}`,
    icon: '/icons/claude.svg',
    color: '#d97757',
    description: 'Anthropic',
    type: 'web',
  },
  {
    id: 'gemini',
    name: 'Gemini',
    url: (prompt) => `https://gemini.google.com/app?q=${encodeURIComponent(prompt)}`,
    icon: '/icons/gemini.svg',
    color: '#4285f4',
    description: 'Google',
    type: 'web',
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    url: (prompt) => `https://www.perplexity.ai/search?q=${encodeURIComponent(prompt)}`,
    icon: '/icons/perplexity.svg',
    color: '#20808d',
    description: 'Perplexity AI',
    type: 'search',
  },
  {
    id: 'grok',
    name: 'Grok',
    url: (prompt) => `https://grok.com/?q=${encodeURIComponent(prompt)}`,
    icon: '/icons/grok.svg',
    color: '#ffffff',
    description: 'xAI',
    type: 'web',
  },
  {
    id: 'copilot',
    name: 'Copilot',
    url: (prompt) => `https://copilot.microsoft.com/?q=${encodeURIComponent(prompt)}`,
    icon: '/icons/copilot.svg',
    color: '#26c6da',
    description: 'Microsoft',
    type: 'web',
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    url: (prompt) => `https://chat.deepseek.com/?q=${encodeURIComponent(prompt)}`,
    icon: '/icons/deepseek.svg',
    color: '#4d6bfe',
    description: 'DeepSeek',
    type: 'web',
  },
  {
    id: 'lechat',
    name: 'Le Chat',
    url: (prompt) => `https://chat.mistral.ai/chat?q=${encodeURIComponent(prompt)}`,
    icon: '/icons/mistral.svg',
    color: '#ff7000',
    description: 'Mistral',
    type: 'web',
  },
  {
    id: 'huggingchat',
    name: 'HuggingChat',
    url: (prompt) => `https://huggingface.co/chat/?q=${encodeURIComponent(prompt)}`,
    icon: '/icons/huggingface.svg',
    color: '#ffd21e',
    description: 'Hugging Face',
    type: 'web',
  },
  {
    id: 'you',
    name: 'You.com',
    url: (prompt) => `https://you.com/search?q=${encodeURIComponent(prompt)}`,
    icon: '/icons/you.svg',
    color: '#8b5cf6',
    description: 'You.com',
    type: 'search',
  },
  {
    id: 'phind',
    name: 'Phind',
    url: (prompt) => `https://www.phind.com/search?q=${encodeURIComponent(prompt)}`,
    icon: '/icons/phind.svg',
    color: '#64ffda',
    description: 'Phind',
    type: 'search',
  },
  {
    id: 't3chat',
    name: 'T3 Chat',
    url: (prompt) => `https://t3.chat/new?q=${encodeURIComponent(prompt)}`,
    icon: '/icons/t3chat.svg',
    color: '#e879f9',
    description: 'T3 Chat',
    type: 'web',
  },
  {
    id: 'meta',
    name: 'Meta AI',
    url: (prompt) => `https://www.meta.ai/?q=${encodeURIComponent(prompt)}`,
    icon: '/icons/meta.svg',
    color: '#0668E1',
    description: 'Meta',
    type: 'web',
  },
  {
    id: 'raycast',
    name: 'Raycast',
    url: (prompt) =>
      `raycast://extensions/raycast/raycast-ai/ai-chat?fallbackText=${encodeURIComponent(prompt)}`,
    icon: '/icons/raycast.svg',
    color: '#ff6363',
    description: 'Desktop App',
    type: 'desktop',
  },
]

export function getPlatformById(id: string): AIPlatform | undefined {
  return platforms.find((p) => p.id === id)
}
