const LEVELS_CONFIG = {
    // Level 0: Unactivated / New User
    // This level defines the initial state for a new user.
    0: {
        // Amount a new user at Level 0 pays to their direct referrer upon activation.
        // This is the initial donation to the direct referrer.
        donation_to_referrer: 300,
        // Cost for a user at Level 0 to upgrade to Level 1.
        upgrade_cost: 500,
        // Indicates which level of upline receives the 'upgrade_cost' for this level.
        // For Level 0 upgrading to Level 1, the payment goes to the 1st level upline (direct referrer).
        upgrade_recipient_level_upline: 1,
    },

    // Level 1: Initial activation
    // Defines requirements and earnings for a user at Level 1.
    1: {
        // Amount each Level 0 member (who is in your downline) donates to you when they activate.
        donation_from_downline: 300,
        // Cost to upgrade from Level 1 to Level 2.
        upgrade_cost: 1000,
        // Requirements for your downline members to be eligible for this level's benefits or upgrade.
        required_downline_at_level: {
            // The minimum level your direct referrals (or specified downline members) must be at.
            level: 0,
            // The number of direct referrals (or specified downline members) who must meet the 'level' requirement.
            // For Level 1, this means at least 2 of your direct referrals must be at Level 0 (activated).
            count: 2
        },
        // Indicates which level of upline receives the 'upgrade_cost' for this level.
        // For Level 1 upgrading to Level 2, the payment goes to the 2nd level upline (referrer's referrer).
        upgrade_recipient_level_upline: 2,
    },

    // Level 2: Upgrade from Level 1
    // Defines requirements and earnings for a user at Level 2.
    2: {
        // Amount each Level 1 member (who is in your downline) donates to you when they upgrade.
        donation_from_downline: 500,
        // Cost to upgrade from Level 2 to Level 3.
        upgrade_cost: 2000,
        // Requirements for your downline members to be eligible for this level's benefits or upgrade.
        required_downline_at_level: {
            // The minimum level your downline members must be at.
            level: 1,
            // The number of downline members who must meet the 'level' requirement.
            // For Level 2, this means at least 4 members in your downline must have upgraded to Level 1.
            count: 4
        },
        // Indicates which level of upline receives the 'upgrade_cost' for this level.
        // For Level 2 upgrading to Level 3, the payment goes to the 3rd level upline.
        upgrade_recipient_level_upline: 3,
    },

    // Level 3: Upgrade from Level 2
    // Defines requirements and earnings for a user at Level 3.
    3: {
        // Amount each Level 2 member (who is in your downline) donates to you when they upgrade.
        donation_from_downline: 1000,
        // Cost to upgrade from Level 3 to Level 4.
        upgrade_cost: 4000,
        // Requirements for your downline members to be eligible for this level's benefits or upgrade.
        required_downline_at_level: {
            // The minimum level your downline members must be at.
            level: 2,
            // The number of downline members who must meet the 'level' requirement.
            // For Level 3, this means at least 8 members in your downline must have upgraded to Level 2.
            count: 8
        },
        // Indicates which level of upline receives the 'upgrade_cost' for this level.
        // For Level 3 upgrading to Level 4, the payment goes to the 4th level upline.
        upgrade_recipient_level_upline: 4,
    },

    // Level 4: Upgrade from Level 3
    // Defines requirements and earnings for a user at Level 4.
    4: {
        // Amount each Level 3 member (who is in your downline) donates to you when they upgrade.
        donation_from_downline: 2000,
        // Cost to upgrade from Level 4 to Level 5.
        upgrade_cost: 8000,
        // Requirements for your downline members to be eligible for this level's benefits or upgrade.
        required_downline_at_level: {
            // The minimum level your downline members must be at.
            level: 3,
            // The number of downline members who must meet the 'level' requirement.
            // For Level 4, this means at least 16 members in your downline must have upgraded to Level 3.
            count: 16
        },
        // Indicates which level of upline receives the 'upgrade_cost' for this level.
        // For Level 4 upgrading to Level 5, the payment goes to the 5th level upline.
        upgrade_recipient_level_upline: 5,
    },

    // Level 5: Upgrade from Level 4
    // Defines requirements and earnings for a user at Level 5.
    5: {
        // Amount each Level 4 member (who is in your downline) donates to you when they upgrade.
        donation_from_downline: 4000,
        // Cost to upgrade from Level 5 to Level 6.
        upgrade_cost: 16000,
        // Requirements for your downline members to be eligible for this level's benefits or upgrade.
        required_downline_at_level: {
            // The minimum level your downline members must be at.
            level: 4,
            // The number of downline members who must meet the 'level' requirement.
            // For Level 5, this means at least 32 members in your downline must have upgraded to Level 4.
            count: 32
        },
        // Indicates which level of upline receives the 'upgrade_cost' for this level.
        // For Level 5 upgrading to Level 6, the payment goes to the 6th level upline.
        upgrade_recipient_level_upline: 6,
    },

    // Level 6: Upgrade from Level 5
    // Defines requirements and earnings for a user at Level 6.
    6: {
        // Amount each Level 5 member (who is in your downline) donates to you when they upgrade.
        donation_from_downline: 8000,
        // Cost to upgrade from Level 6 to Level 7.
        upgrade_cost: 32000,
        // Requirements for your downline members to be eligible for this level's benefits or upgrade.
        required_downline_at_level: {
            // The minimum level your downline members must be at.
            level: 5,
            // The number of downline members who must meet the 'level' requirement.
            // For Level 6, this means at least 64 members in your downline must have upgraded to Level 5.
            count: 64
        },
        // Indicates which level of upline receives the 'upgrade_cost' for this level.
        // For Level 6 upgrading to Level 7, the payment goes to the 7th level upline.
        upgrade_recipient_level_upline: 7,
    },

    // Level 7: Upgrade from Level 6
    // Defines requirements and earnings for a user at Level 7.
    7: {
        // Amount each Level 6 member (who is in your downline) donates to you when they upgrade.
        donation_from_downline: 16000,
        // Cost to upgrade from Level 7 to Level 8.
        upgrade_cost: 64000,
        // Requirements for your downline members to be eligible for this level's benefits or upgrade.
        required_downline_at_level: {
            // The minimum level your downline members must be at.
            level: 6,
            // The number of downline members who must meet the 'level' requirement.
            // For Level 7, this means at least 128 members in your downline must have upgraded to Level 6.
            count: 128
        },
        // Indicates which level of upline receives the 'upgrade_cost' for this level.
        // For Level 7 upgrading to Level 8, the payment goes to the 8th level upline.
        upgrade_recipient_level_upline: 8,
    },

    // Level 8: Upgrade from Level 7
    // Defines requirements and earnings for a user at Level 8.
    8: {
        // Amount each Level 7 member (who is in your downline) donates to you when they upgrade.
        donation_from_downline: 32000,
        // Cost to upgrade from Level 8 to Level 9.
        upgrade_cost: 128000,
        // Requirements for your downline members to be eligible for this level's benefits or upgrade.
        required_downline_at_level: {
            // The minimum level your downline members must be at.
            level: 7,
            // The number of downline members who must meet the 'level' requirement.
            // For Level 8, this means at least 256 members in your downline must have upgraded to Level 7.
            count: 256
        },
        // Indicates which level of upline receives the 'upgrade_cost' for this level.
        // For Level 8 upgrading to Level 9, the payment goes to the 9th level upline.
        upgrade_recipient_level_upline: 9,
    },

    // Level 9: Upgrade from Level 8
    // Defines requirements and earnings for a user at Level 9.
    9: {
        // Amount each Level 8 member (who is in your downline) donates to you when they upgrade.
        donation_from_downline: 64000,
        // Cost to upgrade from Level 9 to Level 10.
        upgrade_cost: 256000,
        // Requirements for your downline members to be eligible for this level's benefits or upgrade.
        required_downline_at_level: {
            // The minimum level your downline members must be at.
            level: 8,
            // The number of downline members who must meet the 'level' requirement.
            // For Level 9, this means at least 512 members in your downline must have upgraded to Level 8.
            count: 512
        },
        // Indicates which level of upline receives the 'upgrade_cost' for this level.
        // For Level 9 upgrading to Level 10, the payment goes to the 10th level upline.
        upgrade_recipient_level_upline: 10,
    },

    // Level 10: Upgrade from Level 9
    // Defines requirements and earnings for a user at Level 10.
    10: {
        // Amount each Level 9 member (who is in your downline) donates to you when they upgrade.
        donation_from_downline: 128000,
        // Cost to upgrade from Level 10 to Level 11.
        upgrade_cost: 512000,
        // Requirements for your downline members to be eligible for this level's benefits or upgrade.
        required_downline_at_level: {
            // The minimum level your downline members must be at.
            level: 9,
            // The number of downline members who must meet the 'level' requirement.
            // For Level 10, this means at least 1024 members in your downline must have upgraded to Level 9.
            count: 1024
        },
        // Indicates which level of upline receives the 'upgrade_cost' for this level.
        // For Level 10 upgrading to Level 11, the payment goes to the 11th level upline.
        upgrade_recipient_level_upline: 11,
    },

    // Level 11: Upgrade from Level 10 (Final Level)
    // Defines requirements and earnings for a user at Level 11.
    11: {
        // Amount each Level 10 member (who is in your downline) donates to you when they upgrade.
        donation_from_downline: 256000,
        // Cost to upgrade from Level 11 (this is the final level, so no further upgrade cost).
        // This could be set to 0 or removed if there are no further levels.
        upgrade_cost: 1024000, // Keeping the cost for consistency, but it's the final level.
        // Requirements for your downline members to be eligible for this level's benefits.
        required_downline_at_level: {
            // The minimum level your downline members must be at.
            level: 10,
            // The number of downline members who must meet the 'level' requirement.
            // For Level 11, this means at least 2048 members in your downline must have upgraded to Level 10.
            count: 2048
        },
        // For the final level, there is no further upgrade, so this field might not be strictly necessary
        // or could be set to a value indicating no further recipient (e.g., null, 0, or omitted).
        // For consistency with the pattern, it's set to 12, implying a theoretical next upline level.
        upgrade_recipient_level_upline: 12,
    },
};

module.exports = LEVELS_CONFIG;
