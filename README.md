## Description

[NestJS](https://nestjs.com/) progressive Node.js framework starter project

## Philosophy

- Nothing is hidden from you, so you have the freedom to make the necessary adjustments to fit your needs and preferences.
- Regular updates to dependencies ensure you are using the latest and most secure versions
- Designed to be easily tailored to your specific use cases and requirements
- Emphasis on minimal and efficient code to ensure maintainability and performance
- ☕ Built with best practices to ensure stability and reliability in production environments
- 🚀 Production-ready

## Requirements

- Node.js 20+ and npm

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run dev

# build
$ npm run build
```

## Format code

```bash
# prettier
$ npm run prettier:fix

# eslint
$ npm run lint:fix
```

## GitHub Actions CI Pipeline

The GitHub Actions configuration is located in the /.github/workflows directory
The CI pipeline is set up to run various tasks including linting, testing, and building the project
These automated workflows ensure that the codebase maintains quality standards and
that the project is correctly built and tested on every push or pull request to the specified branches

## Project structure

```bash
.
├── README.md                       # Provides information about the project, how to set it up, and how to use it
├── .env.example                    # Example file to show required environment variables
├── .gitignore                      # Specifies which files and directories to ignore in version control
├── .prettierignore                 # Lists files and directories to ignore for Prettier formatting
├── .prettierrc                     # Configuration file for Prettier code formatter
├── .nest-cli.json                  # Configuration file for Nest CLI
├── eslint.config.mjs               # Configuration file for ESLint with ES module syntax
├── .github                         
│   ├── workflows                   # GitHub Actions CI Pipeline config
├── src
│   ├── health
│   │   ├── health.controller.ts    # HealthController - Handles HTTP requests related to health checks
│   │   ├── health.module.ts        # HealthModule - Defines and exports the health-related module
│   ├── logger
│   │   ├── logger.module.ts        # LoggerModule - Defines and exports the logger module
│   │   ├── pino-logger.service.ts  # PinoLoggerService - Provides logging functionality using Pino        
│   ├── app.controller.ts           # AppController - Handles HTTP requests for the root of the application
│   ├── app.module.ts               # AppModule - Root module that aggregates other modules and services
│   ├── app.service.ts              # AppService - Provides business logic and methods used by AppController
│   ├── cron.service.ts             # CronService - Manages scheduled tasks and cron jobs
│   ├── main.ts                     # Main entry point - Initializes the NestJS application and starts the server
└── tsconfig.json                   # Configuration file for TypeScript compiler
```

## Swagger API Documentation

This application includes Swagger for API documentation. To view the Swagger interface:
1. Start the application (if it's not already running):

```bash
$ npm run start
```
2. Open your browser and navigate to:

```bash
http://localhost:3000/api
```
Replace 3000 with your configured port if different.

You will see the Swagger UI, where you can explore the API endpoints, view their documentation, and interact with them

## Support

Nest is an MIT-licensed open source project

## Stay in touch

- Author - Volodymyr Dehtiarev
- Email - [degtyarevvladimirr@gmail.com](mailto:degtyarevvladimirr@gmail.com)
- LinkedIn - [LinkedIn profile](https://www.linkedin.com/in/volodymyr-dehtiarev/)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE)