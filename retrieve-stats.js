const fs = require('fs');
const _ = require('lodash');
const got = require('got');

const USER = 'ThibWeb';
const API_DOMAIN = 'https://api.github.com';

const allRepos = require('./data/repositories.json');
const filteredRepos = _.filter(allRepos, { fork: false, private: false });

const getReposOf = username => _.filter(filteredRepos, { owner: { login: username } });

const ownRepos = getReposOf(USER);

const createURL = repo => `${API_DOMAIN}/repos/${USER}/${repo.name}/stats/commit_activity`;
const createFilename = repo => `${USER}-${repo.name}-commit_activity.json`;
const createFilepath = repo => `./data/commit-activity/${createFilename(repo)}`;

const gotOptions = {
    auth: process.env.GH_AUTH,
    retries: 20,
};

ownRepos.forEach((repo) => {
    got.stream(createURL(repo), gotOptions)
        .on('error', err => console.log(err, repo.name))
        .pipe(fs.createWriteStream(createFilepath(repo)));
});
