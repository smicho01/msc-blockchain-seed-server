# Sev-Blockchain (SBC) Seed Server

Seed server store list of SBC (Sev BlockChain) nodes. SBC nodes communicate via web sockets (ws),  Seed Server store ws addresses for all registered SBC nodes. SBC node at startup connects with randomly selected Seed Server and register itself with it.

At least one working seed servers should be hardcoded in SBC to allow discovery of other nodes. This can be later changed by for example config on private GitHub repository.

All Seed Servers should register between each other and update `SEED_SERVERS` array for given profile.

SBC Nodes will register automatically with selected seed server. Seed server should broadcast newly registered node to all other seed seervers registered with him. All seed servers should have the same list of active SBC nodes. 

## Hardcoded Seed Servers

Seed servers are hardcoded to start the project. They can be found in `config.js` file under spefific `profiles`.

## Running locally

Add PROFILE=dev as param when calling run dev command. Also assing different ports for each instance, with param HTTP_PORT like below

Node 1:
`PROFILE=dev npm run dev`

Node 2: 
`PROFILE=dev HTTP_PORT=3040 npm run dev`

