# EspressoAI

> [!Warning]
> The project is in the early development stage and should not be used in. The codebase is subject to change, and the .
> documentation may be incomplete or outdated.

An AI-powered Telegram bot that helps users subscribe to websites and receive AI-summarized news updates at customizable intervals. EspressoAI saves you precious time by automatically monitoring your favorite news sources and delivering concise summaries directly to your Telegram. Especially valuable during vacations or busy periods, it ensures you stay informed with minimal effort. Never miss important updates while avoiding information overload.

## Features

- Subscribe to news sources via URL
- Customize notification intervals
- Receive AI-summarized news updates
- Multi-language support (English, Russian)
- Manage multiple subscriptions

## Installation

### Prerequisites

- [Bun](https://bun.sh/) (JavaScript runtime)
- PostgreSQL database (optional, SQLite used by default)
- OpenAI API key
- Telegram Bot Token

### Setup

#### Option 1: Local Installation

1. Clone the repository:
  ```bash
  git clone https://github.com/yourusername/macchiato.git
  cd macchiato
  ```

2. Install dependencies:
  ```bash
  bun install
  ```

3. Create a `.env` file with your configuration:
  ```
  BOT_TOKEN=your_telegram_bot_token
  OPENAI_API_KEY=your_openai_api_key
  DATABASE_URL=postgresql://user:password@localhost:5432/macchiato
  NOTIFICATION_CHECK_INTERVAL=60000
  DEFAULT_NEWS_CHECK_INTERVAL=30
  MAX_SUBSCRIPTIONS_PER_USER=10
  LOG_LEVEL=info
  ```

4. Start the bot:
  ```bash
  bun start
  ```

Option 2: Docker Installation

Clone the repository:
```
git clone https://github.com/yourusername/macchiato.git
cd macchiato
```

Create a .env file based on the example:
```bash
cp .env.example .env
```

Start with Docker Compose:
```
docker-compose up -d
```

Check the logs:

```bash
  docker-compose logs -f app
```

## Usage

- `/start` - Start the bot
- `/subscribe <url>` - Subscribe to a news source
- `/unsubscribe <url>` - Unsubscribe from a source
- `/interval <minutes>` - Set notification interval
- `/list` - List your subscriptions
- `/news <url>` - Get latest news from a source

## Project Structure

The project follows clean architecture principles with separation of concerns:

- `src/core`: Domain entities and business logic interfaces
- `src/data`: Data access layer (repositories, migrations)
- `src/integration`: External service integrations (RSS parser, AI)
- `src/services`: Application services
- `src/i18n`: Internationalization

## Development

Run the bot in development mode with hot reloading:

```bash
bun dev
```

Run tests:

```bash
bun test
```

# Author

Nikita Kriuchkov

## License

The GNU GPL license applies only to non-commercial use of this bot. For any commercial purposes, a paid license is required — contact us!

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes.