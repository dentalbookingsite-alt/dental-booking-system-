export async function GET() {
  console.log("Runtime log is working!");

  return Response.json({
    success: true,
    message: "API route working",
  });
}

