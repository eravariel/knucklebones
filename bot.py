import discord
from discord.ext import commands
from discord import app_commands
import uuid
import os
from dotenv import load_dotenv
import requests

load_dotenv()

# Initialize bot
intents = discord.Intents.all()
bot = commands.Bot(command_prefix="!", intents=intents)

# Server URL - will be set from Replit environment
SERVER_URL = os.getenv("SERVER_URL", "http://localhost:5000")

@bot.event
async def on_ready():
    print(f"✅ Bot is online as {bot.user}")
    try:
        synced = await bot.tree.sync()
        print(f"✅ Synced {len(synced)} command(s)")
    except Exception as e:
        print(f"❌ Failed to sync commands: {e}")

@bot.tree.command(name="knucklebones", description="Start a Knucklebones game!")
@app_commands.describe(opponent="The player you want to challenge")
async def knucklebones(interaction: discord.Interaction, opponent: discord.User):
    """Create a new Knucklebones game session"""
    
    if opponent == interaction.user:
        await interaction.response.send_message("❌ You can't play against yourself!", ephemeral=True)
        return
    
    if opponent.bot:
        await interaction.response.send_message("❌ You can't play against a bot!", ephemeral=True)
        return
    
    # Create a unique game session ID
    game_id = str(uuid.uuid4())[:8]
    
    # Create the game session on the backend server
    try:
        response = requests.post(f"{SERVER_URL}/api/games", json={
            "game_id": game_id,
            "player1_id": str(interaction.user.id),
            "player1_name": interaction.user.name,
            "player2_id": str(opponent.id),
            "player2_name": opponent.name
        })
        
        if response.status_code != 201:
            await interaction.response.send_message("❌ Failed to create game session. Is the server running?", ephemeral=True)
            return
        
        # Generate game links
        player1_link = f"{SERVER_URL}/game/{game_id}?player=1"
        player2_link = f"{SERVER_URL}/game/{game_id}?player=2"
        
        # Send embeds to both players
        embed = discord.Embed(
            title="🎲 Knucklebones Challenge!",
            description=f"{interaction.user.mention} challenged {opponent.mention} to a game of Knucklebones!",
            color=discord.Color.gold()
        )
        embed.add_field(name="🎮 Your Game Link:", value=f"[Click here to play!]({player1_link})", inline=False)
        embed.set_footer(text=f"Game ID: {game_id}")
        
        # Send to player 1 (public message first)
        await interaction.response.send_message(
            f"🎲 **{interaction.user.mention} vs {opponent.mention}** - Game started!",
            embed=embed
        )
        
        # Send DM to player 2
        try:
            embed2 = discord.Embed(
                title="🎲 Knucklebones Challenge!",
                description=f"{interaction.user.mention} challenged you to a game of Knucklebones!",
                color=discord.Color.gold()
            )
            embed2.add_field(name="🎮 Your Game Link:", value=f"[Click here to play!]({player2_link})", inline=False)
            embed2.set_footer(text=f"Game ID: {game_id}")
            
            await opponent.send(embed=embed2)
        except discord.Forbidden:
            await interaction.followup.send(f"⚠️ Couldn't DM {opponent.mention}, but they can see the link above!", ephemeral=True)
            
    except Exception as e:
        print(f"❌ Error creating game: {e}")
        await interaction.response.send_message(f"❌ Error creating game: {str(e)}", ephemeral=True)

# Run the bot
TOKEN = os.getenv("DISCORD_TOKEN")
if not TOKEN:
    print("❌ DISCORD_TOKEN not found in environment variables!")
else:
    bot.run(TOKEN)
