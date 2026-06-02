import { connectDB } from "@/app/lib/mongodb";
import User from "@/app/lib/model/User";

type UserInput = {
  amount?: number | string;
  [key: string]: unknown;
};

export async function GET() {
  try {
    await connectDB();

    const users = await User.find().sort({ _id: -1 });

    return Response.json(users);
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const users = Array.isArray(body.users)
      ? body.users.map((user: UserInput) => ({
          ...user,
          amount:
            user.amount === "" || user.amount === undefined
              ? undefined
              : Number(user.amount),
        }))
      : [];

    if (users.length === 0) {
      return Response.json(
        { error: "No users provided" },
        { status: 400 }
      );
    }

    await connectDB();

    const savedUsers = await User.insertMany(users);

    return Response.json(savedUsers);
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Failed to save users" },
      { status: 500 }
    );
  }
}
