import { nanoid } from "nanoid";
import slugifyFn from "slugify";

export function slugify(title: string) {
  let slug = slugifyFn(title, { lower: true, strict: true });
  slug += `-${nanoid(6)}`;

  return slug;
}
