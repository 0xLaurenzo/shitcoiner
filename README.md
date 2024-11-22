# shitcoiner terminal
Shitcoiner terminal aids people in creating, distributing and taking common actions for managing their tokens.

## creating a token
Creating a token is intended to be a simple as possible for a creator. The creator has to give the total supply, the subdenom and whether or not to remove the admin. By default the tokens are minted to the connected wallet

## managing a token
To properly manually manage a token, this app supports:
- burning
- minting
- sending (in case of pending wallet registrations)
- pool creation
- Adding CL position (in case Osmosis FE does not show the pool)

## distributing a token
This section is still in a todo state. The goal is to support airdropping a certain amount of tokens to users. The airdrop should either be given as a spreadsheet or entered user by user. This can then be distributed through a MultiSend Msg