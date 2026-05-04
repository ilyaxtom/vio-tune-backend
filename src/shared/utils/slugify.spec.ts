jest.mock("nanoid", () => ({
  nanoid: jest.fn(),
}));

import { nanoid } from "nanoid";

import { slugify } from "./slugify";

describe("slugify util", () => {
  const mockedNanoid = nanoid as jest.Mock;

  beforeEach(() => {
    mockedNanoid.mockReset();
  });

  it("should slugify a simple string and append nanoid", () => {
    mockedNanoid.mockReturnValue("abc123");

    const result = slugify("Hello World");

    expect(result).toBe("hello-world-abc123");
  });

  it("should remove special characters", () => {
    mockedNanoid.mockReturnValue("xyz789");

    const result = slugify("Hello @ World!!!");

    expect(result).toBe("hello-world-xyz789");
  });

  it("should handle multiple spaces", () => {
    mockedNanoid.mockReturnValue("test12");

    const result = slugify("Hello     World");

    expect(result).toBe("hello-world-test12");
  });

  it("should lowercase the result", () => {
    mockedNanoid.mockReturnValue("lower1");

    const result = slugify("HeLLo WoRLD");

    expect(result).toBe("hello-world-lower1");
  });

  it("should always append a 6-character id", () => {
    mockedNanoid.mockReturnValue("123456");

    const result = slugify("Test");

    expect(result).toMatch(/^test-123456$/);
  });

  it("should call nanoid with length 6", () => {
    mockedNanoid.mockReturnValue("aaaaaa");

    slugify("Test");

    expect(mockedNanoid).toHaveBeenCalledWith(6);
  });
});
