// lib/utils.ts
export const decodeFBString = (s: string) => {
  return new TextDecoder().decode(
    new Uint8Array(s.split("").map((r) => r.charCodeAt(0)))
  );
};

export const parseAlienCaption = (caption: string) => {
  const decodedCaption = decodeFBString(caption);
  const captionArray = decodedCaption.split(" - ");
  const filteredArray = captionArray.filter((c) => c !== "#allensaliens");
  const title = filteredArray[0];
  const additional = filteredArray.slice(1);
  return { title, additional };
};

export const getFileTypeFromExtension = (fileName: string) => {
  const imageExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".webp",
    ".bmp",
    ".svg",
  ];
  const videoExtensions = [
    ".mp4",
    ".mov",
    ".avi",
    ".mkv",
    ".webm",
    ".flv",
    ".wmv",
  ];
  if (!fileName) return "other";
  const lowerCaseFileName = fileName.toLowerCase();

  if (imageExtensions.some((ext) => lowerCaseFileName.endsWith(ext))) {
    return "image";
  }
  if (videoExtensions.some((ext) => lowerCaseFileName.endsWith(ext))) {
    return "video";
  }
  return "other";
};
