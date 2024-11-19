<!-- markdownlint-disable MD030 -->

# Degen AI facilitator - Build LLM Apps Easily

<h3>Drag & drop UI to build your customized LLM flow</h3>
<a href="https://github.com/Degen-AI-facilitator/DEGEN">

## 👨‍💻 Developers

Degen AI facilitator has 3 different modules in a single mono repository.

-   `server`: Node backend to serve API logics
-   `ui`: React frontend
-   `components`: Third-party nodes integrations
-   `api-documentation`: Auto-generated swagger-ui API docs from express

### Prerequisite

-   Install [PNPM](https://pnpm.io/installation)
    ```bash
    npm i -g pnpm
    ```

### Setup

1.  Clone the repository

    ```bash
    git clone https://github.com/Degen-AI-facilitator/Degen-AI-facilitator.git
    ```

2.  Go into repository folder

    ```bash
    cd Degen-AI-facilitator
    ```

3.  Install all dependencies of all modules:

    ```bash
    pnpm install
    ```

4.  Build all the code:

    ```bash
    pnpm build
    ```

    <details>
    <summary>Exit code 134 (JavaScript heap out of memory)</summary>  
      If you get this error when running the above `build` script, try increasing the Node.js heap size and run the script again:

        export NODE_OPTIONS="--max-old-space-size=4096"
        pnpm build

    </details>

5.  Start the app:

    ```bash
    pnpm start
    ```

    You can now access the app on [http://localhost:3000](http://localhost:3000)

6.  For development build:

    -   Create `.env` file and specify the `VITE_PORT` (refer to `.env.example`) in `packages/ui`
    -   Create `.env` file and specify the `PORT` (refer to `.env.example`) in `packages/server`
    -   Run

        ```bash
        pnpm dev
        ```

    Any code changes will reload the app automatically on [http://localhost:8080](http://localhost:8080)

## 🌱 Env Variables

Degen AI facilitator support different environment variables to configure your instance. You can specify the following variables in the `.env` file inside `packages/server` folder. Read [more](https://github.com/Degen-AI-facilitator/Degen-AI-facilitator/blob/main/CONTRIBUTING.md#-env-variables)

## 📖 Documentation

[Degen AI facilitator Docs](https://docs.degenaifacilitator.site/)