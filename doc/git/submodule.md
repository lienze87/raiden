## submodule

1. git submodule add --force --name "template" -b dev -- http://example/example.git "src/\_common"
2. git submodule set-branch -b dev 'template'
3. git submodule sync
4. git submodule update --init --recursive --remote
