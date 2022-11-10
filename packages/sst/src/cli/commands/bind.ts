import type { Program } from "../program.js";

export const bind = (program: Program) =>
  program.command(
    "bind <command>",
    "Binds blah",
    (yargs) =>
      yargs.positional("command", {
        type: "string",
        describe: "Command to bind to",
        demandOption: true,
      }),
    async (args) => {
      const { Config } = await import("../../config.js");
      const { spawnSync } = await import("child_process");
      const { useAWSCredentials } = await import("../../credentials.js");

      const env = await Config.env();
      const credentials = await useAWSCredentials();
      const result = spawnSync(args.command, {
        env: {
          ...env,
          AWS_ACCESS_KEY_ID: credentials.accessKeyId,
          AWS_SECRET_ACCESS_KEY: credentials.secretAccessKey,
          AWS_SESSION_TOKEN: credentials.sessionToken,
        },
        stdio: "inherit",
        shell: true,
      });
      process.exitCode = result.status || undefined;
    }
  );
