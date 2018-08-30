# Design Considerations

Most of the design decision are explained in the '\* @notice' comments of FilesPoE.sol

The proof of existence contract is used to track files uploaded by users and to ensure no duplicate files are uploaded.
The FilesPoE use a factory pattern to create instances of File contract that store the files information.
It store the address of the file contracts created in a mapping. It uses another mapping to store arrays of file address associated to specific users.

The application triggers event emmissions to log various actions. It also makes use of modifiers to authorize function executions and enable and disable user abilities in case of emergency.
