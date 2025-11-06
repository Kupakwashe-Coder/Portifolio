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

function generateResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('skill') || lowerMessage.includes('technology') || lowerMessage.includes('tech stack') || lowerMessage.includes('what can')) {
    return "Decent's technical skills include JavaScript, TypeScript, React, Tailwind CSS, HTML/CSS, Git, SQL, and Python. He's passionate about full-stack development, writing clean and maintainable code, and creating beautiful user interfaces. His expertise spans modern web technologies and best practices.";
  }
  
  if (lowerMessage.includes('project')) {
    return "Decent has worked on several impressive projects:\n\n1. E-Learning Platform - A full-stack platform with authentication, course catalog, quizzes, and progress tracking (React, Node.js, MongoDB, Stripe)\n\n2. AI Resume Parser - An AI-powered tool that extracts skills, experience, and education from PDF/DOCX files (React, Node.js, NLP)\n\n3. Smart Notes - A modern note-taking app with search and tagging capabilities (React, Tailwind CSS)\n\nEach project demonstrates his full-stack capabilities and attention to user experience. You can check them out in the Projects section!";
  }
  
  if (lowerMessage.includes('education') || lowerMessage.includes('study') || lowerMessage.includes('learn') || lowerMessage.includes('training')) {
    return "Decent is currently studying at Uncommon.Org, pursuing comprehensive training in software development with a focus on modern web technologies and industry best practices. He's also volunteering as a Scratch Instructor, teaching coding to school children and young adults in his community. He's dedicated to continuous learning and helping others learn to code!";
  }
  
  if (lowerMessage.includes('contact') || lowerMessage.includes('hire') || lowerMessage.includes('email') || lowerMessage.includes('reach') || lowerMessage.includes('get in touch')) {
    return "You can reach Decent at kupakwashegwavava@gmail.com. You can also connect with him on GitHub (github.com/decentKG) and LinkedIn (linkedin.com/in/decentgwavava). He's currently open to new opportunities, collaborations, and tech discussions. Feel free to reach out!";
  }
  
  if (lowerMessage.includes('experience') || lowerMessage.includes('work') || lowerMessage.includes('background')) {
    return "Decent is currently a Software Developer Student at Uncommon.Org, focusing on full-stack development and modern web technologies. He also volunteers as a Scratch Instructor, teaching coding to young people. His key strengths include clean code practices, UI/UX design, performance optimization, and excellent team collaboration. He's passionate about using technology to solve real-world problems!";
  }
  
  if (lowerMessage.includes('who is') || lowerMessage.includes('tell me about') || lowerMessage.includes('introduce')) {
    return "Hi! I'm an AI assistant representing Decent Gwavava. He's a passionate software developer with expertise in full-stack development, modern web technologies, and creating beautiful user experiences. Currently studying at Uncommon.Org and volunteering as a Scratch Instructor. His tagline says it best: 'Turning Code into Impact — Building the Future, One Line at a Time.' What would you like to know more about?";
  }
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi ') || lowerMessage.includes('hey')) {
    return "Hi there! I'm Decent's AI assistant. I'm here to help you learn more about Decent Gwavava, his skills, projects, education, and how to reach him. Feel free to ask me anything about his portfolio or experience!";
  }
  
  return "Great question! I'm here to help you learn about Decent Gwavava and his work. Feel free to ask me about his skills, projects, education, experience, or how to get in touch with him. You can also explore the different sections of this portfolio!";
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { message, sessionId } = await req.json();

    if (!message || !sessionId) {
      return new Response(
        JSON.stringify({ error: 'Message and sessionId are required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const response = generateResponse(message);

    return new Response(
      JSON.stringify({ response }),
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
