const _ = require('lodash');

const USER = 'ThibWeb';

const allRepos = require('./data/repositories.json');
const filteredRepos = _.filter(allRepos, { fork: false, private: false });

const getReposOf = username => _.filter(filteredRepos, { owner: { login: username } });

const ownRepos = getReposOf(USER);

const createFilename = repo => `${USER}-${repo.name}-commit_activity.json`;
const createFilepath = repo => `./data/commit-activity/${createFilename(repo)}`;

ownRepos.forEach((repo) => {
    const commitActivity = require(createFilepath(repo));

    repo.commitActivity = commitActivity;
    repo.totalActivity = commitActivity.reduce((sum, week) => sum + week.total, 0);
});

const totalActivity = ownRepos.reduce((sum, repo) => sum + repo.totalActivity, 0);

console.log('total', totalActivity);
