"use client";

import { useState } from "react";
import { ImageUploadField } from "./ImageUploadField";

export function CategoryImageField({
  initialUrl,
}: {
  initialUrl?: string;
}) {
  const [url, setUrl] = useState(initialUrl || "");
  return (
    <ImageUploadField
      value={url}
      onChange={setUrl}
      scope="categories"
      name="imageUrl"
      label="Image de couverture"
    />
  );
}
