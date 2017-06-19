# Crawler command line

[GHCrawler](https://github.com/Microsoft/ghcrawler.git) is utility for walking GitHub APIs and tracking GitHub events. This command line app allows you to control various aspects of a crawler's behavior. There is some overlap in function with the [Crawler Dashboard](https://github.com/Microsoft/ghcrawler-dashboard.git). This project also has a simple Node client library for talking to a crawler.

# Controlling a crawler

The `cc` utility is in the `bin` directory of this repo. It can be run interactively or as a single command processor. The general format of using the command line is

```
node cc [options] [command]
```

where the available options are:

`-i` -- Run in interactive mode

`-s <url>` -- Control the crawler service running at the given url.  Defaults to http://localhost:3000.  You can also set the CRAWLER_SERVICE_URL environment variable.

`-t` -- The crawler service API token to use. This can also be supplied via the `CRAWLER_SERVICE_AUTH_TOKEN` environment variable. If not defined in either place, the default value of `secret` is used.

The available commands are:

`start [count]` -- Start the crawler processing with count concurrent operations.  If count is not specified, 1 is the default.  On a reasonably fast network a count of 10 to 15 should be sufficient. This also depends on how many tokens you are using.

 `stop` -- Stop crawler processing. The crawler service is left running but it stops pulling requests off the queue.  This is the same as `start 0`.

 `queue <requests...>` -- Queues the given requests for processing. The requests parameter is a list of GitHub "org" and/or "org/repo" names.

`orgs <org orgs...>` -- Set the crawler's to traverse only the GitHub orgs named in the given list.

`config` -- Dumps the crawler service's configuration to the console.

`tokens <spec...>` -- Set the GitHub tokens to be used by the crawler when calling GitHub APIs. The spec value is a list of token specs. Each spec has the form `<token>#<trait>,<trait>...` where the token is the GitHub OAuth or Personal Access token and the comma-separated list of traits identify what permissions the token has. The available traits are: `public`, `admin`, `private`. You can list as many tokens and traits as you like. Note that you can also configure the GitHub tokens the `CRAWLER_GITHUB_TOKENS` environment variable instead **before starting the crawler**. For example, `export CRAWLER_GITHUB_TOKENS="<token1>#public;<token2>#admin"`.

A typical sequence shown in the snippet below configures the crawler with a set of tokens, configures the org filter set and then queues and starts the processing of the org.

```
> node bin/cc
http://localhost:3000> tokens 43984b2344ca575d0f0e097efd97#public 972bbdfe098098fa9ce082309#admin
http://localhost:3000> orgs contoso-d
http://localhost:3000> queue contoso-d
http://localhost:3000> start 5
http://localhost:3000> exit
```

New commands are being added all the time.  Check the help using `node bin/cc -help`.

# API
API doc is coming.

# Contributing

Currently we are adding commands and API as they are needed.  We are very keen on adding things that users find valuable and would happily take pull requests.  Adding a command is quite simple, just cut and paste some existing command and add your logic.  Adding useful API is great too though it may involve adding function to the service (so a bit more work).

This project welcomes contributions and suggestions.  Most contributions require you to agree to a Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us the rights to use your contribution. For details, visit https://cla.microsoft.com.  

When you submit a pull request, a CLA-bot will automatically determine whether you need to provide a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the instructions provided by the bot. You will only need to do this once across all repos using our CLA.  

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
