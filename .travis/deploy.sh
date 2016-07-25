#!/bin/bash
# Decrypt the private key
openssl aes-256-cbc -K $encrypted_7bc606770d22_key -iv $encrypted_7bc606770d22_iv in o2team_o2team-github-io.enc -out ~\/.ssh/o2team_o2team-github-io -d
# Set the permission of the key
chmod 600 ~/.ssh/o2team_o2team-github-io
# Start SSH agent
eval $(ssh-agent)
# Add the private key to the system
ssh-add ~/.ssh/o2team_o2team-github-io
# Copy SSH config
cp .travis/ssh_config ~/.ssh/config
# Set Git config
git config --global user.name "AOTU Bot"
git config --global user.email o2labs@qq.com
# Clone the repository
git clone git@o2team.github.com:o2team/o2team.github.io.git .deploy_git
# Deploy to GitHub
npm run deploy