import { preview } from "@/lib/nextwp/route-handlers/preview";

const previewOptions = {
  toolbar: true, // Shows the preview toolbar on the left side of the screen
};

const previewHandler = preview(previewOptions);

export { previewHandler as GET };
