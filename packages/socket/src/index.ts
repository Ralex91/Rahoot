import { Server } from "@rahoot/common/types/game/socket";
import { inviteCodeValidator } from "@rahoot/common/validators/auth";
import Config from "@rahoot/socket/services/config";
import Game from "@rahoot/socket/services/game";
import Registry from "@rahoot/socket/services/registry";
import { withGame } from "@rahoot/socket/utils/game";
import { Server as ServerIO } from "socket.io";
import fs from "fs";

const WS_PORT = 3001;

const io: Server = new ServerIO({
  path: "/ws",
});

Config.init();

const registry = Registry.getInstance();

// Track authenticated manager sockets
const authenticatedManagers = new Set<string>();

console.log(`Socket server running on port ${WS_PORT}`);
io.listen(WS_PORT);

/**
 * Guard: checks that the socket has passed manager:auth.
 * Returns true if authenticated, false (and emits error) otherwise.
 */
function requireManagerAuth(socket: any): boolean {
  if (!authenticatedManagers.has(socket.id)) {
    socket.emit("manager:errorMessage", "Not authenticated as manager");
    return false;
  }
  return true;
}

/**
 * Sanitize an ID so it can only contain safe filesystem characters.
 * Prevents path traversal attacks (e.g. "../../game").
 */
function sanitizeId(raw: string): string {
  return String(raw).replace(/[^a-z0-9_-]/gi, "_");
}

io.on("connection", (socket) => {
  console.log(
    `A user connected: socketId: ${socket.id}, clientId: ${socket.handshake.auth.clientId}`,
  );

  // ──────────────────────────────────────────────
  // Reconnection
  // ──────────────────────────────────────────────

  socket.on("player:reconnect", ({ gameId }) => {
    const game = registry.getPlayerGame(gameId, socket.handshake.auth.clientId);

    if (game) {
      game.reconnect(socket);
      return;
    }

    socket.emit("game:reset", "Game not found");
  });

  socket.on("manager:reconnect", ({ gameId }) => {
    const game = registry.getManagerGame(
      gameId,
      socket.handshake.auth.clientId,
    );

    if (game) {
      game.reconnect(socket);
      return;
    }

    socket.emit("game:reset", "Game expired");
  });

  // ──────────────────────────────────────────────
  // Manager authentication
  // ──────────────────────────────────────────────

  socket.on("manager:auth", (password) => {
    try {
      const config = Config.game();

      if (config.managerPassword === "PASSWORD") {
        socket.emit(
          "manager:errorMessage",
          "Manager password is not configured",
        );
        return;
      }

      if (password !== config.managerPassword) {
        socket.emit("manager:errorMessage", "Invalid password");
        return;
      }

      authenticatedManagers.add(socket.id);
      socket.emit("manager:quizzList", Config.quizz());
    } catch (error) {
      console.error("Failed to read game config:", error);
      socket.emit("manager:errorMessage", "Failed to read game config");
    }
  });

  // ──────────────────────────────────────────────
  // Avatar (player – no auth required)
  // ──────────────────────────────────────────────

  socket.on("player:getAvatar", (username) => {
    const avatar = Config.getUserAvatar(username);
    socket.emit("player:avatarData", avatar);
  });

  socket.on("player:saveAvatar", ({ username, avatar, token }) => {
    const result = Config.createOrUpdateUserAvatar(username, avatar, token);
    socket.emit("player:avatarSaved", result);
  });

  // ──────────────────────────────────────────────
  // Quiz management (manager auth required)
  // ──────────────────────────────────────────────

  socket.on("manager:createQuiz", (quizzData) => {
    if (!requireManagerAuth(socket)) return;

    try {
      const { subject, questions } = quizzData;
      const id = sanitizeId(subject.toLowerCase());
      const filePath = Config.getPathPublic(`quizz/${id}.json`);

      // Check if quiz already exists
      if (fs.existsSync(filePath)) {
        const existingData = fs.readFileSync(filePath, "utf-8");
        const existingQuiz = JSON.parse(existingData);

        socket.emit("manager:quizExists", {
          exists: true,
          id,
          subject: existingQuiz.subject,
          questions: existingQuiz.questions,
        });
        return;
      }

      fs.writeFileSync(
        filePath,
        JSON.stringify({ subject, questions }, null, 2),
      );

      socket.emit("manager:quizCreated", { success: true, id });
    } catch (error) {
      console.error("Failed to create quiz:", error);
      socket.emit("manager:quizCreated", {
        success: false,
        error: "Failed to create quiz",
      });
    }
  });

  socket.on("manager:confirmCreateQuiz", (quizzData) => {
    if (!requireManagerAuth(socket)) return;

    try {
      const { subject, questions } = quizzData;
      const id = sanitizeId(subject.toLowerCase());
      const filePath = Config.getPathPublic(`quizz/${id}.json`);

      fs.writeFileSync(
        filePath,
        JSON.stringify({ subject, questions }, null, 2),
      );

      socket.emit("manager:quizCreated", { success: true, id });
    } catch (error) {
      console.error("Failed to create quiz:", error);
      socket.emit("manager:quizCreated", {
        success: false,
        error: "Failed to create quiz",
      });
    }
  });

  socket.on("manager:importQuiz", (quizData) => {
    if (!requireManagerAuth(socket)) return;

    try {
      const { subject, questions } = quizData;
      const id = sanitizeId(subject.toLowerCase());
      const filePath = Config.getPathPublic(`quizz/${id}.json`);

      if (fs.existsSync(filePath)) {
        socket.emit("manager:quizImportResult", {
          success: false,
          error: "Quiz with this name already exists",
        });
        return;
      }

      fs.writeFileSync(
        filePath,
        JSON.stringify({ subject, questions }, null, 2),
      );

      socket.emit("manager:quizImportResult", { success: true, id });
    } catch (error) {
      console.error("Failed to import quiz:", error);
      socket.emit("manager:quizImportResult", {
        success: false,
        error: "Failed to import quiz",
      });
    }
  });

  socket.on("manager:deleteQuiz", (quizzId) => {
    if (!requireManagerAuth(socket)) return;

    try {
      const safeId = sanitizeId(quizzId);
      const filePath = Config.getPathPublic(`quizz/${safeId}.json`);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        socket.emit("manager:quizDeleted", { success: true });
      } else {
        socket.emit("manager:quizDeleted", {
          success: false,
          error: "Quiz not found",
        });
      }
    } catch (error) {
      console.error("Failed to delete quiz:", error);
      socket.emit("manager:quizDeleted", {
        success: false,
        error: "Failed to delete quiz",
      });
    }
  });

  // ──────────────────────────────────────────────
  // Game lifecycle
  // ──────────────────────────────────────────────

  socket.on("game:create", (quizzId) => {
    const quizzList = Config.quizz();
    const quizz = quizzList.find((q) => q.id === quizzId);

    if (!quizz) {
      socket.emit("game:errorMessage", "Quizz not found");
      return;
    }

    const game = new Game(io, socket, quizz);
    registry.addGame(game);
  });

  socket.on("player:join", (inviteCode) => {
    const result = inviteCodeValidator.safeParse(inviteCode);

    if (result.error) {
      socket.emit("game:errorMessage", result.error.issues[0].message);
      return;
    }

    const game = registry.getGameByInviteCode(inviteCode);

    if (!game) {
      socket.emit("game:errorMessage", "Game not found");
      return;
    }

    socket.emit("game:successRoom", game.gameId);
  });

  socket.on("player:login", ({ gameId, data }) =>
    withGame(gameId, socket, (game) => game.join(socket, data)),
  );

  socket.on("manager:kickPlayer", ({ gameId, playerId }) =>
    withGame(gameId, socket, (game) => game.kickPlayer(socket, playerId)),
  );

  socket.on("manager:startGame", ({ gameId }) =>
    withGame(gameId, socket, (game) => game.start(socket)),
  );

  socket.on("player:selectedAnswer", ({ gameId, data }) =>
    withGame(gameId, socket, (game) =>
      game.selectAnswer(socket, data.answerKey),
    ),
  );

  socket.on("manager:abortQuiz", ({ gameId }) =>
    withGame(gameId, socket, (game) => game.abortRound(socket)),
  );

  socket.on("manager:nextQuestion", ({ gameId }) =>
    withGame(gameId, socket, (game) => game.nextRound(socket)),
  );

  socket.on("manager:showLeaderboard", ({ gameId }) =>
    withGame(gameId, socket, (game) => game.showLeaderboard()),
  );

  // ──────────────────────────────────────────────
  // Disconnect
  // ──────────────────────────────────────────────

  socket.on("disconnect", () => {
    console.log(`A user disconnected: ${socket.id}`);

    // Clean up manager auth tracking
    authenticatedManagers.delete(socket.id);

    const managerGame = registry.getGameByManagerSocketId(socket.id);

    if (managerGame) {
      managerGame.manager.connected = false;
      registry.markGameAsEmpty(managerGame);

      if (!managerGame.started) {
        managerGame.abortCooldown();
        io.to(managerGame.gameId).emit("game:reset", "Manager disconnected");
        registry.removeGame(managerGame.gameId);
        return;
      }
    }

    const game = registry.getGameByPlayerSocketId(socket.id);

    if (!game) {
      return;
    }

    const player = game.players.find((p) => p.id === socket.id);

    if (!player) {
      return;
    }

    if (!game.started) {
      game.players = game.players.filter((p) => p.id !== socket.id);

      io.to(game.manager.id).emit("manager:removePlayer", player.id);
      io.to(game.gameId).emit("game:totalPlayers", game.players.length);

      console.log(`Removed player ${player.username} from game ${game.gameId}`);

      return;
    }

    player.connected = false;
    io.to(game.gameId).emit("game:totalPlayers", game.players.length);
  });
});

process.on("SIGINT", () => {
  Registry.getInstance().cleanup();
  process.exit(0);
});

process.on("SIGTERM", () => {
  Registry.getInstance().cleanup();
  process.exit(0);
});
