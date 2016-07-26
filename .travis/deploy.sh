#!/bin/bash
# Decrypt the private key
openssl aes-256-cbc -K $encrypted_7bc606770d22_key -iv $encrypted_7bc606770d22_iv -in o2-site.enc -out ~\/.ssh/o2-site -d
# Set the permission of the key
chmod 600 ~/.ssh/o2-site
# Start SSH agent
eval $(ssh-agent)
# Add the private key to the system
ssh-add ~/.ssh/o2-site
# Copy SSH config
cp .travis/ssh_config ~/.ssh/config
# Set Git config
git config --global user.name "AOTU Bot"
git config --global user.email o2labs@qq.com
# Clone the repository
git clone git@o2-site.github.com:o2team/o2team.github.io.git .deploy_git
# Deploy to GitHub
npm run deploy