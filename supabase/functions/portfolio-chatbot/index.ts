import { createClient } from 'npm:@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

const PORTFOLIO_CONTEXT = `
You are an AI assistant for Decent Gwavava's portfolio website. Your role is to provide helpful, accurate information about Decent based on his portfolio.

ABOUT DECENT GWAVAVA:
- Name: Decent Gwavava
- Role: Passionate Software Developer
- Email: kupakwashegwavava@gmail.com
- GitHub: github.com/decentKG
- LinkedIn: linkedin.com/in/decentgwavava
- Tagline: "Turning Code into Impact — Building the Future, One Line at a Time"

EDUCATION & EXPERIENCE:
1. Software Developer Student at Uncommon.Org
   - Currently pursuing comprehensive training in software development
   - Focus areas: Modern web technologies, full-stack development, industry best practices
   - Skills: Full-Stack Development, Problem Solving, Agile Methodology

2. Volunteer Scratch Instructor - Community Outreach
   - Teaching school children and young adults how to code using Scratch
   - Fostering problem-solving skills and creativity in students
   - Skills: Scratch, Teaching, Mentorship, Community engagement

PERSONAL QUALITIES:
- Ambitious software developer committed to building efficient, user-friendly solutions
- Passionate about using technology to solve real-world problems
- Believes technology has the power to transform lives
- Strong in teamwork, adaptability, coding efficiency, and creativity

TECHNICAL SKILLS & TECHNOLOGIES:
- JavaScript
- TypeScript
- React
- Tailwind CSS
- HTML/CSS
- Git
- SQL
- Python

STRENGTHS:
1. Clean Code: Writing maintainable, scalable, and well-documented code
2. UI/UX Focus: Creating beautiful interfaces with excellent user experience
3. Performance: Optimizing applications for speed and efficiency
4. Collaboration: Working effectively in team environments and Agile workflows

FEATURED PROJECTS:

1. E-Learning Platform
   - Description: A full-stack e-learning platform with user authentication, course catalog, interactive lessons, quizzes, and progress tracking
   - Technologies: React, Node.js, MongoDB, Stripe
   - URL: https://e-learning-psi-azure.vercel.app/
   - Demonstrates: Full-stack development, payment integration, user authentication

2. AI Resume Parser
   - Description: An AI-powered resume parser that extracts key details (skills, experience, education) from PDFs and DOCX files with smart scoring
   - Technologies: React, Node.js, NLP, PDF Parsing
   - URL: https://ultimate-project-izoa.vercel.app/
   - Demonstrates: AI integration, document processing, data extraction

3. Smart Notes
   - Description: A modern note-taking app with fast search, tagging, and clean UX for organizing thoughts and tasks
   - Technologies: React, Tailwind CSS, Local Storage
   - URL: https://takunda-smarta.vercel.app/
   - Demonstrates: Frontend development, UX design, local data management

AVAILABILITY:
- Currently open to new opportunities and collaborations
- Available for projects, tech discussions, and networking
- Interested in roles that allow him to make an impact through technology

COMMUNICATION STYLE:
Be friendly, professional, and enthusiastic when discussing Decent's work and skills. Highlight his passion for technology and his commitment to creating impactful solutions. Always encourage visitors to reach out via the contact form or email if they want to connect directly with Decent.

IMPORTANT:
- Only answer questions about Decent Gwavava and his portfolio
- If asked about topics unrelated to Decent or his work, politely redirect to portfolio-related topics
- Encourage visitors to contact Decent directly for opportunities or collaborations
- Keep responses concise but informative
- Be enthusiastic about Decent's skills and projects
`;

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { message, sessionId, conversationHistory = [] } = await req.json();

    if (!message || !sessionId) {
      return new Response(
        JSON.stringify({ error: 'Message and sessionId are required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    await supabase.from('chat_conversations').insert({
      session_id: sessionId,
      message: message,
      role: 'user',
    });

    const messages: ChatMessage[] = [
      { role: 'assistant', content: PORTFOLIO_CONTEXT },
      ...conversationHistory.slice(-6),
      { role: 'user', content: message },
    ];

    const openAIKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openAIKey) {
      const fallbackResponse = generateFallbackResponse(message);
      
      await supabase.from('chat_conversations').insert({
        session_id: sessionId,
        message: fallbackResponse,
        role: 'assistant',
      });

      return new Response(
        JSON.stringify({ response: fallbackResponse }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: messages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!openAIResponse.ok) {
      throw new Error(`OpenAI API error: ${openAIResponse.status}`);
    }

    const data = await openAIResponse.json();
    const aiResponse = data.choices[0].message.content;

    await supabase.from('chat_conversations').insert({
      session_id: sessionId,
      message: aiResponse,
      role: 'assistant',
    });

    return new Response(
      JSON.stringify({ response: aiResponse }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process request', details: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function generateFallbackResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('skill') || lowerMessage.includes('technology') || lowerMessage.includes('tech stack')) {
    return "Decent's technical skills include JavaScript, TypeScript, React, Tailwind CSS, HTML/CSS, Git, SQL, and Python. He focuses on modern web development with expertise in full-stack development, clean code practices, and creating beautiful user interfaces.";
  }
  
  if (lowerMessage.includes('project')) {
    return "Decent has worked on several impressive projects including an E-Learning Platform with payment integration, an AI Resume Parser using NLP, and a Smart Notes app. You can view all his projects in the Projects section of this portfolio. Each project demonstrates his full-stack capabilities and attention to user experience.";
  }
  
  if (lowerMessage.includes('education') || lowerMessage.includes('study') || lowerMessage.includes('learn')) {
    return "Decent is currently studying at Uncommon.Org where he's pursuing comprehensive training in software development. He's also volunteering as a Scratch Instructor, teaching coding to school children and young adults in his community.";
  }
  
  if (lowerMessage.includes('contact') || lowerMessage.includes('hire') || lowerMessage.includes('email')) {
    return "You can reach Decent at kupakwashegwavava@gmail.com or connect with him on GitHub (github.com/decentKG) and LinkedIn (linkedin.com/in/decentgwavava). He's currently open to new opportunities and collaborations!";
  }
  
  if (lowerMessage.includes('experience') || lowerMessage.includes('work')) {
    return "Decent is currently a Software Developer Student at Uncommon.Org, focusing on full-stack development and modern web technologies. He also volunteers as a Scratch Instructor, teaching coding to young people. His strengths include clean code, UI/UX focus, performance optimization, and team collaboration.";
  }
  
  return "Hi! I'm here to help you learn about Decent Gwavava. He's a passionate software developer currently studying at Uncommon.Org. Feel free to ask me about his skills, projects, education, or how to contact him. You can also explore the different sections of this portfolio to learn more!";
}
