import { prisma } from "./prisma";

async function main() {
  await prisma.venue.createMany({
    data: [
      {
        name: "Noida Grouds Cricket Arena",
        contactNumber: "9999999991",
        city: "Noida",
        address: "Sector 29, Noida",
        openingTime: "06:00",
        closingTime: "22:00",
        workingDays: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
        sportTypes: ["CRICKET"],
        amenities: ["PARKING", "TOILETS", "WATER_FACILITY"],
        photos: ["https://picsum.photos/400/300"],
        ownerId: "10cca1ff-0ab6-43ed-bc53-668971e88b7b",
      },
      {
        name: "Electric Club Football Ground",
        contactNumber: "9999999992",
        city: "Raipur",
        address: "Shankar Nagar",
        openingTime: "05:00",
        closingTime: "23:00",
        workingDays: ["MON", "TUE", "WED", "THU", "FRI"],
        sportTypes: ["FOOTBALL"],
        amenities: ["PARKING", "CHANGING_ROOMS"],
        photos: ["https://picsum.photos/400/301"],
        ownerId: "10cca1ff-0ab6-43ed-bc53-668971e88b7b",
      },
      {
        name: "Toman Turf",
        contactNumber: "9999999993",
        city: "Bilaspur",
        address: "Vyapar Vihar",
        openingTime: "07:00",
        closingTime: "21:00",
        workingDays: ["SAT", "SUN"],
        sportTypes: ["CRICKET", "FOOTBALL"],
        amenities: [ "PARKING"],
        photos: [],
        ownerId: "10cca1ff-0ab6-43ed-bc53-668971e88b7b",
      },
    ],
  });
}

main()
  .then(() => console.log("Seeding successful!"))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
