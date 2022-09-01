# Zero2Sixty Repository

- [Zero2Sixty Repository](#zero2sixty-repository)
  - [What is Zero2Sixty?](#what-is-zero2sixty)
  - [Stack](#stack)
    - [Database](#database)
    - [Language](#language)
  - [Commit Guidelines](#commit-guidelines)
  - [Running the bot](#running-the-bot)
    - [With PM2](#with-pm2)
    - [Without PM2](#without-pm2)


## What is Zero2Sixty?
Zero2Sixty is a racing bot that currently operates out of Discord! It allows for users to race, betrace, form teams and many many other features!

## Stack

### Database
For Database, we originally opted for SqLite files using a NodeJS package, this worked for a little while however became problomatic down the line. We're now using MongoDB!

### Language
We've opted for NodeJS- There isn't a special reason whatsoever, the lead developer and owner just happens to know JS very well :)

## Commit Guidelines
You do not need to lint yourself as we handle this automatically with Github Actions.

## Running the bot

### With PM2
This is for users who wish to use PM2.

We've made the process as simple as possible!

```bash
npm ci
npm run start
```
We reccomend using `npm ci` as this clean installs your dependencies, therefore ensuring they're as up to date as possible.
`npm run start` will launch it into your PM2 for you!

### Without PM2
This is for users who wish to operate the bot without using PM2.

The process is almost entirely the same as with PM2 so I will not explain the commands.

```bash
npm ci
npm run start-basic
```

