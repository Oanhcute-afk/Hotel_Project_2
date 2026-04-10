const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/hotel_booking_fallback";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // 2. Connect to MongoDB Atlas (or local fallback)
    console.log("Connecting to MongoDB...");
    await client.connect();
    console.log("Successfully connected to the database server.");

    // 3. Use an appropriate database name for our Hotel Booking App
    const database = client.db("hotel_platform");

    // 4. Use an appropriate collection name
    const bookingsCollection = database.collection("bookings");

    // Optional: clear collection so re-running this script doesn't pile up duplicates
    await bookingsCollection.deleteMany({});
    console.log("Cleaned up existing collection for a fresh start.");

    // 5. Create 10 realistic documents appropriate for a Hotel Booking app
    // Includes a real timestamp field (createdAt) with staggered date values 
    const sampleBookings = [
      { guestName: "Alice Smith", hotelName: "Ocean View Resort", roomType: "Suite", nights: 3, createdAt: new Date("2026-04-01T09:00:00Z") },
      { guestName: "Bob Jones", hotelName: "Mountain Retreat", roomType: "Standard", nights: 2, createdAt: new Date("2026-04-01T14:30:00Z") },
      { guestName: "Charlie Brown", hotelName: "City Center Inn", roomType: "Deluxe", nights: 5, createdAt: new Date("2026-04-02T10:15:00Z") },
      { guestName: "Diana Prince", hotelName: "Ocean View Resort", roomType: "Standard", nights: 1, createdAt: new Date("2026-04-03T08:45:00Z") },
      { guestName: "Ethan Hunt", hotelName: "Grand Plaza", roomType: "Suite", nights: 4, createdAt: new Date("2026-04-03T16:20:00Z") },
      { guestName: "Fiona Gallagher", hotelName: "Mountain Retreat", roomType: "Deluxe", nights: 3, createdAt: new Date("2026-04-04T11:10:00Z") },
      { guestName: "George Miller", hotelName: "City Center Inn", roomType: "Standard", nights: 2, createdAt: new Date("2026-04-04T15:55:00Z") },
      { guestName: "Hannah Abbott", hotelName: "Grand Plaza", roomType: "Standard", nights: 7, createdAt: new Date("2026-04-05T09:30:00Z") },
      { guestName: "Ian Malcolm", hotelName: "Ocean View Resort", roomType: "Suite", nights: 3, createdAt: new Date("2026-04-05T13:40:00Z") },
      { guestName: "Julia Roberts", hotelName: "City Center Inn", roomType: "Deluxe", nights: 1, createdAt: new Date("2026-04-06T10:05:00Z") }
    ];

    console.log("\nInserting 10 sample hotel bookings...");
    const insertResult = await bookingsCollection.insertMany(sampleBookings);
    console.log(`Successfully inserted ${insertResult.insertedCount} documents!`);

    // 6. Read and print the 5 most recent full documents by sorting on the timestamp field
    console.log("\n--- Fetching the 5 most recent bookings ---");
    // Sort descending (-1) on createdAt to get the newest first
    const recentBookings = await bookingsCollection
      .find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();

    recentBookings.forEach((booking, index) => {
      console.log(`${index + 1}. Guest: ${booking.guestName} | Booked At: ${booking.createdAt.toISOString()}`);
    });

    // 7. Read and print one full document by _id
    // We'll take the ID of the very first document we inserted earlier
    const documentIdToFind = Object.values(insertResult.insertedIds)[0];
    console.log(`\n--- Fetching a specific booking by its _id: ${documentIdToFind} ---`);

    const specificBooking = await bookingsCollection.findOne({ _id: documentIdToFind });
    console.log("Found document:");
    console.log(JSON.stringify(specificBooking, null, 2));

  } catch (error) {
    // Graceful error handling for failed connections or invalid queries
    console.error("\n❌ An error occurred interacting with MongoDB:", error.message);
  } finally {
    // 8. Close the MongoDB connection in a finally block to ensure it always runs
    console.log("\nClosing the database connection...");
    await client.close();
    console.log("Connection closed successfully.");
  }
}

// Execute the async function
run().catch(console.dir);
