import { prisma } from "./prisma";

async function main() {
  await prisma.venue.createMany({
    data: [
      {
        name: "City Cricket Arena",
        contactNumber: "9999999991",
        city: "Raipur",
        address: "Tatibandh, Raipur",
        openingTime: "06:00",
        closingTime: "22:00",
        workingDays: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
        sportTypes: ["CRICKET"],
        amenities: ["PARKING", "WASHROOM", "DRINKING_WATER"],
        photos: ["https://picsum.photos/400/300"],
        ownerId: "10cca1ff-0ab6-43ed-bc53-668971e88b7b",
      },
      {
        name: "Raipur Football Club",
        contactNumber: "9999999992",
        city: "Raipur",
        address: "Shankar Nagar",
        openingTime: "05:00",
        closingTime: "23:00",
        workingDays: ["MON", "TUE", "WED", "THU", "FRI"],
        sportTypes: ["FOOTBALL"],
        amenities: ["PARKING", "CHANGING_ROOM"],
        photos: ["https://picsum.photos/400/301"],
        ownerId: "10cca1ff-0ab6-43ed-bc53-668971e88b7b",
      },
      {
        name: "Bilaspur Sports Hub",
        contactNumber: "9999999993",
        city: "Bilaspur",
        address: "Vyapar Vihar",
        openingTime: "07:00",
        closingTime: "21:00",
        workingDays: ["SAT", "SUN"],
        sportTypes: ["CRICKET", "FOOTBALL"],
        amenities: ["LIGHTS", "PARKING"],
        photos: [],
        ownerId: "10cca1ff-0ab6-43ed-bc53-668971e88b7b",
      },
      {
        name: "Skyline Turf",
        contactNumber: "9999999994",
        city: "Raipur",
        address: "VIP Road",
        openingTime: "00:00",
        closingTime: "23:59",
        workingDays: ["MON", "WED", "FRI"],
        sportTypes: ["FOOTBALL"],
        amenities: ["CAFE", "PARKING"],
        photos: ["https://picsum.photos/400/302"],
        ownerId: "10cca1ff-0ab6-43ed-bc53-668971e88b7b",
      },
      {
        name: "The Cricket Ground",
        contactNumber: "8888888885",
        city: "Durg",
        address: "Bhilai Sector 6",
        openingTime: "06:00",
        closingTime: "18:00",
        workingDays: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
        sportTypes: ["CRICKET"],
        amenities: ["WASHROOM"],
        photos: [],
        ownerId: "10cca1ff-0ab6-43ed-bc53-668971e88b7b",
      },
      {
        name: "Pro Kickers Turf",
        contactNumber: "8888888886",
        city: "Raipur",
        address: "Mowa",
        openingTime: "05:00",
        closingTime: "22:00",
        workingDays: ["MON", "TUE", "WED", "THU", "FRI", "SAT"],
        sportTypes: ["FOOTBALL"],
        amenities: ["CHANGING_ROOM", "LIGHTS"],
        photos: ["https://picsum.photos/400/303"],
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
