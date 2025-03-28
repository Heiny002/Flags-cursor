import mongoose from 'mongoose';
import { IHotTake } from '../models/HotTake';
import HotTake from '../models/HotTake';
import { ObjectId } from 'mongodb';
import fs from 'fs';
import path from 'path';
import '../models/User';

interface PopulatedAuthor {
  _id: ObjectId;
  name: string;
  email: string;
}

type PopulatedHotTake = Omit<IHotTake, 'author'> & {
  author: PopulatedAuthor;
};

// MongoDB connection string - replace with your actual connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/flags';

async function updateHotTakesArray() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Fetch all hot takes from the database
    const hotTakes = await HotTake.find().populate<{ author: PopulatedAuthor }>('author', 'name email');
    console.log(`Found ${hotTakes.length} hot takes in the database`);

    // Format hot takes for the mainArray
    const formattedHotTakes = hotTakes.map((hotTake) => {
      const doc = hotTake.toObject() as PopulatedHotTake;
      return {
        text: doc.text,
        categories: doc.categories,
        author: {
          id: new ObjectId(doc.author?._id?.toString() || "67e41639edef4777f6ba43a3"),
          name: doc.author?.name || "Monica Schroeder",
          email: doc.author?.email || "jimheiniger@yahoo.com"
        },
        isActive: doc.isActive,
        responses: doc.responses?.length || 0,
        createdAt: doc.createdAt,
        isInitial: doc.isInitial || false
      };
    });

    // Read the current initializeHotTakes.ts file
    const filePath = path.join(__dirname, 'initializeHotTakes.ts');
    let fileContent = fs.readFileSync(filePath, 'utf8');

    // Find the mainArray declaration and replace its content
    const arrayStartIndex = fileContent.indexOf('const mainArray = [');
    const arrayEndIndex = fileContent.indexOf('];', arrayStartIndex);

    if (arrayStartIndex === -1 || arrayEndIndex === -1) {
      throw new Error('Could not find mainArray in the file');
    }

    // Create the new array content
    const newArrayContent = `const mainArray = [
${formattedHotTakes.map((hotTake: any) => `  ${JSON.stringify(hotTake, null, 2)}`).join(',\n')}
];`;

    // Replace the old array with the new one
    fileContent = fileContent.substring(0, arrayStartIndex) + 
                 newArrayContent + 
                 fileContent.substring(arrayEndIndex + 2);

    // Write the updated content back to the file
    fs.writeFileSync(filePath, fileContent);
    console.log('Successfully updated initializeHotTakes.ts');

    // Close the MongoDB connection
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');

  } catch (error) {
    console.error('Error updating hot takes array:', error);
    process.exit(1);
  }
}

// Run the update function
updateHotTakesArray(); 