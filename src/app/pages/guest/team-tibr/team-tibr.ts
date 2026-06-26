import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
  social: {
    linkedin: string;
    twitter: string;
    email: string;
  };
}
@Component({
  selector: 'app-team-tibr',
  imports: [CommonModule],
  templateUrl: './team-tibr.html',
  styleUrl: './team-tibr.css',
})
export class TeamTibr {
teamMembers: TeamMember[] = [
    {
      name: 'Ahmed Sabri',
      role: 'Chief Executive Officer (CEO)',
      bio: 'Over 10 years of leadership in digital financial platforms and structuring physical precious metal investments.',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80',
      social: { linkedin: '#', twitter: '#', email: 'ceo@tibr.com' }
    },
    {
      name: 'Karim Mahmoud',
      role: 'Chief Technology Officer (CTO)',
      bio: 'Expert architectural specialist building distributed cloud infrastructures and hyper-secure, instant execution trading engines.',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
      social: { linkedin: '#', twitter: '#', email: 'cto@tibr.com' }
    },
    {
      name: 'Sarah Abdelrahman',
      role: 'Head of Blockchain & Security',
      bio: 'Cybersecurity professional managing advanced cryptographic validations and end-to-end audits of physical safe-houses.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
      social: { linkedin: '#', twitter: '#', email: 'security@tibr.com' }
    },
    {
      name: 'Youssef Ali',
      role: 'Lead UI/UX Architect',
      bio: 'The creative visionary driving the premium aesthetic layout and seamless intuitive user experiences across desktop and mobile.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      social: { linkedin: '#', twitter: '#', email: 'design@tibr.com' }
    },
    {
      name: 'Mariam Hassan',
      role: 'Financial Investment Advisor',
      bio: 'Global market quantitative analyst specializing in real asset macro trends, spot gold, and tactical capital placement strategy.',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
      social: { linkedin: '#', twitter: '#', email: 'advisor@tibr.com' }
    }
  ];
}
