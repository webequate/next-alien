import { describe, it, expect } from "vitest";
import {
  decodeFBString,
  parseAlienCaption,
  getFileTypeFromExtension,
} from "@/lib/utils";

describe("decodeFBString", () => {
  it("is a passthrough for pure ASCII text", () => {
    expect(decodeFBString("hello world")).toBe("hello world");
  });

  it("handles an empty string", () => {
    expect(decodeFBString("")).toBe("");
  });

  it("preserves spaces, punctuation, and apostrophes", () => {
    expect(decodeFBString("Allen's Aliens")).toBe("Allen's Aliens");
  });
});

describe("parseAlienCaption", () => {
  it("extracts the title and strips #allensaliens", () => {
    const result = parseAlienCaption("Alien Bob - Denver, CO - #allensaliens");
    expect(result.title).toBe("Alien Bob");
    expect(result.additional).toEqual(["Denver, CO"]);
  });

  it("handles a caption with no hashtag segment", () => {
    const result = parseAlienCaption("Alien Bob - Denver, CO");
    expect(result.title).toBe("Alien Bob");
    expect(result.additional).toEqual(["Denver, CO"]);
  });

  it("returns an empty additional array when there is only a title", () => {
    const result = parseAlienCaption("Alien Bob");
    expect(result.title).toBe("Alien Bob");
    expect(result.additional).toEqual([]);
  });

  it("handles multiple additional segments", () => {
    const result = parseAlienCaption(
      "Title - Event Name - Denver, CO - #allensaliens"
    );
    expect(result.title).toBe("Title");
    expect(result.additional).toEqual(["Event Name", "Denver, CO"]);
  });

  it("filters out #allensaliens regardless of its position", () => {
    const result = parseAlienCaption("#allensaliens - Title - Location");
    expect(result.title).toBe("Title");
    expect(result.additional).toEqual(["Location"]);
  });
});

describe("getFileTypeFromExtension", () => {
  it.each([".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp", ".svg"])(
    "returns 'image' for %s",
    (ext) => {
      expect(getFileTypeFromExtension(`photo${ext}`)).toBe("image");
    }
  );

  it.each([".mp4", ".mov", ".avi", ".mkv", ".webm", ".flv", ".wmv"])(
    "returns 'video' for %s",
    (ext) => {
      expect(getFileTypeFromExtension(`clip${ext}`)).toBe("video");
    }
  );

  it("returns 'other' for an unrecognised extension", () => {
    expect(getFileTypeFromExtension("document.pdf")).toBe("other");
  });

  it("returns 'other' for an empty string", () => {
    expect(getFileTypeFromExtension("")).toBe("other");
  });

  it("is case-insensitive", () => {
    expect(getFileTypeFromExtension("photo.JPG")).toBe("image");
    expect(getFileTypeFromExtension("clip.MP4")).toBe("video");
  });

  it("works with a full file path", () => {
    expect(
      getFileTypeFromExtension("media/posts/202408/photo.jpg")
    ).toBe("image");
  });
});
