// Everything you are likely to want to change lives in this file.

export const SITE = {
  name: 'Mahdee Islam',
  url: 'https://mahdeeislam.com',
  location: 'Melbourne, Victoria, Australia',
  title: 'Mahdee Islam · AI Engineer and Researcher, Melbourne',
  description:
    'Mahdee Islam is a Melbourne-based software and AI engineer, co-founder of Systemaura, founder of BelieversHeart, and a researcher of the Qur’an’s relationship with the Bible.',
};

// Your Substack address, e.g. 'https://yourname.substack.com'.
// When set, every public post is pulled onto the site each time it is built,
// so new posts appear here automatically (the site rebuilds daily).
// Leave empty to show only articles written in src/content/articles/.
export const SUBSTACK_URL = '';

// Substack posts to leave off the site, by the slug in their URL
// (the part after /p/). Example: ['welcome-post'].
export const HIDDEN_SUBSTACK_POSTS: string[] = [];

// Optional topic tags for Substack posts, by slug. Tags power the topic
// filter on the Articles page. Example: { 'is-zionism-biblical': ['Hebrew Bible'] }.
export const SUBSTACK_TAGS: Record<string, string[]> = {};

export const LINKS = {
  linkedin: 'https://www.linkedin.com/in/mahdee-islam-85262325a/',
  github: 'https://github.com/MahdeeIslam',
  instagram: 'https://www.instagram.com/believersheartofficial/',
  substack: SUBSTACK_URL,
};

export const SUMMIT_VIDEO_ID = 'Jx1RHekcpkk';
