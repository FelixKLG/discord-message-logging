# Discord Message Tracker

So I initially had the though of this bot when I was moderating a large server,

we had encountered some issues with Dyno and wanted to switch it out.

The main thing holding us back was the time it would take to create a custom bot and Dyno's logging capabilites.

I put forward the idea of creating a log using either the local cache of the bot with a database to fallback on.

---

## Prerequisites
|[NodeJS](https://nodejs.org/en/) |[pnpm](https://pnpm.io/) |
--- | --- |
| >= 18.0 | >= 7.0

## Setup

Clone or download the repo.

Open it in your favourite IDE or terminal.

Run `pnpm i` to install the required dependencies.

Copy the `.env.example` as `.env`, configure it with your Discord bot token and webhook URL.

Run `pnpm run start`; the bot should say `ready` in the console.
This indicates that the bot has come online and is monitoring messages.