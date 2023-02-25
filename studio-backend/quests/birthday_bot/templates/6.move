{
    /**
    * Add birthday gift to `DistributionStore.birthday_gifts`
    * @param account - account signer executing the function
    * @param address - address that can claim the birthday gift
    * @param amount  - amount for the birthday gift
    * @param birthday_timestamp_seconds - birthday timestamp in seconds (only claimable after this timestamp has passed)
    **/
    public entry fun add_birthday_gift(
        account: &signer,
        address: address,
        amount: u64,
        birthday_timestamp_seconds: u64
    ) acquires DistributionStore {
        // TODO: check that the distribution store exists

        // TODO: set new birthday gift to new `amount` and `birthday_timestamp_seconds` (birthday_gift already exists, sum `amounts` and override the `birthday_timestamp_seconds`

        // TODO: transfer the `amount` from initiator to resource account
    }
}