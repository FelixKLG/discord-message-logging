// imports
import dotenv from 'dotenv';
import { Client, WebhookClient, GatewayIntentBits, EmbedBuilder } from 'discord.js';
import { PrismaClient } from '@prisma/client';


// Initialize dotenv, Prisma, & DJs
// --------------------------------
// Dotenv
dotenv.config();
// Discord.JS
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const webhookClient = new WebhookClient({ url: process.env.WEBHOOK_URL });
// Prisma
const prisma = new PrismaClient();

// Spawn Discord gateway connection
client.login(process.env.TOKEN);
client.once('ready', () => console.log('ready'));

// Hook into message creations
client.on('messageCreate', async (message) => {
	// Ignore messages from bots
	if (message.author.bot) return;
	// ignore messages that contain no text (embeds, attachments, etc)
	if (message.content.length === 0) return;

	// Clean up database
	// Generate random number between 0 and 20
	const checkValue = Math.floor(Math.random() * 21);
	console.log(checkValue);
	// If checkValue is 20, deleta all stangant messages from the database.
	if (checkValue === 20) {
		// Delete all messages older than 1 day
		await prisma.message.deleteMany({
			where: {
				createdAt: {
					lte: new Date(new Date().getTime() - (24 * 60 * 60 * 1000)),
				},
			},
		});
	}

	// Log text entry into database
	await prisma.message.create({
		data: {
			// eslint-disable-next-line no-undef
			id: BigInt(message.id),
			// eslint-disable-next-line no-undef
			userId: BigInt(message.author.id),
			// eslint-disable-next-line no-undef
			channelId: BigInt(message.channel.id),
			content: message.content,
		},
	});
});

// Hook into message deletions
client.on('messageDelete', async (message) => {
	// Ignore messages from bots
	if (message.author.bot) return;

	// Initialize EmbedBuilder
	const embed = new EmbedBuilder()
		.setTitle('Message Deleted')
		.setColor('Red');

	// If message.content is not empty, add it to the embed
	if (message.content.length > 0) {
		embed.setDescription(message.content);
	}
	// If message.content is empty try query the database for the message
	else {
		const letMessage = await prisma.message.findFirst({
			where: {
				// eslint-disable-next-line no-undef
				id: BigInt(message.id),
			},
		});
		// If the message is found in the database, add it to the embed
		if (letMessage) {
			embed.setDescription(letMessage.content);
		}
		// If message not found in database end the function
		else {
			return;
		}
	}

	// Send embed to webhook
	await webhookClient.send({
		embeds: [embed],
	});
});