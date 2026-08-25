/**
 * Team / author registry — single source of truth for the people at
 * ShruggieTech.
 *
 * Used by the About page team grid, blog post author boxes, and the
 * BlogPosting JSON-LD author (name, jobTitle, image, sameAs). Keeping one
 * registry means a bio or social link edited once stays consistent everywhere
 * a person appears.
 *
 * Spec reference: §6.6 (About), §7.3 (Blog Post Template), §8.2 (JSON-LD)
 */

export interface SocialLink {
  href: string;
  label: string;
  icon: string; // key into an icon map (e.g. "Linkedin", "Github")
}

export interface TeamMemberData {
  name: string;
  title: string;
  description: string;
  image: string;
  socials: SocialLink[];
}

export const TEAM_MEMBERS: TeamMemberData[] = [
  {
    name: "William Thompson",
    title: "Co-Founder & Chief Architect",
    description:
      "Software architect, systems designer, and the author of ShruggieTech's internal products and published research. Background in cryptography, electronic warfare, and high-performance computing. Writes specifications that AI agents can execute without asking questions.",
    image: "https://cdn.shruggie.tech/avatars/william-thompson-toon.jpg",
    socials: [
      { href: "https://www.linkedin.com/in/willthompsonpro/", label: "LinkedIn", icon: "Linkedin" },
      { href: "https://github.com/h8rt3rmin8r", label: "GitHub", icon: "Github" },
    ],
  },
  {
    name: "Natalie Thompson",
    title: "Co-Founder & COO",
    description:
      "Self-taught full-stack developer, client relationship lead, and the person who makes everything actually happen. Pairs deep technical ability with the soft skills that keep complex projects moving forward. From branding to business development, she runs point on it all.",
    image: "https://cdn.shruggie.tech/avatars/natalie-thompson-toon.jpg",
    socials: [
      { href: "https://www.linkedin.com/in/cryptasian/", label: "LinkedIn", icon: "Linkedin" },
      { href: "https://www.facebook.com/cryptasian", label: "Facebook", icon: "Facebook" },
      { href: "https://www.instagram.com/cryptasian/", label: "Instagram", icon: "Instagram" },
      { href: "https://github.com/cryptasian", label: "GitHub", icon: "Github" },
    ],
  },
  {
    name: "Josiah Thompson",
    title: "Founders Assistant",
    description:
      "Josiah contributes to ShruggieTech's production work, assisting with social media content creation, blog article drafting, and website maintenance. His role is designed to build real professional skills early, equipping him with the technical fluency and operational discipline for a career in technology.",
    image: "https://cdn.shruggie.tech/avatars/josiah-thompson-toon.jpg",
    socials: [
      { href: "https://twitch.tv/notratmaster", label: "Twitch", icon: "Twitch" },
      { href: "https://www.youtube.com/@notratmaster", label: "YouTube", icon: "Youtube" },
    ],
  },
];

/** Look up a team member by exact display name (e.g. a blog post's author). */
export function getAuthorByName(name: string): TeamMemberData | undefined {
  return TEAM_MEMBERS.find((member) => member.name === name);
}
