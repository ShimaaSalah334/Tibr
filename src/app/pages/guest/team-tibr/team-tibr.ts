import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

interface TeamMember {
  image: string;
  social: { linkedin: string; twitter: string; email: string };
}
@Component({
  selector: 'app-team-tibr',
  imports: [CommonModule, TranslatePipe],
  templateUrl: './team-tibr.html',
  styleUrl: './team-tibr.css',
})
export class TeamTibr {
teamMembers: TeamMember[] = [
    {
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80',
      social: { linkedin: '#', twitter: '#', email: 'ceo@tibr.com' }
    },
    {
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
      social: { linkedin: '#', twitter: '#', email: 'cto@tibr.com' }
    },
    {
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
      social: { linkedin: '#', twitter: '#', email: 'security@tibr.com' }
    },
    {
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      social: { linkedin: '#', twitter: '#', email: 'design@tibr.com' }
    },
    {
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
      social: { linkedin: '#', twitter: '#', email: 'advisor@tibr.com' }
    }
  ];
}
