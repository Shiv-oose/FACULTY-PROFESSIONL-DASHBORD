import { Hono } from 'npm:hono@4';
import { cors } from 'npm:hono@4/cors';
import { logger } from 'npm:hono@4/logger';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Middleware
app.use('*', cors());
app.use('*', logger(console.log));

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// Helper function to verify user or create demo user
async function getUserOrDemo(authorization: string | null) {
  // Try to verify authenticated user
  if (authorization) {
    const token = authorization.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (user && !error) {
      return { userId: user.id, isDemo: false };
    }
  }
  
  // Use demo user ID for anonymous access
  const demoUserId = 'demo-user-faculty-track';
  return { userId: demoUserId, isDemo: true };
}

// Helper function to strictly verify an authenticated user
async function verifyUser(authorization: string | null) {
  if (!authorization) {
    return null;
  }
  const token = authorization.split(' ')[1];
  if (!token) {
    return null;
  }
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) {
    return null;
  }
  return user;
}

// Helper function to calculate H-Index
function calculateHIndex(publications: any[]): number {
  if (!publications.length) return 0;
  
  const citations = publications
    .map(pub => pub.citations || 0)
    .sort((a, b) => b - a);
  
  let hIndex = 0;
  for (let i = 0; i < citations.length; i++) {
    if (citations[i] >= i + 1) {
      hIndex = i + 1;
    } else {
      break;
    }
  }
  
  return hIndex;
}

// ============= FACULTY MANAGEMENT (ADMIN) =============
app.get('/make-server-936dcc19/faculty/list', async (c) => {
  try {
    const faculties = await kv.getByPrefix('faculty:list:');
    return c.json({ faculties: faculties || [] });
  } catch (error) {
    console.log('Error fetching faculty list:', error);
    return c.json({ error: 'Failed to fetch faculty list' }, 500);
  }
});

app.post('/make-server-936dcc19/faculty/create', async (c) => {
  try {
    const body = await c.req.json();
    const { name, email, department, position, joiningDate, username, password } = body;

    // Validate required fields
    if (!name || !email || !department || !position || !username || !password) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // Create faculty record
    const facultyId = crypto.randomUUID();
    const faculty = {
      id: facultyId,
      name,
      email,
      department,
      position,
      joiningDate,
      username,
      password, // In production, this should be hashed
      publications: 0,
      fdps: 0,
      hIndex: 0,
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    // Store faculty in list
    await kv.set(`faculty:list:${facultyId}`, faculty);

    // Initialize faculty profile
    await kv.set(`faculty:${facultyId}:profile`, {
      id: facultyId,
      name,
      email,
      department,
      currentPosition: position,
      joinedYear: new Date(joiningDate).getFullYear(),
      careerProgress: 0,
    });

    // Send email notification
    let emailSent = false;
    try {
      const emailResult = await sendCredentialsEmail(email, name, username, password);
      emailSent = emailResult.success;
    } catch (emailError) {
      console.log('Email sending failed:', emailError);
    }

    return c.json({ 
      success: true, 
      faculty,
      emailSent,
      message: emailSent 
        ? 'Faculty added and credentials sent via email'
        : 'Faculty added but email notification failed'
    });
  } catch (error) {
    console.log('Error creating faculty:', error);
    return c.json({ error: 'Failed to create faculty' }, 500);
  }
});

app.put('/make-server-936dcc19/faculty/update/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();

    // Get existing faculty data to preserve fields not being updated
    const existingFaculty = await kv.get(`faculty:list:${id}`);
    if (!existingFaculty) {
      return c.json({ error: 'Faculty not found' }, 404);
    }

    // Merge new data with existing data
    const updatedFaculty = {
      ...existingFaculty, // Start with the original record
      ...body, // Overwrite with new data from the form
      id: id, // Ensure the ID is not changed
      // Preserve calculated fields that are not part of the edit form
      publications: existingFaculty.publications,
      fdps: existingFaculty.fdps,
      hIndex: existingFaculty.hIndex,
      status: existingFaculty.status,
    };

    await kv.set(`faculty:list:${id}`, updatedFaculty);

    // Also update the faculty's profile data if it exists
    const facultyProfile = await kv.get(`faculty:${id}:profile`);
    if (facultyProfile) { // Only update fields that are present in the body
      const updatedProfile = {
        ...facultyProfile,
        ...body, // Apply the same updates
      };
      await kv.set(`faculty:${id}:profile`, updatedProfile);
    }

    return c.json({ success: true, faculty: updatedFaculty });
  } catch (error) {
    console.log('Error updating faculty:', error);
    return c.json({ error: 'Failed to update faculty' }, 500);
  }
});

app.delete('/make-server-936dcc19/faculty/delete/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    // Delete faculty from list
    await kv.del(`faculty:list:${id}`);
    
    // Delete all faculty data
    await Promise.all([
      kv.del(`faculty:${id}:profile`),
      kv.del(`faculty:${id}:publications`),
      kv.del(`faculty:${id}:skills`),
      kv.del(`faculty:${id}:fdps`),
      kv.del(`faculty:${id}:milestones`),
    ]);

    return c.json({ success: true });
  } catch (error) {
    console.log('Error deleting faculty:', error);
    return c.json({ error: 'Failed to delete faculty' }, 500);
  }
});

app.post('/make-server-936dcc19/faculty/resend-credentials', async (c) => {
  try {
    const { facultyId } = await c.req.json();
    
    const faculty = await kv.get(`faculty:list:${facultyId}`);
    if (!faculty) {
      return c.json({ error: 'Faculty not found' }, 404);
    }

    // Send email notification
    const emailResult = await sendCredentialsEmail(
      faculty.email,
      faculty.name,
      faculty.username,
      faculty.password
    );

    if (emailResult.success) {
      return c.json({ success: true, message: 'Credentials sent successfully' });
    } else {
      return c.json({ error: 'Failed to send email' }, 500);
    }
  } catch (error) {
    console.log('Error resending credentials:', error);
    return c.json({ error: 'Failed to resend credentials' }, 500);
  }
});

// Helper function to send credentials via email
async function sendCredentialsEmail(
  email: string,
  name: string,
  username: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    
    if (!resendApiKey) {
      console.log('RESEND_API_KEY not configured, skipping email');
      return { success: false, error: 'Email service not configured' };
    }

    const emailBody = {
      from: 'RNTU Faculty Portal <noreply@rntu.edu.in>',
      to: [email],
      subject: 'Welcome to RNTU Faculty Professional Track Dashboard',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #00D9FF 0%, #9D4EDD 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .credentials { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #00D9FF; }
            .credential-item { margin: 10px 0; }
            .credential-label { font-weight: bold; color: #666; }
            .credential-value { color: #00D9FF; font-family: monospace; font-size: 16px; }
            .button { display: inline-block; background: linear-gradient(135deg, #00D9FF 0%, #00E5CC 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to RNTU!</h1>
              <p>Faculty Professional Track Dashboard</p>
            </div>
            <div class="content">
              <p>Dear ${name},</p>
              <p>Welcome to Rabindranath Tagore University's Faculty Professional Track Dashboard. Your account has been successfully created.</p>
              
              <div class="credentials">
                <h3 style="margin-top: 0; color: #333;">Your Login Credentials</h3>
                <div class="credential-item">
                  <div class="credential-label">Username:</div>
                  <div class="credential-value">${username}</div>
                </div>
                <div class="credential-item">
                  <div class="credential-label">Password:</div>
                  <div class="credential-value">${password}</div>
                </div>
              </div>

              <p>With this dashboard, you can:</p>
              <ul>
                <li>Track your publications and citations</li>
                <li>Monitor your skill development</li>
                <li>Enroll in Faculty Development Programs (FDPs)</li>
                <li>Plan your career progression</li>
                <li>View your performance analytics</li>
              </ul>

              <a href="https://faculty-track.rntu.edu.in/login" class="button">Login to Dashboard</a>

              <p><strong>Security Note:</strong> Please change your password after your first login. Keep your credentials secure and do not share them with anyone.</p>

              <div class="footer">
                <p>© 2025 Rabindranath Tagore University</p>
                <p>For support, contact: support@rntu.edu.in</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailBody),
    });

    if (!response.ok) {
      const error = await response.text();
      console.log('Resend API error:', error);
      return { success: false, error: 'Failed to send email' };
    }

    return { success: true };
  } catch (error) {
    console.log('Error sending email:', error);
    return { success: false, error: String(error) };
  }
}

// ============= FACULTY PROFILE =============
app.get('/make-server-936dcc19/faculty/profile', async (c) => {
  try {
    const { userId } = await getUserOrDemo(c.req.header('Authorization'));

    const profile = await kv.get(`faculty:${userId}:profile`);
    
    if (!profile) {
      // Create default profile
      const defaultProfile = {
        id: userId,
        name: 'Dr. Sarah Johnson',
        email: 'demo@facultytrack.app',
        department: 'Computer Science',
        currentPosition: 'Senior Associate Professor',
        joinedYear: 2018,
        careerProgress: 78,
      };
      await kv.set(`faculty:${userId}:profile`, defaultProfile);
      return c.json(defaultProfile);
    }

    return c.json(profile);
  } catch (error) {
    console.log('Error fetching profile:', error);
    return c.json({ error: 'Failed to fetch profile' }, 500);
  }
});

app.put('/make-server-936dcc19/faculty/profile', async (c) => {
  try {
    const user = await verifyUser(c.req.header('authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    await kv.set(`faculty:${user.id}:profile`, { ...body, id: user.id });
    
    return c.json({ success: true, profile: body });
  } catch (error) {
    console.log('Error updating profile:', error);
    return c.json({ error: 'Failed to update profile' }, 500);
  }
});

// ============= PUBLICATIONS =============
app.get('/make-server-936dcc19/publications', async (c) => {
  try {
    const { userId } = await getUserOrDemo(c.req.header('Authorization'));

    const publications = await kv.get(`faculty:${userId}:publications`) || [];
    return c.json(publications);
  } catch (error) {
    console.log('Error fetching publications:', error);
    return c.json({ error: 'Failed to fetch publications' }, 500);
  }
});

app.post('/make-server-936dcc19/publications', async (c) => {
  try {
    const { userId } = await getUserOrDemo(c.req.header('Authorization'));

    const body = await c.req.json();
    const publications = await kv.get(`faculty:${userId}:publications`) || [];
    
    const newPublication = {
      id: crypto.randomUUID(),
      ...body,
      createdAt: new Date().toISOString(),
    };
    
    publications.push(newPublication);
    await kv.set(`faculty:${userId}:publications`, publications);
    
    return c.json({ success: true, publication: newPublication });
  } catch (error) {
    console.log('Error creating publication:', error);
    return c.json({ error: 'Failed to create publication' }, 500);
  }
});

app.delete('/make-server-936dcc19/publications/:id', async (c) => {
  try {
    const { userId } = await getUserOrDemo(c.req.header('Authorization'));

    const id = c.req.param('id');
    const publications = await kv.get(`faculty:${userId}:publications`) || [];
    
    const filtered = publications.filter((pub: any) => pub.id !== id);
    await kv.set(`faculty:${userId}:publications`, filtered);
    
    return c.json({ success: true });
  } catch (error) {
    console.log('Error deleting publication:', error);
    return c.json({ error: 'Failed to delete publication' }, 500);
  }
});

// ============= SKILLS =============
app.get('/make-server-936dcc19/skills', async (c) => {
  try {
    const { userId } = await getUserOrDemo(c.req.header('Authorization'));

    const skills = await kv.get(`faculty:${userId}:skills`) || [];
    return c.json(skills);
  } catch (error) {
    console.log('Error fetching skills:', error);
    return c.json({ error: 'Failed to fetch skills' }, 500);
  }
});

app.put('/make-server-936dcc19/skills', async (c) => {
  try {
    const { userId } = await getUserOrDemo(c.req.header('Authorization'));

    const body = await c.req.json();
    await kv.set(`faculty:${userId}:skills`, body);
    
    return c.json({ success: true, skills: body });
  } catch (error) {
    console.log('Error updating skills:', error);
    return c.json({ error: 'Failed to update skills' }, 500);
  }
});

// ============= FDPs =============
app.get('/make-server-936dcc19/fdps', async (c) => {
  try {
    const { userId } = await getUserOrDemo(c.req.header('Authorization'));

    const fdps = await kv.get(`faculty:${userId}:fdps`) || { upcoming: [], completed: [] };
    return c.json(fdps);
  } catch (error) {
    console.log('Error fetching FDPs:', error);
    return c.json({ error: 'Failed to fetch FDPs' }, 500);
  }
});

app.post('/make-server-936dcc19/fdps/enroll', async (c) => {
  try {
    const { userId } = await getUserOrDemo(c.req.header('Authorization'));

    const body = await c.req.json();
    const fdps = await kv.get(`faculty:${userId}:fdps`) || { upcoming: [], completed: [] };
    
    const newFDP = {
      id: crypto.randomUUID(),
      ...body,
      enrolledAt: new Date().toISOString(),
      status: 'enrolled',
    };
    
    fdps.upcoming.push(newFDP);
    await kv.set(`faculty:${userId}:fdps`, fdps);
    
    return c.json({ success: true, fdp: newFDP });
  } catch (error) {
    console.log('Error enrolling in FDP:', error);
    return c.json({ error: 'Failed to enroll in FDP' }, 500);
  }
});

app.post('/make-server-936dcc19/fdps/:id/complete', async (c) => {
  try {
    const { userId } = await getUserOrDemo(c.req.header('Authorization'));

    const id = c.req.param('id');
    const fdps = await kv.get(`faculty:${userId}:fdps`) || { upcoming: [], completed: [] };
    
    const fdpIndex = fdps.upcoming.findIndex((f: any) => f.id === id);
    if (fdpIndex === -1) {
      return c.json({ error: 'FDP not found' }, 404);
    }
    
    const completedFDP = {
      ...fdps.upcoming[fdpIndex],
      completedAt: new Date().toISOString(),
      status: 'completed',
    };
    
    fdps.upcoming.splice(fdpIndex, 1);
    fdps.completed.push(completedFDP);
    
    await kv.set(`faculty:${userId}:fdps`, fdps);
    
    return c.json({ success: true, fdp: completedFDP });
  } catch (error) {
    console.log('Error completing FDP:', error);
    return c.json({ error: 'Failed to complete FDP' }, 500);
  }
});

// ============= CAREER MILESTONES =============
app.get('/make-server-936dcc19/career/milestones', async (c) => {
  try {
    const { userId } = await getUserOrDemo(c.req.header('Authorization'));

    const milestones = await kv.get(`faculty:${userId}:milestones`) || [];
    return c.json(milestones);
  } catch (error) {
    console.log('Error fetching milestones:', error);
    return c.json({ error: 'Failed to fetch milestones' }, 500);
  }
});

app.post('/make-server-936dcc19/career/milestones', async (c) => {
  try {
    const { userId } = await getUserOrDemo(c.req.header('Authorization'));

    const body = await c.req.json();
    const milestones = await kv.get(`faculty:${userId}:milestones`) || [];
    
    const newMilestone = {
      id: crypto.randomUUID(),
      ...body,
      createdAt: new Date().toISOString(),
    };
    
    milestones.push(newMilestone);
    await kv.set(`faculty:${userId}:milestones`, milestones);
    
    return c.json({ success: true, milestone: newMilestone });
  } catch (error) {
    console.log('Error creating milestone:', error);
    return c.json({ error: 'Failed to create milestone' }, 500);
  }
});

// ============= ANALYTICS & INSIGHTS =============
app.get('/make-server-936dcc19/analytics/dashboard', async (c) => {
  try {
    const { userId } = await getUserOrDemo(c.req.header('Authorization'));

    // Fetch all data
    const [publications, skills, fdps, profile] = await Promise.all([
      kv.get(`faculty:${userId}:publications`) || [],
      kv.get(`faculty:${userId}:skills`) || [],
      kv.get(`faculty:${userId}:fdps`) || { upcoming: [], completed: [] },
      kv.get(`faculty:${userId}:profile`) || {},
    ]);

    // Calculate analytics
    const totalPublications = publications.length;
    const totalCitations = publications.reduce((sum: number, pub: any) => sum + (pub.citations || 0), 0);
    const hIndex = calculateHIndex(publications);
    const completedFDPs = fdps.completed?.length || 0;
    
    // Calculate yearly trends
    const currentYear = new Date().getFullYear();
    const yearlyData = [];
    for (let i = 4; i >= 0; i--) {
      const year = currentYear - i;
      const yearPubs = publications.filter((pub: any) => pub.year === year);
      yearlyData.push({
        year: year.toString(),
        publications: yearPubs.length,
        citations: yearPubs.reduce((sum: number, pub: any) => sum + (pub.citations || 0), 0),
      });
    }

    return c.json({
      metrics: {
        totalPublications,
        totalCitations,
        hIndex,
        completedFDPs,
      },
      yearlyData,
      careerProgress: profile.careerProgress || 78,
    });
  } catch (error) {
    console.log('Error fetching analytics:', error);
    return c.json({ error: 'Failed to fetch analytics' }, 500);
  }
});

// ============= SEED DATA FOR DEMO =============
app.post('/make-server-936dcc19/seed-demo-data', async (c) => {
  try {
    const { userId } = await getUserOrDemo(c.req.header('Authorization'));

    // Seed publications
    const publications = [
      {
        id: crypto.randomUUID(),
        year: 2024,
        title: 'AI-Driven Personalized Learning in Higher Education',
        venue: 'IEEE Transactions on Education',
        citations: 45,
        impact: 3.8,
        tier: 'top',
        coAuthors: ['Dr. Wilson', 'Dr. Patel'],
        createdAt: new Date().toISOString(),
      },
      {
        id: crypto.randomUUID(),
        year: 2024,
        title: 'Blockchain for Academic Credential Verification',
        venue: 'International Conference on Learning Analytics',
        citations: 32,
        impact: 2.9,
        tier: 'high',
        coAuthors: ['Dr. Kim', 'Dr. Rodriguez'],
        createdAt: new Date().toISOString(),
      },
      {
        id: crypto.randomUUID(),
        year: 2023,
        title: 'Gamification in Computer Science Education',
        venue: 'ACM Transactions on Computing Education',
        citations: 78,
        impact: 4.2,
        tier: 'top',
        coAuthors: ['Dr. Wilson', 'Dr. Chen', 'Dr. Taylor'],
        createdAt: new Date().toISOString(),
      },
    ];

    // Seed skills
    const skills = [
      { skill: 'Research', current: 90, target: 95 },
      { skill: 'Teaching', current: 85, target: 90 },
      { skill: 'Leadership', current: 65, target: 85 },
      { skill: 'Digital', current: 70, target: 90 },
      { skill: 'Domain Expertise', current: 92, target: 95 },
      { skill: 'Communication', current: 80, target: 85 },
    ];

    // Seed FDPs
    const fdps = {
      upcoming: [
        {
          id: crypto.randomUUID(),
          title: 'Academic Leadership Excellence',
          category: 'Leadership',
          duration: '5 days',
          dates: 'Jan 15-20, 2025',
          location: 'Online',
          participants: 45,
          match: 94,
          color: '#00D9FF',
          registrationDeadline: '5 days left',
          urgent: true,
          status: 'enrolled',
        },
      ],
      completed: [
        {
          id: crypto.randomUUID(),
          title: 'Advanced Research Methodology',
          category: 'Research',
          completedDate: 'Nov 2024',
          duration: '3 days',
          certificate: true,
          skills: ['Research Design', 'Data Analysis', 'Statistical Methods'],
          color: '#0096FF',
          status: 'completed',
        },
      ],
    };

    await Promise.all([
      kv.set(`faculty:${userId}:publications`, publications),
      kv.set(`faculty:${userId}:skills`, skills),
      kv.set(`faculty:${userId}:fdps`, fdps),
    ]);

    return c.json({ success: true, message: 'Demo data seeded successfully' });
  } catch (error) {
    console.log('Error seeding data:', error);
    return c.json({ error: 'Failed to seed data' }, 500);
  }
});

// Health check
app.get('/make-server-936dcc19/health', (c) => {
  return c.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

Deno.serve(app.fetch);