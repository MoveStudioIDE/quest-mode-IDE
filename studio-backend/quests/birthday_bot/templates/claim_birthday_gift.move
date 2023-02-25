
    /**
    * Claim birthday gift from `DistributionStore.birthday_gifts`
    * @param account - account signer executing the function
    * @param distribution_address - distribution contract address
    **/
    public entry fun claim_birthday_gift(
        account: &signer,
        distribution_address: address,
    ) acquires DistributionStore {
        // TODO: check that the distribution store exists

        // TODO: check that the `birthday_gift` exists

        // TODO: check that the `birthday_timestamp_seconds` has passed

        // TODO: remove `birthday_gift` from table and transfer `amount` from resource account to initiator
    }
