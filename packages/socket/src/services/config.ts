import { QuizzWithId } from "@rahoot/common/types/game";
import fs from "fs";
import { resolve } from "path";
import { v4 as uuid } from "uuid";

const inContainerPath = process.env.CONFIG_PATH;

const getPath = (path: string = "") =>
  inContainerPath
    ? resolve(inContainerPath, path)
    : resolve(process.cwd(), "../../config", path);

class Config {
  static getPathPublic(path: string = ""): string {
    return getPath(path);
  }

  static init() {
    const isConfigFolderExists = fs.existsSync(getPath());

    if (!isConfigFolderExists) {
      fs.mkdirSync(getPath());
    }

    const isGameConfigExists = fs.existsSync(getPath("game.json"));

    if (!isGameConfigExists) {
      fs.writeFileSync(
        getPath("game.json"),
        JSON.stringify(
          {
            managerPassword: "PASSWORD",
          },
          null,
          2,
        ),
      );
    }

    const isQuizzExists = fs.existsSync(getPath("quizz"));

    if (!isQuizzExists) {
      fs.mkdirSync(getPath("quizz"));

      fs.writeFileSync(
        getPath("quizz/example.json"),
        JSON.stringify(
          {
            subject: "Example Quizz",

            questions: [
              {
                question: "What is good answer ?",

                answers: ["No", "Good answer", "No", "No"],

                solution: 1,

                cooldown: 5,

                time: 15,
              },

              {
                question: "What is good answer with image ?",

                answers: ["No", "No", "No", "Good answer"],

                image: "https://placehold.co/600x400.png",

                solution: 3,

                cooldown: 5,

                time: 20,
              },

              {
                question: "What is good answer with two answers ?",

                answers: ["Good answer", "No"],

                image: "https://placehold.co/600x400.png",

                solution: 0,

                cooldown: 5,

                time: 20,
              },
            ],
          },

          null,

          2,
        ),
      );
    }

    const isAvatarsDirExists = fs.existsSync(getPath("avatars"));

    if (!isAvatarsDirExists) {
      fs.mkdirSync(getPath("avatars"));
    }

    const isAvatarsJsonExists = fs.existsSync(getPath("avatars.json"));

    if (!isAvatarsJsonExists) {
      const defaultAvatars = this.generateDefaultAvatars();
      fs.writeFileSync(
        getPath("avatars.json"),

        JSON.stringify(defaultAvatars, null, 2),
      );
    }
  }

  private static generateDefaultAvatars(): string[] {
    const emojis = [
      "😀",
      "😃",
      "😄",
      "😁",
      "😆",
      "😅",
      "😂",
      "🤣",
      "😊",
      "😇",
      "🙂",
      "😉",
      "😌",
      "😍",
      "🥰",
      "😘",
      "😗",
      "😙",
      "😚",
      "😋",
      "😛",
      "😜",
      "🤪",
      "😝",
      "🤑",
      "🤗",
      "🤭",
      "🤫",
      "🤔",
      "🤐",
      "🤨",
      "😐",
      "😑",
      "😶",
      "😏",
      "😒",
      "🙄",
      "😬",
      "🤥",
      "😌",
      "😔",
      "😪",
      "🤤",
      "😴",
      "😷",
      "🤒",
      "🤕",
      "🤢",
      "🤮",
      "🤧",
    ];

    return emojis;
  }

  static game() {
    const isExists = fs.existsSync(getPath("game.json"));

    if (!isExists) {
      throw new Error("Game config not found");
    }

    try {
      const config = fs.readFileSync(getPath("game.json"), "utf-8");

      return JSON.parse(config);
    } catch (error) {
      console.error("Config error:", error);
    }

    return {};
  }

  static quizz() {
    const isExists = fs.existsSync(getPath("quizz"));

    if (!isExists) {
      return [];
    }

    try {
      const files = fs

        .readdirSync(getPath("quizz"))

        .filter((file) => file.endsWith(".json"));

      const quizz: QuizzWithId[] = files.map((file) => {
        const data = fs.readFileSync(getPath(`quizz/${file}`), "utf-8");

        const config = JSON.parse(data);

        const id = file.replace(".json", "");

        return {
          id,

          ...config,
        };
      });

      return quizz || [];
    } catch (error) {
      console.error("Config error:", error);

      return [];
    }
  }

  static avatars(): string[] {
    try {
      const data = fs.readFileSync(getPath("avatars.json"), "utf-8");

      return JSON.parse(data);
    } catch (error) {
      console.error("Config error:", error);

      return this.generateDefaultAvatars();
    }
  }

  static getUserAvatar(
    username: string,
  ): { token: string; avatar: string } | null {
    const safeUsername = username.replace(/[^a-zA-Z0-9_-]/g, "_");
    const filePath = getPath(`avatars/${safeUsername}.json`);

    if (!fs.existsSync(filePath)) {
      return null;
    }

    try {
      const data = fs.readFileSync(filePath, "utf-8");

      return JSON.parse(data) as { token: string; avatar: string };
    } catch (error) {
      console.error("Config error:", error);
      return null;
    }
  }

  static createOrUpdateUserAvatar(
    username: string,
    avatar: string,
    providedToken?: string,
  ): { success: boolean; token?: string; error?: string } {
    const safeUsername = username.replace(/[^a-zA-Z0-9_-]/g, "_");
    const filePath = getPath(`avatars/${safeUsername}.json`);
    const existingData = this.getUserAvatar(username);

    if (existingData) {
      if (providedToken && providedToken !== existingData.token) {
        return {
          success: false,
          error: "Invalid token. Cannot modify avatar.",
        };
      }

      if (!providedToken && !existingData.token) {
        return {
          success: false,
          error: "Avatar already exists. Provide token to modify.",
        };
      }
    }

    const token = existingData?.token || uuid().replace(/-/g, "").slice(0, 16);

    const avatarData = {
      token,
      avatar,
    };

    try {
      fs.writeFileSync(filePath, JSON.stringify(avatarData, null, 2));

      return { success: true, token };
    } catch (error) {
      console.error("Config error:", error);

      return { success: false, error: "Failed to save avatar" };
    }
  }
}

export default Config;
