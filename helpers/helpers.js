import { nanoid } from "nanoid/async/index.native";

export const createId = async () => {
  try {
    const id = await nanoid();
    return id;
  } catch (error) {
    throw new Error("Error in generating random Id:", error);
  }
};

export const capitalize = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
