# Security Considerations

The FilesPoE contract does not have any payable functions.
This minimizes the number of security vulnerabilities.

There are also very few conditional statements, so the possibility for users to lock or render the contract unusable is also minimized.

Since function executions cost money in Ethereum the risk for denial of service attacks are minimal.

The primary risks of application is for user to upload or view images they should have access to.
This is mitigated by putting various circuit breakers to disable users' ability to add or get images.

In addition the contract has a method to 'selfdestruct' File contracts, and to 'selfdestruct' the FilesPoE contract itself.

It should be noted that only the contract owner has the privileges to call the functions that toggle the circuit breakers or that destroy the contracts.
