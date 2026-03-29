import Head from 'next/head';
import { useState, useRef, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { courses } from '../data/courses';
import styles from './ai-tutor.module.css';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTED = [
  'Explain the pillars of Islam',
  'Teach me basic Spanish phrases',
  'How do I start learning Python?',
  'What are the fundamentals of music theory?',
  'Give me a business idea to start today',
  'Help me understand JavaScript promises',
  'What are the best leadership qualities?',
  'How do I learn piano as a beginner?',
];

export default function AITutorPage() {
  const [selectedCourse, setSelectedCourse] = useState<string>('general');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const getCourseContext = () => {
    if (selectedCourse === 'general') return 'general learning across all subjects';
    const c = courses.find((c) => c.id === selectedCourse);
    return c ? `${c.title} (${c.category})` : 'general learning';
  };

  const sendMessage = async (text?: string) => {
    const userText = (text || input).trim();
    if (!userText || loading) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: userText }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    setError('');

    const systemPrompt = `You are an expert AI tutor for Planet Leads Academy, a premium online learning platform based in Brooklyn, NY. You are currently helping a student focused on: ${getCourseContext()}.

Your role:
- Teach clearly with examples, analogies, and step-by-step breakdowns
- Be encouraging and supportive — students learn best when they feel confident
- Adapt your depth to the student's apparent level based on their questions
- Use formatting (numbered lists, bullet points) where it helps clarity
- When relevant, mention that Planet Leads Academy has a full course on this topic at https://planet-leads-academy.netlify.app/courses
- Keep responses focused and actionable — no fluff

Planet Leads Academy offers 25 AI-powered courses across: Faith & Spirituality (Islamic Scholar AI, Bible Scholar AI, Torah Scholar AI), Languages (Spanish, French, Mandarin, Japanese, Korean, Portuguese, German, Italian, Arabic, Russian), Music (Piano, Guitar, Music Theory), Programming (Python, JavaScript, Web Development, Mobile Development), and Business (Entrepreneurship, Leadership Mastery, Data Analytics, Project Management, Digital Marketing).`;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          system: systemPrompt,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to get response');
      }

      const data = await response.json();
      setMessages([...newMessages, { role: 'assistant', content: data.content }]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError('');
    inputRef.current?.focus();
  };

  return (
    <>
      <Head>
        <title>AI Tutor — Planet Leads Academy</title>
        <meta name="description" content="Chat with your personal AI tutor powered by Planet Leads Academy. Ask anything about any of our 25 courses." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className={styles.page}>
        <Navbar />

        <main className={styles.main}>
          <div className={styles.sidebar}>
            <div className={styles.sidebarInner}>
              <h2 className={styles.sidebarTitle}>🤖 AI Tutor</h2>
              <p className={styles.sidebarSub}>Select a course topic to get personalized guidance</p>

              <div className={styles.courseSelect}>
                <label className={styles.selectLabel}>Focus Area</label>
                <select
                  className={styles.select}
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                >
                  <option value="general">✨ General Learning</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.emoji} {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.suggestedSection}>
                <p className={styles.suggestedLabel}>Try asking:</p>
                <div className={styles.suggestions}>
                  {SUGGESTED.map((s) => (
                    <button
                      key={s}
                      className={styles.suggestion}
                      onClick={() => sendMessage(s)}
                      disabled={loading}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {messages.length > 0 && (
                <button className={styles.clearBtn} onClick={clearChat}>
                  🗑 Clear Conversation
                </button>
              )}
            </div>
          </div>

          <div className={styles.chatArea}>
            <div className={styles.chatMessages}>
              {messages.length === 0 && (
                <div className={styles.empty}>
                  <div className={styles.emptyIcon}>🤖</div>
                  <h3 className={styles.emptyTitle}>Your AI Tutor is Ready</h3>
                  <p className={styles.emptySub}>
                    Ask me anything about any subject — I&apos;m here to help you learn and grow.
                    {selectedCourse !== 'general' && (
                      <> Currently focused on: <strong>{courses.find(c => c.id === selectedCourse)?.title}</strong></>
                    )}
                  </p>
                </div>
              )}

              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`${styles.message} ${msg.role === 'user' ? styles.userMsg : styles.aiMsg}`}
                >
                  <div className={styles.msgAvatar}>
                    {msg.role === 'user' ? '👤' : '🤖'}
                  </div>
                  <div className={styles.msgBubble}>
                    <div className={styles.msgRole}>
                      {msg.role === 'user' ? 'You' : 'AI Tutor'}
                    </div>
                    <div
                      className={styles.msgContent}
                      dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
                    />
                  </div>
                </div>
              ))}

              {loading && (
                <div className={`${styles.message} ${styles.aiMsg}`}>
                  <div className={styles.msgAvatar}>🤖</div>
                  <div className={styles.msgBubble}>
                    <div className={styles.msgRole}>AI Tutor</div>
                    <div className={styles.typing}>
                      <span /><span /><span />
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className={styles.errorMsg}>
                  ⚠️ {error}
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            <div className={styles.inputArea}>
              <div className={styles.inputWrap}>
                <textarea
                  ref={inputRef}
                  className={styles.input}
                  placeholder="Ask your AI tutor anything… (Enter to send, Shift+Enter for newline)"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={1}
                  disabled={loading}
                />
                <button
                  className={`${styles.sendBtn} ${loading || !input.trim() ? styles.sendDisabled : ''}`}
                  onClick={() => sendMessage()}
                  disabled={loading || !input.trim()}
                  aria-label="Send message"
                >
                  {loading ? '⏳' : '➤'}
                </button>
              </div>
              <p className={styles.inputHint}>
                Powered by Claude AI · Planet Leads Academy
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

function formatMessage(text: string): string {
  return text
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Code blocks
    .replace(/```[\w]*\n?([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Numbered lists
    .replace(/^\d+\.\s(.+)$/gm, '<li>$1</li>')
    // Bullet lists
    .replace(/^[-•]\s(.+)$/gm, '<li>$1</li>')
    // Wrap consecutive <li> in <ul>
    .replace(/(<li>.*<\/li>\n?)+/g, (m) => `<ul>${m}</ul>`)
    // Headers
    .replace(/^###\s(.+)$/gm, '<h4>$1</h4>')
    .replace(/^##\s(.+)$/gm, '<h3>$1</h3>')
    .replace(/^#\s(.+)$/gm, '<h2>$1</h2>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    // Line breaks
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br/>')
    .replace(/^(.+)$/, '<p>$1</p>');
}
