<p align="center">
  <img width="450" height="120" src="https://raw.githubusercontent.com/kriziw/Rahoot/main/.github/logo.svg" alt="Rahoot logo">
</p>

<p align="center">
  <img alt="Visitor Badge" src="https://api.visitorbadge.io/api/visitors?path=https://github.com/kriziw/Rahoot/edit/main/README.md&countColor=%2337d67a">
  <img src="https://img.shields.io/docker/pulls/kriziw/rahoot?style=for-the-badge&color=37d67a" alt="Docker Pulls">
</p>

Rahoot is a self-hosted, open-source quiz game inspired by Kahoot. It is designed for small events, classrooms, and team sessions where you want a lightweight quiz host that runs on your own server.

> Warning: the project is still under active development. If you hit bugs or have feature ideas, please open an [issue](https://github.com/kriziw/Rahoot/issues).

<p align="center">
  <img width="30%" src="https://raw.githubusercontent.com/kriziw/Rahoot/main/.github/preview1.jpg" alt="Login screen">
  <img width="30%" src="https://raw.githubusercontent.com/kriziw/Rahoot/main/.github/preview2.jpg" alt="Manager dashboard">
  <img width="30%" src="https://raw.githubusercontent.com/kriziw/Rahoot/main/.github/preview3.jpg" alt="Question screen">
</p>

## Features

- Self-hosted quiz sessions with a manager/host interface
- Quiz files stored as JSON in `config/quizz`
- Quiz run history stored in SQLite at `config/history.db`
- CSV export for completed quiz runs
- Global fallback audio support plus per-question media
- Local media uploads stored in `media/`

## Requirements

Choose one setup path:

- Docker and Docker Compose
- Node.js 22+ and PNPM

## Quick Start

### Docker Compose

The simplest way to run Rahoot is with Docker Compose:

```bash
docker compose up -d
```

The app will be available at [http://localhost:3000](http://localhost:3000).

The repository `compose.yml` uses the published Docker Hub image:

- `kriziw/rahoot:latest`

Compose mounts two local folders:

- `./config:/app/config`
- `./media:/app/media`

Those folders persist:

- game configuration
- quiz JSON files
- run history in `config/history.db`
- uploaded local audio files

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

If you want to build the image yourself from this repository instead of pulling it from Docker Hub:

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

## Configuration

Rahoot stores its data in a small set of local files and folders.

### `config/game.json`

Main manager settings:

```json
{
  "managerPassword": "PASSWORD",
  "defaultAudio": "/media/example.mp3"
}
```

Fields:

- `managerPassword`: required for manager login. Change this from the default value before using the app.
- `defaultAudio`: optional fallback audio played when a question does not define its own `audio`.

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

## How To Use

1. Open [http://localhost:3000/manager](http://localhost:3000/manager)
2. Sign in with the manager password from `config/game.json`
3. Create, edit, delete, or launch a quiz
4. Share the main app URL and room code with players
5. Run the quiz and review exports/history afterward

## Contributing

1. Fork the repository
2. Create a branch
3. Make your changes
4. Open a pull request

For bugs or feature requests, use [GitHub Issues](https://github.com/kriziw/Rahoot/issues).

## Releases

Rahoot now uses automated release management on `main`:

- merge commits should follow Conventional Commits, such as `feat:`, `fix:`, or `feat!:`
- GitHub Actions keeps a release PR up to date with the next version and changelog
- merging that release PR creates the GitHub release and publishes Docker tags for:
  - the full version, for example `1.2.3`
  - the major/minor line, for example `1.2`
  - `latest`

The release workflow expects these repository secrets:

- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`

## Star History

<a href="https://www.star-history.com/?repos=kriziw%2FRahoot&type=date&legend=bottom-right">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/image?repos=kriziw/Rahoot&type=date&theme=dark&legend=bottom-right" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/image?repos=kriziw/Rahoot&type=date&legend=bottom-right" />
   <img alt="Star History Chart" src="https://api.star-history.com/image?repos=kriziw/Rahoot&type=date&legend=bottom-right" />
 </picture>
</a>
