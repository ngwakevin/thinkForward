import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CosmosClient } from "@azure/cosmos";

const cosmos = new CosmosClient({
  endpoint: process.env.AZURE_COSMOS_ENDPOINT!,
  key: process.env.AZURE_COSMOS_KEY!,
});

const db = cosmos.database("cloudMasterClass"); // change if different
const bootcampsContainer = db.container("bootcamps");
const registrationsContainer = db.container("bootcampRegistrations");

export async function GET() {
  try {
    // 🧩 Get session user
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user.email.toLowerCase();

    // 🧠 1. Fetch user's registrations
    const { resources: registrations } = await registrationsContainer.items
      .query({
        query: "SELECT * FROM c WHERE LOWER(c.email) = @email",
        parameters: [{ name: "@email", value: userEmail }],
      })
      .fetchAll();

    if (registrations.length === 0) {
      return NextResponse.json({ registrations: [] });
    }

    // 🧠 2. Fetch all bootcamps (so we can join by bootcampId)
    const { resources: bootcamps } = await bootcampsContainer.items
      .query("SELECT * FROM c")
      .fetchAll();

    // 🧠 3. Map & enrich data
    const result = registrations.map((reg) => {
      const bootcamp = bootcamps.find(
        (b) =>
          b.id === reg.bootcampId ||
          b.bootcampId === reg.bootcampId ||
          b.name?.toLowerCase() === reg.bootcampName?.toLowerCase()
      );

      const nameFromId = (id: string) =>
        id
          ?.split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");

      return {
        id: reg.id,
        bootcampId: reg.bootcampId,
        bootcampName:
          reg.bootcampName ||
          bootcamp?.name ||
          nameFromId(reg.bootcampId) ||
          "Cloud Foundation",
        status: reg.status || "Registered",
        paymentStatus: reg.paymentStatus || "Pending",
        startDate: bootcamp?.startDate || reg.startDate || new Date().toISOString(),
        prerequisites: bootcamp?.prerequisites || [],
      };
    });

    return NextResponse.json({ registrations: result });
  } catch (err: any) {
    console.error("❌ Error fetching bootcamp registrations:", err);
    return NextResponse.json(
      { error: "Failed to load bootcamp registrations." },
      { status: 500 }
    );
  }
}
