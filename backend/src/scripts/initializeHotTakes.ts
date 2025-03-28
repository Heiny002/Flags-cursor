import mongoose from 'mongoose';
import { IHotTake } from '../models/HotTake';
import { IHotTakeResponse } from '../models/HotTakeResponse';
import { IUser } from '../models/User';
import { ObjectId } from 'mongodb';

export const mainArray = [
  {
    text: "Spicy food is yucky",
    categories: ["Food & Cuisine"],
    author: {
      id: new ObjectId("67e41639edef4777f6ba43a3"),
      name: "Anonymous",
      email: "anonymous@example.com"
    },
    isActive: true,
    responses: 0,
    createdAt: new Date("2025-03-27T00:00:00.000Z"),
    isInitial: false
  },
  {
    text: "Nicolas Cage is the greatest actor of our age",
    categories: ["Cultural & Entertainment"],
    author: {
      id: new ObjectId("67e41639edef4777f6ba43a3"),
      name: "Anonymous",
      email: "anonymous@example.com"
    },
    isActive: true,
    responses: 0,
    createdAt: new Date("2025-03-27T00:01:00.000Z"),
    isInitial: false
  },
  {
    text: "Single guys who watch Bravo are sus",
    categories: ["Cultural & Entertainment"],
    author: {
      id: new ObjectId("67e41639edef4777f6ba43a3"),
      name: "Monica Schroeder",
      email: "jimheiniger@yahoo.com"
    },
    isActive: true,
    responses: 0,
    createdAt: new Date("2025-03-27T00:02:00.000Z"),
    isInitial: false
  },
  {
    text: "Pistachios are amazing",
    categories: ["Food & Cuisine"],
    author: {
      id: new ObjectId("67e41639edef4777f6ba43a3"),
      name: "Monica Schroeder",
      email: "jimheiniger@yahoo.com"
    },
    isActive: true,
    responses: 0,
    createdAt: new Date("2025-03-27T00:03:00.000Z"),
    isInitial: false
  },
  {
    text: "The development of AI is the most impactful technological change in history",
    categories: ["Social & Political Views", "Ethical & Moral Beliefs", "Lifestyle & Habits", "Cultural & Entertainment", "Career & Education"],
    author: {
      id: new ObjectId("67e41639edef4777f6ba43a3"),
      name: "Anonymous",
      email: "anonymous@example.com"
    },
    isActive: true,
    responses: 0,
    createdAt: new Date("2025-03-27T00:04:00.000Z"),
    isInitial: false
  },
  {
    text: "Recycling is a lie",
    categories: ["Social & Political Views", "Lifestyle & Habits", "Ethical & Moral Beliefs"],
    author: {
      id: new ObjectId("67e41639edef4777f6ba43a3"),
      name: "Monica Schroeder",
      email: "jimheiniger@yahoo.com"
    },
    isActive: true,
    responses: 0,
    createdAt: new Date("2025-03-27T00:05:00.000Z"),
    isInitial: false
  },
  {
    text: "Steak is just okay. Even expensive steak.",
    categories: ["Food & Cuisine"],
    author: {
      id: new ObjectId("67e41639edef4777f6ba43a3"),
      name: "Anonymous",
      email: "anonymous@example.com"
    },
    isActive: true,
    responses: 0,
    createdAt: new Date("2025-03-27T00:06:00.000Z"),
    isInitial: false
  },
  {
    text: "Country music is awful",
    categories: ["Cultural & Entertainment"],
    author: {
      id: new ObjectId("67e41639edef4777f6ba43a3"),
      name: "Monica Schroeder",
      email: "jimheiniger@yahoo.com"
    },
    isActive: true,
    responses: 0,
    createdAt: new Date("2025-03-27T00:07:00.000Z"),
    isInitial: false
  },
  {
    text: "Raccoons are cute",
    categories: ["Lifestyle & Habits"],
    author: {
      id: new ObjectId("67e41639edef4777f6ba43a3"),
      name: "Anonymous",
      email: "anonymous@example.com"
    },
    isActive: true,
    responses: 0,
    createdAt: new Date("2025-03-27T00:08:00.000Z"),
    isInitial: false
  },
  {
    text: "Soccer is the most boring sport to watch",
    categories: ["No Category"],
    author: {
      id: new ObjectId("67e41639edef4777f6ba43a3"),
      name: "Anonymous",
      email: "anonymous@example.com"
    },
    isActive: true,
    responses: 0,
    createdAt: new Date("2025-03-27T00:09:00.000Z"),
    isInitial: false
  },
  {
    text: "The Chicago Bears will make the playoffs this year",
    categories: ["Cultural & Entertainment", "Local"],
    author: {
      id: new ObjectId("67e41639edef4777f6ba43a3"),
      name: "Anonymous",
      email: "anonymous@example.com"
    },
    isActive: true,
    responses: 0,
    createdAt: new Date("2025-03-27T00:10:00.000Z"),
    isInitial: false
  },
  {
    text: "Jim Carrey's The Grinch is the best Christmas movie.",
    categories: ["Cultural & Entertainment"],
    author: {
      id: new ObjectId("67e41639edef4777f6ba43a3"),
      name: "Anonymous",
      email: "anonymous@example.com"
    },
    isActive: true,
    responses: 0,
    createdAt: new Date("2025-03-27T00:11:00.000Z"),
    isInitial: false
  },
  {
    text: "Flags is the most interesting dating app",
    categories: ["No Category"],
    author: {
      id: new ObjectId("67e41639edef4777f6ba43a3"),
      name: "Anonymous",
      email: "anonymous@example.com"
    },
    isActive: true,
    responses: 0,
    createdAt: new Date("2025-03-27T00:12:00.000Z"),
    isInitial: false
  },
  {
    text: "Christmas Vacation is the best Christmas movie",
    categories: ["No Category"],
    author: {
      id: new ObjectId("67e41639edef4777f6ba43a3"),
      name: "Anonymous",
      email: "anonymous@example.com"
    },
    isActive: true,
    responses: 0,
    createdAt: new Date("2025-03-27T00:13:00.000Z"),
    isInitial: false
  },
  {
    text: "Home Alone is the best Christmas movie",
    categories: ["No Category"],
    author: {
      id: new ObjectId("67e41639edef4777f6ba43a3"),
      name: "Anonymous",
      email: "anonymous@example.com"
    },
    isActive: true,
    responses: 0,
    createdAt: new Date("2025-03-27T00:14:00.000Z"),
    isInitial: false
  },
  {
    text: "Flags is the BEST dating app available",
    categories: ["Lifestyle & Habits", "Cultural & Entertainment"],
    author: {
      id: new ObjectId("67e41639edef4777f6ba43a3"),
      name: "Anonymous",
      email: "anonymous@example.com"
    },
    isActive: true,
    responses: 0,
    createdAt: new Date("2025-03-27T00:15:00.000Z"),
    isInitial: false
  },
  {
    text: "Mac > PC",
    categories: ["Lifestyle & Habits"],
    author: {
      id: new ObjectId("67e41639edef4777f6ba43a3"),
      name: "Anonymous",
      email: "anonymous@example.com"
    },
    isActive: true,
    responses: 0,
    createdAt: new Date("2025-03-27T00:16:00.000Z"),
    isInitial: false
  },
  {
    text: "Home Alone is the best Christmas Movie",
    categories: ["Cultural & Entertainment"],
    author: {
      id: new ObjectId("67e41639edef4777f6ba43a3"),
      name: "Anonymous",
      email: "anonymous@example.com"
    },
    isActive: true,
    responses: 0,
    createdAt: new Date("2025-03-27T00:17:00.000Z"),
    isInitial: false
  },
  {
    text: "Exercise is better than diet",
    categories: ["Lifestyle & Habits"],
    author: {
      id: new ObjectId("67e41639edef4777f6ba43a3"),
      name: "Anonymous",
      email: "anonymous@example.com"
    },
    isActive: true,
    responses: 0,
    createdAt: new Date("2025-03-27T00:18:00.000Z"),
    isInitial: false
  },
  {
    text: "Exercise is better than dieting",
    categories: ["Lifestyle & Habits"],
    author: {
      id: new ObjectId("67e41639edef4777f6ba43a3"),
      name: "Anonymous",
      email: "anonymous@example.com"
    },
    isActive: true,
    responses: 0,
    createdAt: new Date("2025-03-27T00:19:00.000Z"),
    isInitial: false
  },
  {
    text: "Steak is mid",
    categories: ["Food & Cuisine"],
    author: {
      id: new ObjectId("67e41639edef4777f6ba43a3"),
      name: "Anonymous",
      email: "anonymous@example.com"
    },
    isActive: true,
    responses: 0,
    createdAt: new Date("2025-03-26T00:00:00.000Z"),
    isInitial: false
  },
  {
    text: "Weightlifting is better than dieting",
    categories: ["Lifestyle & Habits"],
    author: {
      id: new ObjectId("67e41639edef4777f6ba43a3"),
      name: "Anonymous",
      email: "anonymous@example.com"
    },
    isActive: true,
    responses: 0,
    createdAt: new Date("2025-03-26T00:01:00.000Z"),
    isInitial: false
  },
  {
    text: "Weightlifting is better than dieting",
    categories: ["Lifestyle & Habits"],
    author: {
      id: new ObjectId("67e41639edef4777f6ba43a3"),
      name: "Anonymous",
      email: "anonymous@example.com"
    },
    isActive: true,
    responses: 0,
    createdAt: new Date("2025-03-26T00:02:00.000Z"),
    isInitial: false
  },
  {
    text: "Having children is the most important thing someone can do with their life",
    categories: ["Ethical & Moral Beliefs", "Lifestyle & Habits", "Relationship Dynamics"],
    author: {
      id: new ObjectId("67e41639edef4777f6ba43a3"),
      name: "Anonymous",
      email: "anonymous@example.com"
    },
    isActive: true,
    responses: 0,
    createdAt: new Date("2025-03-26T00:03:00.000Z"),
    isInitial: false
  },
  {
    text: "Girls can pay sometimes too",
    categories: ["Relationship Dynamics"],
    author: {
      id: new ObjectId("67e41639edef4777f6ba43a3"),
      name: "Anonymous",
      email: "anonymous@example.com"
    },
    isActive: true,
    responses: 0,
    createdAt: new Date("2025-03-26T00:04:00.000Z"),
    isInitial: false
  },
  {
    text: "Trade School should be encouraged and promoted more than college",
    categories: ["Career & Education"],
    author: {
      id: new ObjectId("67e41639edef4777f6ba43a3"),
      name: "Anonymous",
      email: "anonymous@example.com"
    },
    isActive: true,
    responses: 0,
    createdAt: new Date("2025-03-26T00:05:00.000Z"),
    isInitial: false
  },
  {
    text: "Whisky drinks > all other spirits",
    categories: ["Food & Cuisine"],
    author: {
      id: new ObjectId("67e41639edef4777f6ba43a3"),
      name: "Anonymous",
      email: "anonymous@example.com"
    },
    isActive: true,
    responses: 0,
    createdAt: new Date("2025-03-26T00:06:00.000Z"),
    isInitial: false
  },
  {
    text: "Cruises are awful",
    categories: ["Lifestyle & Habits", "Cultural & Entertainment", "Travel & Adventure"],
    author: {
      id: new ObjectId("67e41639edef4777f6ba43a3"),
      name: "Anonymous",
      email: "anonymous@example.com"
    },
    isActive: true,
    responses: 0,
    createdAt: new Date("2025-03-26T00:07:00.000Z"),
    isInitial: false
  },
  {
    text: "Tennessee is the best state",
    categories: ["Local", "Travel & Adventure"],
    author: {
      id: new ObjectId("67e41639edef4777f6ba43a3"),
      name: "Anonymous",
      email: "anonymous@example.com"
    },
    isActive: true,
    responses: 0,
    createdAt: new Date("2025-03-26T00:08:00.000Z"),
    isInitial: false
  },
  {
    text: "Noon Whistle Brewing is the best beer in Illinois",
    categories: ["Local", "Food & Cuisine"],
    author: {
      id: new ObjectId("67e41639edef4777f6ba43a3"),
      name: "Anonymous",
      email: "anonymous@example.com"
    },
    isActive: true,
    responses: 0,
    createdAt: new Date("2025-03-26T00:09:00.000Z"),
    isInitial: false
  },
  {
    text: "AI is the most consequential technology in history",
    categories: ["Social & Political Views", "Career & Education", "Ethical & Moral Beliefs"],
    author: {
      id: new ObjectId("67e41639edef4777f6ba43a3"),
      name: "Anonymous",
      email: "anonymous@example.com"
    },
    isActive: true,
    responses: 0,
    createdAt: new Date("2025-03-26T00:10:00.000Z"),
    isInitial: false
  },
  {
    text: "Chappel Roan has already peaked",
    categories: ["Cultural & Entertainment"],
    author: {
      id: new ObjectId("67e41639edef4777f6ba43a3"),
      name: "Anonymous",
      email: "anonymous@example.com"
    },
    isActive: true,
    responses: 0,
    createdAt: new Date("2025-03-26T00:11:00.000Z"),
    isInitial: false
  },
  {
    text: "Sabrina Carpenter's music is mid",
    categories: ["Cultural & Entertainment"],
    author: {
      id: new ObjectId("67e41639edef4777f6ba43a3"),
      name: "Anonymous",
      email: "anonymous@example.com"
    },
    isActive: true,
    responses: 0,
    createdAt: new Date("2025-03-26T00:12:00.000Z"),
    isInitial: false
  },
  {
    text: "Rear Window is the best Hitchcock film",
    categories: ["Cultural & Entertainment"],
    author: {
      id: new ObjectId("67e41639edef4777f6ba43a3"),
      name: "Anonymous",
      email: "anonymous@example.com"
    },
    isActive: true,
    responses: 0,
    createdAt: new Date("2025-03-26T00:13:00.000Z"),
    isInitial: false
  },
  {
    text: "Lou Malnatti's deep dish sausage pizza is the best Chicago deep dish",
    categories: ["Local", "Food & Cuisine"],
    author: {
      id: new ObjectId("67e41639edef4777f6ba43a3"),
      name: "Anonymous",
      email: "anonymous@example.com"
    },
    isActive: true,
    responses: 0,
    createdAt: new Date("2025-03-26T00:14:00.000Z"),
    isInitial: false
  },
  {
    text: "Steak is mid",
    categories: ["Food & Cuisine"],
    author: {
      id: new ObjectId("67e41639edef4777f6ba43a3"),
      name: "Anonymous",
      email: "anonymous@example.com"
    },
    isActive: true,
    responses: 0,
    createdAt: new Date("2025-03-26T00:15:00.000Z"),
    isInitial: false
  },
  {
    text: "Tacos are sandwiches",
    categories: ["Food & Cuisine"],
    author: {
      id: new ObjectId("67e41639edef4777f6ba43a3"),
      name: "Anonymous",
      email: "anonymous@example.com"
    },
    isActive: true,
    responses: 0,
    createdAt: new Date("2025-03-26T00:16:00.000Z"),
    isInitial: false
  },
  {
    text: "Spit over swallow",
    categories: ["Relationship Dynamics", "After Dark"],
    author: {
      id: new ObjectId("67e41639edef4777f6ba43a3"),
      name: "Anonymous",
      email: "anonymous@example.com"
    },
    isActive: true,
    responses: 0,
    createdAt: new Date("2025-03-26T00:17:00.000Z"),
    isInitial: false
  },
  {
    text: "Touch is the best love language",
    categories: ["Relationship Dynamics", "Lifestyle & Habits", "After Dark"],
    author: {
      id: new ObjectId("67e41639edef4777f6ba43a3"),
      name: "Anonymous",
      email: "anonymous@example.com"
    },
    isActive: true,
    responses: 0,
    createdAt: new Date("2025-03-26T00:18:00.000Z"),
    isInitial: false
  },
  {
    text: "Girls who watch Bravo need to get a life",
    categories: ["Cultural & Entertainment", "Relationship Dynamics"],
    author: {
      id: new ObjectId("67e41639edef4777f6ba43a3"),
      name: "Anonymous",
      email: "anonymous@example.com"
    },
    isActive: true,
    responses: 0,
    createdAt: new Date("2025-03-26T00:19:00.000Z"),
    isInitial: false
  },
  {
    text: "DJT is the greatest president of the modern era",
    categories: ["Social & Political Views"],
    author: {
      id: new ObjectId("67e41639edef4777f6ba43a3"),
      name: "Anonymous",
      email: "anonymous@example.com"
    },
    isActive: true,
    responses: 0,
    createdAt: new Date("2025-03-26T00:20:00.000Z"),
    isInitial: false
  },
  {
    text: "Restaurants and bars need more mocktail options",
    categories: ["Food & Cuisine"],
    author: {
      id: new ObjectId("67e41639edef4777f6ba43a3"),
      name: "Monica Schroeder",
      email: "jimheiniger@yahoo.com"
    },
    isActive: true,
    responses: 0,
    createdAt: new Date("2025-03-26T00:21:00.000Z"),
    isInitial: false
  },
  {
    text: "The last season of Game of Thrones wasn't bad",
    categories: ["Cultural & Entertainment"],
    author: {
      id: new ObjectId("67e41639edef4777f6ba43a3"),
      name: "Monica Schroeder",
      email: "jimheiniger@yahoo.com"
    },
    isActive: true,
    responses: 0,
    createdAt: new Date("2025-03-26T00:22:00.000Z"),
    isInitial: false
  },
  {
    text: "Shep from Southern Charm is a walking red flag",
    categories: ["Cultural & Entertainment", "Relationship Dynamics"],
    author: {
      id: new ObjectId("67e41639edef4777f6ba43a3"),
      name: "Monica Schroeder",
      email: "jimheiniger@yahoo.com"
    },
    isActive: true,
    responses: 0,
    createdAt: new Date("2025-03-26T00:23:00.000Z"),
    isInitial: false
  },
  {
    text: "Kama Bistro in La Grange is incredible",
    categories: ["Food & Cuisine", "Local"],
    author: {
      id: new ObjectId("67e41639edef4777f6ba43a3"),
      name: "Monica Schroeder",
      email: "jimheiniger@yahoo.com"
    },
    isActive: true,
    responses: 0,
    createdAt: new Date("2025-03-26T00:24:00.000Z"),
    isInitial: false
  },
  {
    text: "Men shouldn't pay for everything",
    categories: ["Lifestyle & Habits", "Relationship Dynamics"],
    author: {
      id: new ObjectId("67e41639edef4777f6ba43a3"),
      name: "Monica Schroeder",
      email: "jimheiniger@yahoo.com"
    },
    isActive: true,
    responses: 0,
    createdAt: new Date("2025-03-26T00:25:00.000Z"),
    isInitial: false
  },
  {
    text: "Sleeping naked is uncomfortable",
    categories: ["Lifestyle & Habits", "Relationship Dynamics", "After Dark"],
    author: {
      id: new ObjectId("67e41639edef4777f6ba43a3"),
      name: "Monica Schroeder",
      email: "jimheiniger@yahoo.com"
    },
    isActive: true,
    responses: 0,
    createdAt: new Date("2025-03-26T00:26:00.000Z"),
    isInitial: false
  },
  {
    text: "Hugs are better than kisses",
    categories: ["Relationship Dynamics", "After Dark"],
    author: {
      id: new ObjectId("67e41639edef4777f6ba43a3"),
      name: "Monica Schroeder",
      email: "jimheiniger@yahoo.com"
    },
    isActive: true,
    responses: 0,
    createdAt: new Date("2025-03-26T00:27:00.000Z"),
    isInitial: false
  },
  {
    text: "The movie \"About Time\" is an under-the-radar masterpiece",
    categories: ["Cultural & Entertainment"],
    author: {
      id: new ObjectId("67e41639edef4777f6ba43a3"),
      name: "Monica Schroeder",
      email: "jimheiniger@yahoo.com"
    },
    isActive: true,
    responses: 0,
    createdAt: new Date("2025-03-26T00:28:00.000Z"),
    isInitial: false
  },
  {
    text: "Elon Musk is a fuck",
    categories: ["Social & Political Views"],
    author: {
      id: new ObjectId("67e41639edef4777f6ba43a3"),
      name: "Monica Schroeder",
      email: "jimheiniger@yahoo.com"
    },
    isActive: true,
    responses: 0,
    createdAt: new Date("2025-03-26T00:29:00.000Z"),
    isInitial: false
  },
  {
    text: "Goldfinger Brewing makes the best beer in Chicagoland",
    categories: ["Food & Cuisine", "Local"],
    author: {
      id: new ObjectId("67e41639edef4777f6ba43a3"),
      name: "Monica Schroeder",
      email: "jimheiniger@yahoo.com"
    },
    isActive: true,
    responses: 0,
    createdAt: new Date("2025-03-26T00:30:00.000Z"),
    isInitial: false
  },
  {
    text: "Portillo's has gone downhill since they franchised",
    categories: ["Food & Cuisine", "Local"],
    author: {
      id: new ObjectId("67e41639edef4777f6ba43a3"),
      name: "Monica Schroeder",
      email: "jimheiniger@yahoo.com"
    },
    isActive: true,
    responses: 0,
    createdAt: new Date("2025-03-26T00:31:00.000Z"),
    isInitial: false
  },
  {
    text: "Shrimp is the best protein",
    categories: ["Food & Cuisine"],
    author: {
      id: new ObjectId("67e41639edef4777f6ba43a3"),
      name: "Monica Schroeder",
      email: "jimheiniger@yahoo.com"
    },
    isActive: true,
    responses: 0,
    createdAt: new Date("2025-03-26T00:32:00.000Z"),
    isInitial: false
  },
  {
    text: "Fast-paced walking is better than running",
    categories: ["Lifestyle & Habits"],
    author: {
      id: new ObjectId("67e41639edef4777f6ba43a3"),
      name: "Monica Schroeder",
      email: "jimheiniger@yahoo.com"
    },
    isActive: true,
    responses: 0,
    createdAt: new Date("2025-03-26T00:33:00.000Z"),
    isInitial: false
  },
  {
    text: "AI is not going to have that much social impact",
    categories: ["Social & Political Views", "Career & Education"],
    author: {
      id: new ObjectId("67e41639edef4777f6ba43a3"),
      name: "Monica Schroeder",
      email: "jimheiniger@yahoo.com"
    },
    isActive: true,
    responses: 0,
    createdAt: new Date("2025-03-26T00:34:00.000Z"),
    isInitial: false
  },
  {
    text: "College and University is necessary for MOST professions",
    categories: ["Social & Political Views", "Career & Education"],
    author: {
      id: new ObjectId("67e41639edef4777f6ba43a3"),
      name: "Monica Schroeder",
      email: "jimheiniger@yahoo.com"
    },
    isActive: true,
    responses: 0,
    createdAt: new Date("2025-03-26T00:35:00.000Z"),
    isInitial: false
  },
  {
    text: "High School students need more involved parents",
    categories: ["Social & Political Views", "Career & Education"],
    author: {
      id: new ObjectId("67e41639edef4777f6ba43a3"),
      name: "Monica Schroeder",
      email: "jimheiniger@yahoo.com"
    },
    isActive: true,
    responses: 0,
    createdAt: new Date("2025-03-26T00:36:00.000Z"),
    isInitial: false
  },
  {
    text: "Charter Schools should be heavily regulated",
    categories: ["Career & Education", "Social & Political Views", "Ethical & Moral Beliefs"],
    author: {
      id: new ObjectId("67e41639edef4777f6ba43a3"),
      name: "Monica Schroeder",
      email: "jimheiniger@yahoo.com"
    },
    isActive: true,
    responses: 0,
    createdAt: new Date("2025-03-26T00:37:00.000Z"),
    isInitial: false
  },
  {
    text: "Kamala Harris would have been a much better president than Joe Biden was",
    categories: ["Social & Political Views"],
    author: {
      id: new ObjectId("67e41639edef4777f6ba43a3"),
      name: "Monica Schroeder",
      email: "jimheiniger@yahoo.com"
    },
    isActive: true,
    responses: 0,
    createdAt: new Date("2025-03-26T00:38:00.000Z"),
    isInitial: false
  },
  {
    text: "Donald Trump is the worst president in US history",
    categories: ["Social & Political Views"],
    author: {
      id: new ObjectId("67e41639edef4777f6ba43a3"),
      name: "Monica Schroeder",
      email: "jimheiniger@yahoo.com"
    },
    isActive: true,
    responses: 0,
    createdAt: new Date("2025-03-26T00:39:00.000Z"),
    isInitial: false
  },
  {
    text: "Western Michigan is a fantastic vacation spot",
    categories: ["Travel & Adventure", "Local"],
    author: {
      id: new ObjectId("67e41639edef4777f6ba43a3"),
      name: "Monica Schroeder",
      email: "jimheiniger@yahoo.com"
    },
    isActive: true,
    responses: 0,
    createdAt: new Date("2025-03-26T00:40:00.000Z"),
    isInitial: false
  },
  {
    text: "Dogs are better than cats",
    categories: ["Cultural & Entertainment", "Social & Political Views", "Lifestyle & Habits"],
    author: {
      id: new ObjectId("67e41639edef4777f6ba43a3"),
      name: "Monica Schroeder",
      email: "jimheiniger@yahoo.com"
    },
    isActive: true,
    responses: 0,
    createdAt: new Date("2025-03-26T00:41:00.000Z"),
    isInitial: false
  },
  {
    text: "White Lotus (Season 3) is trash",
    categories: ["Cultural & Entertainment"],
    author: {
      id: new ObjectId("67e41639edef4777f6ba43a3"),
      name: "Anonymous",
      email: "anonymous@example.com"
    },
    isActive: true,
    responses: 0,
    createdAt: new Date("2025-03-26T00:42:00.000Z"),
    isInitial: false
  },
  {
    text: "Hotdogs are better than tacos",
    categories: ["Food & Cuisine", "Cultural & Entertainment"],
    author: {
      id: new ObjectId("67e41639edef4777f6ba43a3"),
      name: "Anonymous",
      email: "anonymous@example.com"
    },
    isActive: true,
    responses: 0,
    createdAt: new Date("2025-03-26T00:43:00.000Z"),
    isInitial: false
  },
  {
    text: "Chicago is the greatest city in the US",
    categories: ["Travel & Adventure", "Local"],
    author: {
      id: new ObjectId("67e41639edef4777f6ba43a3"),
      name: "Anonymous",
      email: "anonymous@example.com"
    },
    isActive: true,
    responses: 0,
    createdAt: new Date("2025-03-25T00:00:00.000Z"),
    isInitial: false
  },
  {
    text: "The Pacific Northwest is the least interesting place to visit in the US",
    categories: ["Travel & Adventure", "Local"],
    author: {
      id: new ObjectId("67e41639edef4777f6ba43a3"),
      name: "Anonymous",
      email: "anonymous@example.com"
    },
    isActive: true,
    responses: 0,
    createdAt: new Date("2025-03-25T00:01:00.000Z"),
    isInitial: false
  },
  {
    text: "Men shouldn't always be expected to pay",
    categories: ["Relationship Dynamics", "Cultural & Entertainment"],
    author: {
      id: new ObjectId("67e41639edef4777f6ba43a3"),
      name: "Anonymous",
      email: "anonymous@example.com"
    },
    isActive: true,
    responses: 0,
    createdAt: new Date("2025-03-25T00:02:00.000Z"),
    isInitial: false
  },
  {
    text: "Going to college is not worth the cost for most majors",
    categories: ["Career & Education", "Social & Political Views", "Ethical & Moral Beliefs"],
    author: {
      id: new ObjectId("67e41639edef4777f6ba43a3"),
      name: "Anonymous",
      email: "anonymous@example.com"
    },
    isActive: true,
    responses: 0,
    createdAt: new Date("2025-03-25T00:03:00.000Z"),
    isInitial: false
  },
  {
    text: "Recycling is pointless",
    categories: ["Ethical & Moral Beliefs", "Social & Political Views"],
    author: {
      id: new ObjectId("67e41639edef4777f6ba43a3"),
      name: "Anonymous",
      email: "anonymous@example.com"
    },
    isActive: true,
    responses: 0,
    createdAt: new Date("2025-03-25T00:04:00.000Z"),
    isInitial: false
  },
  {
    text: "HJs are better than BJs",
    categories: ["After Dark", "Relationship Dynamics"],
    author: {
      id: new ObjectId("67e41639edef4777f6ba43a3"),
      name: "Anonymous",
      email: "anonymous@example.com"
    },
    isActive: true,
    responses: 0,
    createdAt: new Date("2025-03-25T00:05:00.000Z"),
    isInitial: false
  },
  {
    text: "Flags is the BEST dating app",
    categories: ["Relationship Dynamics", "Cultural & Entertainment"],
    author: {
      id: new ObjectId("67e41639edef4777f6ba43a3"),
      name: "Anonymous",
      email: "anonymous@example.com"
    },
    isActive: true,
    responses: 0,
    createdAt: new Date("2025-03-25T00:06:00.000Z"),
    isInitial: false
  },
  {
    text: "Exercise is more important than diet",
    categories: ["Lifestyle & Habits"],
    author: {
      id: new ObjectId("67e41639edef4777f6ba43a3"),
      name: "Anonymous",
      email: "anonymous@example.com"
    },
    isActive: true,
    responses: 0,
    createdAt: new Date("2025-03-25T00:07:00.000Z"),
    isInitial: false
  },
  {
    text: "AI is a threat to humanity",
    categories: ["Ethical & Moral Beliefs", "Social & Political Views", "Career & Education"],
    author: {
      id: new ObjectId("67e41639edef4777f6ba43a3"),
      name: "Anonymous",
      email: "anonymous@example.com"
    },
    isActive: true,
    responses: 0,
    createdAt: new Date("2025-03-25T00:08:00.000Z"),
    isInitial: false
  },
  {
    text: "Joe Biden was an effective president",
    categories: ["Social & Political Views"],
    author: {
      id: new ObjectId("67e41639edef4777f6ba43a3"),
      name: "Anonymous",
      email: "anonymous@example.com"
    },
    isActive: true,
    responses: 0,
    createdAt: new Date("2025-03-25T00:09:00.000Z"),
    isInitial: false
  },
  {
    text: "Trump is the greatest president in the last 40 years",
    categories: ["Social & Political Views"],
    author: {
      id: new ObjectId("67e41639edef4777f6ba43a3"),
      name: "Anonymous",
      email: "anonymous@example.com"
    },
    isActive: true,
    responses: 0,
    createdAt: new Date("2025-03-25T00:10:00.000Z"),
    isInitial: false
  },
  {
    text: "Sabrina Carpenter's music is mid",
    categories: ["Cultural & Entertainment"],
    author: {
      id: new ObjectId("67e41639edef4777f6ba43a3"),
      name: "Anonymous",
      email: "anonymous@example.com"
    },
    isActive: true,
    responses: 0,
    createdAt: new Date("2025-03-25T00:11:00.000Z"),
    isInitial: false
  },
  {
    text: "Rear Window is the best Hitchcock film",
    categories: ["Cultural & Entertainment"],
    author: {
      id: new ObjectId("67e41639edef4777f6ba43a3"),
      name: "Anonymous",
      email: "anonymous@example.com"
    },
    isActive: true,
    responses: 0,
    createdAt: new Date("2025-03-25T00:12:00.000Z"),
    isInitial: false
  },
  {
    text: "Fireworks are the worst",
    categories: ["Social & Political Views", "Cultural & Entertainment"],
    author: {
      id: new ObjectId("67e41639edef4777f6ba43a3"),
      name: "Anonymous",
      email: "anonymous@example.com"
    },
    isActive: true,
    responses: 0,
    createdAt: new Date("2025-03-25T00:13:00.000Z"),
    isInitial: false
  },
  {
    text: "Lou Malnati's deep dish sausage is the best pizza in Chicagoland",
    categories: ["Local", "Food & Cuisine"],
    author: {
      id: new ObjectId("67e41639edef4777f6ba43a3"),
      name: "Anonymous",
      email: "anonymous@example.com"
    },
    isActive: true,
    responses: 0,
    createdAt: new Date("2025-03-25T00:14:00.000Z"),
    isInitial: false
  },
  {
    text: "Severence is the best show on TV",
    categories: ["Cultural & Entertainment"],
    author: {
      id: new ObjectId("67e41639edef4777f6ba43a3"),
      name: "Anonymous",
      email: "anonymous@example.com"
    },
    isActive: true,
    responses: 0,
    createdAt: new Date("2025-03-25T00:15:00.000Z"),
    isInitial: false
  },
  {
    text: "Hot dogs are better than hamburgers",
    categories: ["Food & Cuisine", "Lifestyle & Habits"],
    author: {
      id: new ObjectId("67e41639edef4777f6ba43a3"),
      name: "Anonymous",
      email: "anonymous@example.com"
    },
    isActive: true,
    responses: 0,
    createdAt: new Date("2025-03-25T00:16:00.000Z"),
    isInitial: false
  }
]; 