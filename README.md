commits-analysis
================

> An analysis of code commits on GitHub over a year.

## Workflow

### 1. Retrieve a list of all of the user's repositories.

>In this section we are retrieving **all** repositories the user has access to, instead of just the public ones from the account. There are simple, unauthentified API calls to retrieve a list of a user's public repositories.

- Generate a token: https://github.com/settings/tokens
- Basic auth access: https://developer.github.com/v3/auth/#basic-authentication
- List your repositories: https://developer.github.com/v3/repos/#list-your-repositories
- Pagination notes: https://developer.github.com/v3/#pagination

Required token authorizations:

- `repo` – Full control
- `read:org` – Read org and team membership

```sh
# First set your basic auth parameters. Those are kept in a global variable to prevent them being committed anywhere.
export GH_AUTH="login:token"

touch data/repositories.json
# Start retrieving as many pages as necessary.
curl -u $GH_AUTH "https://api.github.com/user/repos?per_page=100&page=1" >> data/repositories.json
# When do you stop? When curl only retrieves a couple of bytes, like:
#  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
#                                 Dload  Upload   Total   Spent    Left  Speed
# 100     2  100     2    0     0      2      0  0:00:01 --:--:--  0:00:01     2
# Concatenate the JSON arrays with sed:
sed -i -e 's/\]\[/,/g' data/repositories.json
sed -i -e 's/},\]/}\]/g' data/repositories.json
```

### 2. Retrieve commit activity for each repository

- The API endpoint we use: https://developer.github.com/v3/repos/statistics/#get-the-last-year-of-commit-activity-data

```sh
node retrieve-stats.js
# If the fails are empty, run this again multiple times.
```

The account to retrieve data for and the type of repository to get can be configured within `retrieve-stats.js`:

```js
const USER = 'ThibWeb';
const API_DOMAIN = 'https://api.github.com';

const allRepos = require('./data/repositories.json');
const filteredRepos = _.filter(allRepos, { fork: false, private: false });
```

### 3. Processing

Now we have the data and it's time to do something with it!
