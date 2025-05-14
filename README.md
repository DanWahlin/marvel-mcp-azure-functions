[![MseeP.ai Security Assessment Badge](https://mseep.net/pr/danwahlin-marvel-mcp-azure-functions-badge.png)](https://mseep.ai/app/danwahlin-marvel-mcp-azure-functions)

<div align="center">

<img src="./images/captain-america.jpg" alt="" align="center" height="96" />

# Marvel MCP Server using Azure Functions

[![Open project in GitHub Codespaces](https://img.shields.io/badge/Codespaces-Open-blue?style=flat-square&logo=github)](https://codespaces.new/danwahlin/marvel-mcp?hide_repo_select=true&ref=main&quickstart=true)
![Node version](https://img.shields.io/badge/Node.js->=20-3c873a?style=flat-square)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

[Features](#features) • [Tools](#tools) • [Setup](#setup) • [Configuring an MCP Host](#configuring-an-mcp-host)

</div>

MCP Server for the [Marvel Developer API](https://developer.marvel.com/documentation/getting_started), enabling interaction with characters and comics data. *The main goal of the project is to show how an MCP server hosted using Azure Functions can be used to interact with APIs.*

> **Note**: All data used by this MCP server is fetched from the [official Marvel API](https://developer.marvel.com/documentation/getting_started) and owned by Marvel. This project is not affiliated with Marvel in any way.

<a name="features"></a>
## 🔧 Features

- **List Marvel Characters**: Supports filters like `nameStartsWith`, `limit`, `comics`, `series`, etc.
- **Fetch a Marvel Character by ID**: Get detailed info on any character using their `characterId`.
- **Fetch Comics for a Character**: Get a list of comics featuring a specific character, with various filters like `format`, `dateRange`, etc.
- **Tool-based MCP integration**: Register this server with Model Context Protocol (MCP) tools (VS Code, Claude, etc.).
- **Environment Configuration**: Use `.env` file to manage environment variables like `MARVEL_PUBLIC_KEY`, `MARVEL_PRIVATE_KEY` and `MARVEL_API_BASE`.

<a name="tools"></a>
## 🧰 Tools

### 1. `get_characters` 🔍🦸‍♂️
- **Description**: Fetch Marvel characters with optional filters.
- **Inputs**:
  - `name` (optional string): Full character name.
  - `nameStartsWith` (optional string): Characters whose names start with the specified string.
  - `modifiedSince` (optional string): ISO 8601 date string to filter characters modified since this date.
  - `comics`, `series`, `events`, `stories` (optional string): Comma-separated list of IDs to filter by related entities.
  - `orderBy` (optional string): Fields to order the results by, such as `name` or `-modified`.
  - `limit` (optional number): Maximum number of results to return (1–100).
  - `offset` (optional number): Number of results to skip for pagination.
- **Returns**: JSON response with matching characters. See `CharacterDataWrapperSchema` in `src/schemas.ts` for details.

### 2. `get_character_by_id` 🆔🧑‍🎤
- **Description**: Fetch a Marvel character by their unique ID.
- **Input**:
  - `characterId` (number): The unique ID of the character.
- **Returns**: JSON response with the character's details. See `CharacterDataWrapperSchema` in `src/schemas.ts` for details.

### 3. `get_comics_for_character` 📚🎭
- **Description**: Fetch comics featuring a specific character, with optional filters.
- **Inputs**:
  - `characterId` (number): The unique ID of the character.
  - Optional filters:
    - `format`, `formatType` (string): Filter by comic format (e.g., `comic`, `hardcover`).
    - `noVariants`, `hasDigitalIssue` (boolean): Flags to exclude variants or include only digital issues.
    - `dateDescriptor` (string): Predefined date ranges like `thisWeek`, `nextWeek`.
    - `dateRange` (string): Custom date range in the format `YYYY-MM-DD,YYYY-MM-DD`.
    - `title`, `titleStartsWith` (string): Filter by title or title prefix.
    - `startYear`, `issueNumber`, `digitalId` (number): Numeric filters.
    - `diamondCode`, `upc`, `isbn`, `ean`, `issn` (string): Identifier filters.
    - `creators`, `series`, `events`, `stories`, `sharedAppearances`, `collaborators` (string): Comma-separated list of related entity IDs.
    - `orderBy` (string): Fields to order the results by, such as `title` or `-modified`.
    - `limit`, `offset` (number): Pagination options.
- **Returns**: JSON response with comics featuring the specified character. See `ComicDataWrapperSchema` in `src/schemas.ts` for details.

### 4. `get_comics` 📖🕵️‍♂️
- **Description**: Fetch lists of Marvel comics with optional filters.
- **Inputs**:
  - `format` (optional string): Filter by the issue format (e.g., `comic`, `digital comic`, `hardcover`).
  - `formatType` (optional string): Filter by the issue format type (`comic` or `collection`).
  - `noVariants` (optional boolean): Exclude variants (alternate covers, secondary printings, director's cuts, etc.) from the result set.
  - `dateDescriptor` (optional string): Return comics within a predefined date range (`lastWeek`, `thisWeek`, `nextWeek`, `thisMonth`).
  - `dateRange` (optional string): Return comics within a custom date range. Dates must be specified as `YYYY-MM-DD,YYYY-MM-DD`.
  - `title` (optional string): Return only issues in series whose title matches the input.
  - `titleStartsWith` (optional string): Return only issues in series whose title starts with the input.
  - `startYear` (optional number): Return only issues in series whose start year matches the input.
  - `issueNumber` (optional number): Return only issues in series whose issue number matches the input.
  - `diamondCode`, `digitalId`, `upc`, `isbn`, `ean`, `issn` (optional string): Filter by various identifiers.
  - `hasDigitalIssue` (optional boolean): Include only results which are available digitally.
  - `modifiedSince` (optional string): Return only comics which have been modified since the specified date (ISO 8601 format).
  - `creators`, `characters`, `series`, `events`, `stories`, `sharedAppearances`, `collaborators` (optional string): Comma-separated list of IDs to filter by related entities.
  - `orderBy` (optional string): Order the result set by a field or fields. Add a "-" to the value to sort in descending order (e.g., `title`, `-modified`).
  - `limit` (optional number): Limit the result set to the specified number of resources (default: 20, max: 100).
  - `offset` (optional number): Skip the specified number of resources in the result set.
- **Returns**: JSON response with matching comics. See `ComicDataWrapperSchema` in `src/schemas.ts` for details.

### 5. `get_comic_by_id` 🆔📘
- **Description**: Fetch a single Marvel comic by its unique ID.
- **Input**:
  - `comicId` (number): The unique ID of the comic.
- **Returns**: JSON response with the comic details. See `ComicDataWrapperSchema` in `src/schemas.ts` for details.

### 6. `get_characters_for_comic` 🦸‍♀️📖
- **Description**: Fetch Marvel characters appearing in a specific comic.
- **Inputs**:
  - `comicId` (number): The unique ID of the comic.
  - Optional filters:
    - `name` (optional string): Filter characters by full name.
    - `nameStartsWith` (optional string): Filter characters whose names start with the specified string.
    - `modifiedSince` (optional string): ISO 8601 date string to filter characters modified since this date.
    - `series`, `events`, `stories` (optional string): Comma-separated list of related entity IDs to filter by.
    - `orderBy` (optional string): Fields to order the results by, such as `name` or `-modified`.
    - `limit` (optional number): Maximum number of results to return (1–100).
    - `offset` (optional number): Number of results to skip for pagination.
- **Returns**: JSON response with characters appearing in the specified comic. See `CharacterDataWrapperSchema` in `src/schemas.ts` for details.

<a name="setup"></a>
## 🛠️ Setup

Sign up for a [Marvel Developer API](https://developer.marvel.com/documentation/getting_started) account and get your public and private API keys. 

If you want to the MCP server directly in an MCP host, jump to the [Use with GitHub Copilot](#use-with-github-copilot) or [Use with Claude Desktop](#use-with-claude-desktop) sections.

### Run the Server Locally

1. An Azure Storage Emulator is needed. There are two options:

    - Start Azurite in a Docker container:

      ```bash
      docker run -p 10000:10000 -p 10001:10001 -p 10002:10002 \
          mcr.microsoft.com/azure-storage/azurite
      ```

    - You can use the [Azurite VS Code extension](https://marketplace.visualstudio.com/items/?itemName=Azurite.azurite). Once the extension is installed, run `Azurite: Start` through the VS Code command palette.

1. Clone this repository:

    ```bash
    git clone https://github.com/DanWahlin/marvel-mcp-azure-functions
    ```

1. Rename `.env.template ` to `.env`.

1. Add your Marvel API public and private keys to the `.env` file.

    ```bash
    MARVEL_PUBLIC_KEY=YOUR_PUBLIC_KEY
    MARVEL_PRIVATE_KEY=YOUR_PRIVATE_KEY
    MARVEL_API_BASE=https://gateway.marvel.com/v1/public
    ```

1. Install the required dependencies and build the project.

    ```bash
    npm install
    npm run build
    ```

1. Start the Azure Functions host locally:

    ```bash
    npm start
    ```

1. (Optional) To try out the MCP server using MCP Inspector, run the following command:

    ```bash
    # Start the MCP Inspector
    npx @modelcontextprotocol/inspector node build/index.js
    ```

    Visit the MCP Inspector URL shown in the console in your browser:
    - Change `Transport Type` to `SSE`.
    - Enter `http://0.0.0.0:7071/runtime/webhooks/mcp/sse` for the URL.
    - Select `Connect` the button.
    - Select `List Tools`.
    - Select a tool to try it out.

<a name="configuring-an-mcp-host"></a>
## Configuring an MCP Host

### Use with Claude Desktop

Add the following to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "marvel-mcp": {
      "type": "sse",
      "url": "http://0.0.0.0:7071/runtime/webhooks/mcp/sse"
    }
  }
}
```
### Use with GitHub Copilot in VS Code

> **Note**: If you already have the MCP server enabled with Claude Desktop, add `chat.mcp.discovery.enabled: true` in your VS Code settings and it will discover existing MCP server lists.

If you want to associate the MCP server with a specific repo, create a `.vscode/mcp.json` file with this content:

   ```json
   {
     "inputs": [],
     "servers": {
        "marvel-mcp": {
          "type": "sse",
          "url": "http://0.0.0.0:7071/runtime/webhooks/mcp/sse"
        }
     }
   }
   ```

If you want to associate the MCP server with all repos, add the following to your VS Code User Settings JSON:

   ```json
  "mcp": {
    "servers": {
      "marvel-mcp": {
        "type": "sse",
        "url": "http://0.0.0.0:7071/runtime/webhooks/mcp/sse"
      }
    }
  }
   ```

## Deploy to Azure for Remote MCP

Run this [azd](https://aka.ms/azd) command to provision the function app, with any required Azure resources, and deploy your code:

```shell
azd up
```

You can opt-in to a VNet being used in the sample. To do so, do this before `azd up`

```bash
azd env set VNET_ENABLED true
```

Additionally, [API Management]() can be used for improved security and policies over your MCP Server, and [App Service built-in authentication](https://learn.microsoft.com/en-us/azure/app-service/overview-authentication-authorization) can be used to set up your favorite OAuth provider including Entra.  

### Using Tools in GitHub Copilot

1. Now that the mcp server is discoverable, open GitHub Copilot and select `Agent` mode (not `Ask` or `Edit`).
2. Select the "refresh" button in the Copilot chat text field to refresh the server list.
3. Select the "🛠️" button to see all the possible tools, including the ones from this repo.
4. Put a question in the chat that would naturally invoke one of the tools, for example: 

    ```
    List 10 marvel characters. Include images.

    What comics is Wolverine in?
    
    Which characters appear in the Avengers comics?

    What characters are in the Hedge Knight II: Sworn Sword (2007) comic?
    ```

    > **Note**: If you see "Sorry, the response was filtered by the Responsible AI Service.", try running it again or rephrasing the prompt.
