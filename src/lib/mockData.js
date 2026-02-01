import { TAGS } from "./tags";

// Platform Logos and Links
const PLATFORMS = [
  { name: "Unstop", logo: "/logo/opps.jpeg", url: "https://unstop.com" },
  { name: "Devfolio", logo: "/logo/devpost.jpeg", url: "https://devfolio.co" },
  { name: "GovTech", logo: "/logo/gov.jpeg", url: "https://www.startupindia.gov.in/" }, 
  { name: "Devpost", logo: "/logo/devpost.jpeg", url: "https://devpost.com" }
];

// Helper to generate events
const generateEvents = (count, type, startId, baseTags, baseImages) => {
  const events = [];
  const locations = ["Delhi, India", "Bangalore, India", "Mumbai, India", "Remote", "Hyderabad, India", "Pune, India", "Chennai, India"];
  const organizers = ["IIT Delhi", "BITS Pilani", "Microsoft", "Google GDG", "Meta", "Polygon", "Ethereum Foundation", "Stanford", "MIT", "AWS"];
  const titles = {
      Hackathon: ["Hack", "Code", "Build", "Sprint", "Jam", "Dash", "Marathon", "Flow"],
      Workshop: ["Masterclass", "Bootcamp", "101", "Deep Dive", "Workshop", "Seminar", "Lab", "Training"],
      Cultural: ["Fest", "Nite", "Bash", "Gala", "Carnival", "Fiesta", "Wave", "Vibe"]
  };
  const descriptors = ["Future", "NextGen", "Global", "Campus", "Innovate", "Create", "Spark", "Fusion", "Tech", "Cyber"];

  for (let i = 0; i < count; i++) {
     const title = `${descriptors[i % descriptors.length]} ${type} ${titles[type][i % titles[type].length]} ${2024 + (i%2)}`;
     const id = startId + i;
     
     // Deterministic Tag Rotation
     const rotation = i % baseTags.length;
     const shuffledTags = [...baseTags.slice(rotation), ...baseTags.slice(0, rotation)];
     const tags = shuffledTags.slice(0, 2 + (i % 2));

     // Assign Platform
     const platform = PLATFORMS[i % PLATFORMS.length];

     // Prize Value Parsing for Sorting
     const rawPrize = (i % 3 === 0) ? "$10,000" : (i % 3 === 1) ? "₹5,00,000" : "Swag & Certs";
     let prizeVal = 0;
     if (rawPrize.includes("$")) prizeVal = parseInt(rawPrize.replace(/\D/g, '')) * 83; // Convert USD to INR roughly
     else if (rawPrize.includes("₹")) prizeVal = parseInt(rawPrize.replace(/\D/g, ''));
     
     events.push({
        id,
        title,
        organizer: organizers[i % organizers.length],
        type,
        tags,
        platform: platform,
        externalLink: platform.url,
        date: `2024-${10 + (i%3)}-${10 + (i%20)}`,
        location: locations[i % locations.length],
        image: baseImages[i % baseImages.length],
        prize: rawPrize,
        prizeValue: prizeVal,
        impressions: Math.floor(Math.random() * 5000) + 500, // Random impressions count
        teamSize: type === 'Hackathon' ? "1-4" : "Individual",
        description: `Join the ${title} to experience the best of ${tags[0]}.`,
        coordinates: { lat: 28.6 + ((i * 0.01) % 0.5), lng: 77.2 + ((i * 0.01) % 0.5) },
        featured: i % 10 === 0, // Every 10th is featured
        details: {
             description: `A massive gathering for ${tags.join(" and ")} enthusiasts. Registration managed by ${platform.name}.`,
             responsibilities: ["Participate", "Learn", "Network", "Win"],
             deadline: "2024-10-01",
             contact: { email: "contact@event.com", phone: "+91 99999 99999" },
             perks: ["Certificates", "Food", "Swag"],
             stats: { daysLeft: 10 + (i % 20), eligible: true }
        }
     });
  }
  return events;
};

const HACKATHON_IMITS = [
    "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1639322537228-ad7117a3949b?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1000"
];

const WORKSHOP_IMITS = [
    "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1642104704074-907c0698cbd9?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1000"
];

const CULTURAL_IMITS = [
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1000"
];

export const MAJOR_EVENTS = [
  {
     id: "lfx-spring-2026",
     title: "LFX Mentorship",
     name: "LFX Mentorship", // Backwards compat
     deadline: "2026-02-10", 
     link: "https://lfx.linuxfoundation.org/mentorship/",
     color: "text-neon-green",
     type: "Mentorship",
     description: "Open source mentorship program by Linux Foundation.",
     organizer: "Linux Foundation",
     location: "Remote",
     image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1000",
     tags: ["Open Source", "Mentorship", "Code"],
     prize: "Stipend",
     prizeValue: 500000,
     date: "2026-02-10",
     coordinates: { lat: 0, lng: 0 }
  },
  {
     id: "gsoc-2026",
     title: "Google Summer of Code",
     name: "Google Summer of Code",
     deadline: "2026-03-31",
     link: "https://summerofcode.withgoogle.com/",
     color: "text-neon-orange",
     type: "Mentorship",
     description: "Global program focused on bringing more student developers into open source.",
     organizer: "Google",
     location: "Remote",
     image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1000",
     tags: ["Open Source", "Google", "Development"],
     prize: "Stipend",
     prizeValue: 1000000,
     date: "2026-03-31",
     coordinates: { lat: 0, lng: 0 }
  },
  {
     id: "sih-2026",
     title: "Smart India Hackathon",
     name: "Smart India Hackathon",
     deadline: "2026-09-15",
     link: "https://www.sih.gov.in/",
     color: "text-neon-blue",
     type: "Hackathon",
     description: "World's biggest open innovation model.",
     organizer: "Govt of India",
     location: "India",
     image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1000",
     tags: ["Innovation", "Hackathon", "Government"],
     prize: "₹1,00,000",
     prizeValue: 100000,
     date: "2026-09-15",
     coordinates: { lat: 28.61, lng: 77.20 }
  },
  {
     id: "build-bharat-2026",
     title: "Build for Bharat",
     name: "Build for Bharat",
     deadline: "2026-04-20",
     link: "https://buildforbharat.ai/",
     color: "text-neon-purple",
     type: "Hackathon",
     description: "Solving India's hardest problems.",
     organizer: "ONDC",
     location: "Bangalore",
     image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1000",
     tags: ["AI", "Bharat", "Startup"],
     prize: "₹10,00,000",
     prizeValue: 1000000,
     date: "2026-04-20",
     coordinates: { lat: 0, lng: 0 }
  },
  {
     id: "hacktoberfest-2026",
     title: "Hacktoberfest",
     name: "Hacktoberfest",
     deadline: "2026-10-01",
     link: "https://hacktoberfest.com/",
     color: "text-neon-orange",
     type: "Open Source",
     description: "Celebration of Open Source.",
     organizer: "DigitalOcean",
     location: "Remote",
     image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1000",
     tags: ["Open Source", "Git", "Community"],
     prize: "Swag",
     prizeValue: 0,
     date: "2026-10-01",
     coordinates: { lat: 0, lng: 0 }
  }
];

export const EVENTS = [
  ...MAJOR_EVENTS,
  ...generateEvents(50, "Hackathon", 100, TAGS.Hackathons, HACKATHON_IMITS),
  ...generateEvents(50, "Workshop", 200, TAGS.Workshops, WORKSHOP_IMITS),
  ...generateEvents(50, "Cultural", 300, TAGS.Cultural, CULTURAL_IMITS)
];

export const MOCK_USER = {
  name: "Dakshesh",
  email: "demo@visualvortex.com",
  avatar: "https://github.com/shadcn.png",
  interests: ["UI/UX Design", "AI/ML", "Web3"],
  location: "Delhi, India",
  coordinates: { lat: 28.6139, lng: 77.2090 }, // Delhi Coords
  freeDays: ["Saturday", "Sunday"],
  history: [],
  bookmarks: []
};
