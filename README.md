## Zeet for Github Actions

> If you're looking to deploy or run a command on your project in Actions, check out [zeet-co/zeet-deploy-action](https://github.com/zeet-co/zeet-deploy-action)
> and [zeet-co/zeet-run-action](https://github.com/zeet-co/zeet-run-action), which are built on this Action.

This action downloads the [Zeet CLI](https://github.com/zeet-dev/cli) into a workflow.

### Usage
First, create a Zeet API Key by going to https://zeet.co/account/api, or to [Dashboard](https://zeet.co/dashboard) > Team Settings > API Keys > New API Key.
Then create a Github Secret containing the key, we use `ZEET_TOKEN` in the examples below.

Call the Action by putting the following code in your Workflow's `steps` array:

```yaml
      - name: Install Zeet CLI
        uses: zeet-dev/action-zeet@main
        with:
          token: ${{ secrets.ZEET_TOKEN }}
          # if you're not using the default Zeet API
          # api_url: https://anchor.zeet.co
```

You can then access the CLI in any steps after that. For example, to deploy a project:

```yaml
      - name: Deploy project
        run: zeet deploy zeet-demo/zeet-demo-node-sample
```

For more info on what you can do with the CLI, check out the [repository](https://github.com/zeet-dev/cli) and [docs](https://docs.zeet.co/cli).