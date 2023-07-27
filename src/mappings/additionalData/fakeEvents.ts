import * as types from "../../types";
import manauallyEnteredData from "./manauallyEnteredData";

const meetupRegistry = {
    "12": {
        "1": [
            "5GQybeixGgm1Fx8UF3nUejwGqk2424MFhjFqrNx7vrkFCrGT",
            "5F4WftsrF1Wqtbm7kK5FRRrvUf4w8syazFJH3Mz5JkdcZqs7",
            "5FLbYHux2SUmo1EB3qtmLMvdicDff4yWDZPgriJU8qqyNWVR",
            "5DHZJg8AvVLRHXo5NuiMTgfL9B2zdzxDK8L51T7wGVn4vs6Z",
            "5HTJ7uvBZgp4VcXsWqMSz5r6C5vCzfodB3oYgJikmbesmGAQ",
            "5DvmvDgG6qRVFuHzuDKYTAJrA4ixwuAp1sfA9gL5uMFZJM3i",
            "5CFxUhwjzNRkZqqr8URxhH7LeaNzcBrw8whSf8W4Wrojodmz",
            "5HH3CxhfFGaV6NWXAAKwF61sQ6cMpJxYeQt85yjDn5fvemJo",
            "5FWaWCwAA3PNKcHKHwfB9xBjXDrbFiAABkQjgYV5fbLEontb",
        ],
        "2": [
            "5Hpv78WkVENDqQQ45HRngRv4bjBvMV4CPicXPMquxnMFeNyb",
            "5FvNKkMDRb8pBsXfxRBphY9ZmkkCNUHWnq5Dpw7hKpvBU1L4",
            "5FeE9tHrPXHMxbM7wJcbZrirJfmQ717J2WEqd94wsz9zrmT1",
            "5Cm38saAbnwrxvnGCp4Pqff5K3rKy4awYQnrdqDeHfvW2ZUM",
            "5ELFUAhU3qNijJeWi9vDHR8Q8GTmdeQ7vCmhwHYBTKLfkiVt",
            "5CwS7GgK2x1fKFGzPmfcvBHUfRJHSfoVJcMwSf4LmkR7XX8h",
            "5G7DMDTPX4gNdFwpapLGwAuKvKtPQVUjDendjy2SL6PWhNdz",
        ],
    },
    "6": {
        "1": [
            "5DHZJg8AvVLRHXo5NuiMTgfL9B2zdzxDK8L51T7wGVn4vs6Z",
            "5ELFUAhU3qNijJeWi9vDHR8Q8GTmdeQ7vCmhwHYBTKLfkiVt",
            "5FEsjyFQ7MxVjea5pvgZYDEu5YaUtLsKb8DCSM7AwuyUPCqP",
            "5E9bTMkC6tJUKBxw7Jz9qQ1t1yVAU2j3ctXbsE7JVccfaK4X",
            "5FexHudZZi6Ufhvf8ntBUPzBusjxu8AtT4pJYPckhnRVsZ5C",
            "5DU9peoMcXafqHa3kp9mJkSrKjaqTaLqZXjwzM39eKY45sPJ",
            "5D2sQdGtZ79RHyGQAL4sWPkC3VFqYmbsmqJpQR2mhaoFWy3o",
            "5DMAWJtPqpTontcQxj14s7unTCLfQwW9bwvHaoGH3jKfoJC6",
            "5DvaoawVJ9BKXsCUVangomTf1jJga2AVFyjZWMNcJU1B8M5x",
        ],
        "2": [
            "5HVq226T1gz9jgPeNK6dkFh9k53wijArsAEVAohzB8uWisTL",
            "5FWAcvMPkJdtN2vM7M6Jf3423G2QCoMvU4bzM6rFof1zC96c",
            "5Gmg2TfNXuQELA4FjLb8PJJ3RtXbysKdKJzVTFQ7Te2NQviW",
            "5Euym6an4htA59JPN5xwuY4FkLrKaw1gGwNjP9RT3TQf9qAT",
            "5FvNKkMDRb8pBsXfxRBphY9ZmkkCNUHWnq5Dpw7hKpvBU1L4",
            "5H649rjVVj41QHPU2bdWpNjcV2RpjSmn3xCNYi7uWDD1Aw5t",
            "5EpsFaXShNPoTxhaY5FcRXXSsRURwevUiRKoTVgqh6rCDPRV",
            "5Hh293GGCyG48Z4UEXbftSfbTnWXepezbfNcdbV2SmBKwCZv",
            "5Cr1Yr22DMEaGzpGExn8XqWZR1rEdyacYC3RRczSFwzRYuox",
            "5HdTV5cMNWVkcmyXd3v5UKZGfocKTGSTMwVktgLsKRvWm2wV",
            "5FeE9tHrPXHMxbM7wJcbZrirJfmQ717J2WEqd94wsz9zrmT1",
        ],
        "3": [
            "5HTJ7uvBZgp4VcXsWqMSz5r6C5vCzfodB3oYgJikmbesmGAQ",
            "5ECkrFJwePB7W9jJUJfQhC8dDqGv1LzxG6Uq5jnXSa72RvF7",
            "5DUB1MTT2kZdPSGfqgHYPsN7UDL9uif7YahrRtiBWdJxg8Fp",
            "5CFxUhwjzNRkZqqr8URxhH7LeaNzcBrw8whSf8W4Wrojodmz",
            "5H6ZTbXGPrs4GCr8oDohGvTS9ZTPJj9zJdXJi3iGfkRHHeR5",
            "5FveVDLErUYS18a3RJn97RnWnmFZy2Pzhj94septSmUbnxiC",
            "5DtJgwUaShsu3HiTPdruEEqVjW9TRrp3T1Fm8rNFkp24G5SN",
            "5DLJKWfs8UfgVPjFGZt9zkZQZh4JPUSog5m8UDGmmcmWeJJg",
            "5EFcgRwv9TgMXT9m5o8dWWpPerZcV3vFVvjRUbwrjyaGrDdg",
        ],
        "4": [
            "5Eq4njEjmDoW6jKtZ6ngZ82RCcJY8zdRQXPzttfpCQ6X4DWr",
            "5F23TQ7ReiDj3fDKra9QwWSy94XAsmF4AKVdBFLmn4bmUYAD",
            "5GxtcLoxZTCF96N6jtA4ekXwhC8UvD4VTRsgpTuKBKrtYhHX",
            "5Cm38saAbnwrxvnGCp4Pqff5K3rKy4awYQnrdqDeHfvW2ZUM",
            "5DCXV8FnccMKo1ivdDpgeZNcHaDfgKHWyqnVveVnRF4H42G4",
            "5DhqKr6SJFUv5JH2BbPeKC2YnfJCrXGrLZMWyXAyEfGRDKXA",
            "5EpsFaXShNPoTxhaY5FcRXXSsRURwevUiRKoTVgqh6rCDPRV",
            "5C8bSYJGD1wM5pCxE5Eh6gK9JiYVpYVUTPy8vGXe6xhjxxts",
            "5DiD5v3HqUqYh5dBkThN2q7REBLtJaBEEdeZiRZdGdF1KjnZ",
        ],
        "5": [
            "5DU2h6JFYia6eAP2x9rXogxE6HTmydPdvE5Bb68DjodpLNS4",
            "5CfTsTMaheXbUF9D59B5zdPPupMZdPwf4r2TD2U6XYKU4ZWM",
            "5GKD7e5H33LekzNiPRqhk8yWU5nPKZqGMnqCzv2X3qW61PHs",
            "5ChnQBUqoXaBVPPkMna18cVy3XVcWF5dWiuwSxyGM4N4JBnW",
            "5FFTQebSixtTJ57CVqG82owjN17E8B73irx7nCADe3rnvKNn",
            "5EHb43jBsvMBp2btFj1NWpuyE1AiyssBQoXPhoAEizzt1YiY",
            "5ChmGHr54eZpbiZQ3ccDqYh2ZsNx5MCpgjZxAcjZGEsiEuaQ",
            "5CyqnsGhEeVGcPoQrjoD7ebVJwB7Gj9zWAGDKX3ojMkzQFsE",
        ],
    },
};

const referenceBlocks = {
    "6": { blockNumber: 808023, timestamp: "1656055524283" },
    "12": { blockNumber: 1048062, timestamp: "1660215384262" },
};

function ss58ToAccountId(api, address) {
    return api.registry.createType("AccountId", address).toHuman();
}

function convertMeetupRegistryAddresses(api, registry) {
    Object.keys(registry).forEach(function (key) {
        registry[key] = registry[key].map(e => ss58ToAccountId(api, e));
    });
}

export function addFakeEvents(api) {
    convertMeetupRegistryAddresses(api, meetupRegistry["6"]);
    convertMeetupRegistryAddresses(api, meetupRegistry["12"]);

    let fakeIndex = 0;

    // fake issued events
    for (const event of manauallyEnteredData) {
        const isFake = ["6", "12"].includes(event.cindex);
        let blockNumber = isFake
            ? referenceBlocks[event.cindex]["blockNumber"]
            : parseInt(event.extrinsicId.split("-")[0]);
        let timestamp = isFake
            ? referenceBlocks[event.cindex]["timestamp"]
            : event.timestamp;
        let issuedEntity = new types.Issued(
            `${blockNumber}-fake${fakeIndex++}`
        );
        issuedEntity.blockHeight = BigInt(blockNumber);
        issuedEntity.timestamp = BigInt(timestamp);
        issuedEntity.arg0 = "u0qj944rhWE";
        issuedEntity.arg1 = event.receiver;
        issuedEntity.arg2 = parseInt(event.amount);
        issuedEntity.save();
    }

    // fake rewardsissued events for cindex 6 and 12
    for (const [cindex, registry] of Object.entries(meetupRegistry)) {
        const { blockNumber, timestamp } = referenceBlocks[cindex];
        const relevantReceivers = manauallyEnteredData
            .filter((e) => e.cindex === cindex)
            .map((e) => e.receiver);
            logger.info(cindex)
            logger.info(registry)
        for (const [meetupIndex, participantList] of Object.entries(registry)) {
            // this meetup was succefully processed on chain
            if (cindex === "6" && meetupIndex === "2") continue;
            let rewardsIssuedEntity = new types.RewardsIssued(
                `${blockNumber}-fake${fakeIndex++}`
            );
            rewardsIssuedEntity.blockHeight = BigInt(blockNumber);
            rewardsIssuedEntity.timestamp = BigInt(timestamp);
            rewardsIssuedEntity.arg0 = "u0qj944rhWE";
            rewardsIssuedEntity.arg1 = meetupIndex;
            rewardsIssuedEntity.arg2 = participantList
                .filter((value) => relevantReceivers.includes(value))
                .length.toString();
            rewardsIssuedEntity.save();
        }
    }
}