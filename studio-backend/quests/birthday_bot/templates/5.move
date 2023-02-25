{
    //
    // Entry functions
    //
    /**
    * Initializes birthday gift distribution contract
    * @param account - account signer executing the function
    * @param addresses - list of addresses that can claim their birthday gifts
    * @param amounts  - list of amounts for birthday gifts
    * @param birthday_timestamps - list of birthday timestamps in seconds (only claimable after this timestamp has passed)
    **/
    public entry fun initialize_distribution(
        account: &signer,
        addresses: vector<address>,
        amounts: vector<u64>,
        birthday_timestamps: vector<u64>
    ) {
        // TODO: check `DistributionStore` does not exist

        // TODO: check all lengths of `addresses`, `amounts`, and `birthday_timestamps` are equal

        // TODO: create resource account

        // TODO: register Aptos coin to resource account

        // TODO: loop through the lists and push items to birthday_gifts table

        // TODO: transfer the sum of all items in `amounts` from initiator to resource account

        // TODO: move_to resource `DistributionStore` to account signer
    }
}