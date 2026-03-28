<p align="center">
  <img width="450" height="120" src="https://raw.githubusercontent.com/kriziw/Rahoot/main/.github/logo.svg" alt="Rahoot logo">
</p>

<p align="center">
  <img alt="Visitor Badge" src="https://api.visitorbadge.io/api/visitors?path=https://github.com/kriziw/Rahoot/edit/main/README.md&countColor=%2337d67a">
  <img src="https://img.shields.io/docker/pulls/kriziw/rahoot?style=for-the-badge&color=37d67a" alt="Docker Pulls">
</p>

Rahoot is a self-hosted quiz platform for classrooms, team sessions, events, and internal training. This repository is an enhanced fork of the original [Ralex91/Rahoot](https://github.com/Ralex91/Rahoot), expanding the manager experience with richer quiz administration, run history, exports, settings, media support, and mobile reconnect improvements.

Original credit belongs to [Ralex91](https://github.com/Ralex91) for the original Rahoot project and foundation.

> Warning: the project is still under active development. If you hit bugs or have feature ideas, please open an [issue](https://github.com/kriziw/Rahoot/issues).

<p align="center">
  <img width="30%" src="https://raw.githubusercontent.com/kriziw/Rahoot/main/.github/preview1.jpg" alt="Login screen">
  <img width="30%" src="https://raw.githubusercontent.com/kriziw/Rahoot/main/.github/preview2.jpg" alt="Manager dashboard">
  <img width="30%" src="https://raw.githubusercontent.com/kriziw/Rahoot/main/.github/preview3.jpg" alt="Question screen">
</p>

## Why This Fork Exists

The original project is a great lightweight self-hosted Kahoot-style game. This fork keeps that spirit, but pushes the admin side much further so you can manage quizzes and review results without constantly dropping into JSON files by hand.

## What's Added In This Version

- Manager dashboard with quiz creation, editing, deletion, and launch
- In-browser quiz editor for question text, answers, timers, and optional media
- SQLite-backed run history for completed games
- CSV export for the current run and retrospective exports from history
- Manager settings for password updates and default fallback audio
- Support for remote audio URLs and local audio uploads stored in `media/`
- Improved manager session persistence and explicit logout flow
- Better mobile reconnect recovery for players after app switching or screen lock
- Published Docker image and release automation for easier deployments

## Core Features

- Self-hosted multiplayer quiz sessions
- Host / manager interface plus player join flow by room code
- Quiz definitions stored as JSON in `config/quizz/`
- Detailed completed-run history stored in SQLite at `config/history.db`
- Optional image, video, and audio per question
- Global fallback audio when a question does not define its own audio
- Docker-first deployment with persistent config and media volumes

## Requirements

Choose one setup path:

- Docker and Docker Compose
- Node.js 24+ and PNPM

## Quick Start

### Docker Compose

The simplest way to run Rahoot is with Docker Compose:

```bash
docker compose up -d
```

The app will be available at [http://localhost:3000](http://localhost:3000).

The repository `compose.yml` uses the published Docker Hub image:

- `kriziw/rahoot:latest`

It mounts:

- `./config:/app/config`
- `./media:/app/media`

Those folders persist:

- manager configuration
- quiz JSON files
- quiz run history
- uploaded local media

### Docker Run

```bash
docker run -d \
  -p 3000:3000 \
  -v ./config:/app/config \
  -v ./media:/app/media \
  kriziw/rahoot:latest
```

### Local Development

```bash
git clone https://github.com/kriziw/Rahoot.git
cd Rahoot
pnpm install
pnpm run dev
```

For a production build:

```bash
pnpm run build
pnpm start
```

### Build From Source With Docker

```bash
git clone https://github.com/kriziw/Rahoot.git
cd Rahoot
docker build -t kriziw/rahoot:local .
docker run -d \
  -p 3000:3000 \
  -v ./config:/app/config \
  -v ./media:/app/media \
  kriziw/rahoot:local
```

## How To Use

1. Open [http://localhost:3000/manager](http://localhost:3000/manager)
2. Sign in with the manager password from `config/game.json`
3. Create, edit, delete, or launch a quiz
4. Share the main app URL and room code with players
5. Run the quiz
6. Download current results or revisit them later from the history view

## Data Layout

Rahoot stores its runtime data in a few simple locations.

### `config/game.json`

Main manager settings:

```json
{
  "managerPassword": "PASSWORD",
  "defaultAudio": "/media/example.mp3"
}
```

Fields:

- `managerPassword`: required for manager login
- `defaultAudio`: optional fallback audio used when a question does not define `audio`

### `config/quizz/*.json`

Quiz definitions live in `config/quizz/`.

Example:

```json
{
  "subject": "Example Quiz",
  "questions": [
    {
      "question": "What is the correct answer?",
      "answers": ["No", "Yes", "No", "No"],
      "image": "https://images.unsplash.com/....",
      "solution": 1,
      "cooldown": 5,
      "time": 15
    }
  ]
}
```

Question fields:

- `question`: question text
- `answers`: 2 to 4 possible answers
- `image`: optional image URL
- `video`: optional video URL
- `audio`: optional audio URL
- `solution`: zero-based index of the correct answer
- `cooldown`: delay before answers are shown
- `time`: answer timer in seconds

### `config/history.db`

Completed quiz runs are stored in SQLite. The manager UI uses this history to list past runs and export detailed CSV results.

### `media/`

Manager-uploaded local audio files are stored here and served by the app at `/media/<filename>`.

## Manager Capabilities

The manager UI now covers much more than starting a game:

- authenticate into the admin dashboard
- create new quizzes
- edit existing quizzes from the browser
- delete quizzes
- launch quiz sessions
- review historic runs
- export detailed CSV results
- update the manager password
- set a default audio track by URL or upload a local file

## Releases

Rahoot uses automated release management on `main`:

- merge commits should follow Conventional Commits, such as `feat:`, `fix:`, or `feat!:`
- GitHub Actions keeps a release PR up to date with the next version and changelog
- merging that release PR creates the GitHub release and publishes Docker tags for:
  - the full version, for example `1.2.3`
  - the major/minor line, for example `1.2`
  - `latest`

The release workflow expects these repository secrets:

- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`

## Contributing

1. Fork the repository
2. Create a branch
3. Make your changes
4. Open a pull request

For bugs or feature requests, use [GitHub Issues](https://github.com/kriziw/Rahoot/issues).

## Attribution

This repository builds on the original [Ralex91/Rahoot](https://github.com/Ralex91/Rahoot) project. If you are evaluating Rahoot for the first time, please consider checking out the upstream project and giving credit to the original work as well.

## Star History

<a href="https://www.star-history.com/?repos=kriziw%2FRahoot&type=date&legend=bottom-right">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/image?repos=kriziw/Rahoot&type=date&theme=dark&legend=bottom-right" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/image?repos=kriziw/Rahoot&type=date&legend=bottom-right" />
   <img alt="Star History Chart" src="https://api.star-history.com/image?repos=kriziw/Rahoot&type=date&legend=bottom-right" />
 </picture>
</a>
