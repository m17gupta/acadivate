import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const pathName = (formData.get("pathName") as string) || "";

    // Base uploads directory in public
    const baseUploadDir = path.join(process.cwd(), "public/uploads");
    
    // Resolve full target directory. Sanitize pathName to prevent path traversal
    const sanitizedPathName = pathName.replace(/^\/+/, ""); 
    const uploadDir = path.resolve(process.cwd(), "public/uploads", sanitizedPathName);

    console.log("Saving files to absolute path:", uploadDir);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const result: Record<string, string[]> = {};

    // Get unique keys from formData
    const keys = Array.from(new Set(formData.keys()));

    for (const key of keys) {
      if (key === "pathName") continue;

      const entries = formData.getAll(key);
      result[key] = [];

      for (const entry of entries) {
        if (entry instanceof File) {
          const buffer = Buffer.from(await entry.arrayBuffer());

          // Clean filename to remove spaces or harmful characters
          const safeFileName = entry.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
          const fileName = `${key}-${Date.now()}-${safeFileName}`;
          const filePath = path.join(uploadDir, fileName);

          await fs.promises.writeFile(filePath, buffer);

          // Construct relative path for client access (ensure leading slash)
          const publicPath = path.join("/uploads", sanitizedPathName, fileName);
          result[key].push(publicPath);
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: result,
        debug_absolute_path: uploadDir,
      }),
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Upload failed server-side:", error);
    return new Response(JSON.stringify({ error: "Upload failed" }), {
      status: 500,
    });
  }
}