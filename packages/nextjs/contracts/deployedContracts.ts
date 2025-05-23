/**
 * This file is autogenerated by Scaffold-Stark.
 * You should not edit it manually or your changes might be overwritten.
 */

const deployedContracts = {
  devnet: {
    Counter: {
      address:
        "0xb8ee110dcd9401434a6d9c02c509be3d848f3b6989638531474da6b5532ee5",
      abi: [
        {
          type: "impl",
          name: "CounterImpl",
          interface_name: "contracts::Counter::ICounter",
        },
        {
          type: "struct",
          name: "core::integer::u256",
          members: [
            {
              name: "low",
              type: "core::integer::u128",
            },
            {
              name: "high",
              type: "core::integer::u128",
            },
          ],
        },
        {
          type: "interface",
          name: "contracts::Counter::ICounter",
          items: [
            {
              type: "function",
              name: "decrease",
              inputs: [],
              outputs: [],
              state_mutability: "external",
            },
            {
              type: "function",
              name: "increase",
              inputs: [],
              outputs: [],
              state_mutability: "external",
            },
            {
              type: "function",
              name: "reset_counter",
              inputs: [
                {
                  name: "reset_value",
                  type: "core::integer::u32",
                },
                {
                  name: "reset_balance",
                  type: "core::integer::u256",
                },
              ],
              outputs: [],
              state_mutability: "external",
            },
            {
              type: "function",
              name: "get_counter",
              inputs: [],
              outputs: [
                {
                  type: "core::integer::u32",
                },
              ],
              state_mutability: "view",
            },
            {
              type: "function",
              name: "get_win_number",
              inputs: [],
              outputs: [
                {
                  type: "core::integer::u32",
                },
              ],
              state_mutability: "view",
            },
          ],
        },
        {
          type: "impl",
          name: "OwnableImpl",
          interface_name: "openzeppelin_access::ownable::interface::IOwnable",
        },
        {
          type: "interface",
          name: "openzeppelin_access::ownable::interface::IOwnable",
          items: [
            {
              type: "function",
              name: "owner",
              inputs: [],
              outputs: [
                {
                  type: "core::starknet::contract_address::ContractAddress",
                },
              ],
              state_mutability: "view",
            },
            {
              type: "function",
              name: "transfer_ownership",
              inputs: [
                {
                  name: "new_owner",
                  type: "core::starknet::contract_address::ContractAddress",
                },
              ],
              outputs: [],
              state_mutability: "external",
            },
            {
              type: "function",
              name: "renounce_ownership",
              inputs: [],
              outputs: [],
              state_mutability: "external",
            },
          ],
        },
        {
          type: "enum",
          name: "core::option::Option::<core::starknet::contract_address::ContractAddress>",
          variants: [
            {
              name: "Some",
              type: "core::starknet::contract_address::ContractAddress",
            },
            {
              name: "None",
              type: "()",
            },
          ],
        },
        {
          type: "constructor",
          name: "constructor",
          inputs: [
            {
              name: "owner",
              type: "core::starknet::contract_address::ContractAddress",
            },
            {
              name: "initial_value",
              type: "core::integer::u32",
            },
            {
              name: "token",
              type: "core::option::Option::<core::starknet::contract_address::ContractAddress>",
            },
          ],
        },
        {
          type: "event",
          name: "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferred",
          kind: "struct",
          members: [
            {
              name: "previous_owner",
              type: "core::starknet::contract_address::ContractAddress",
              kind: "key",
            },
            {
              name: "new_owner",
              type: "core::starknet::contract_address::ContractAddress",
              kind: "key",
            },
          ],
        },
        {
          type: "event",
          name: "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferStarted",
          kind: "struct",
          members: [
            {
              name: "previous_owner",
              type: "core::starknet::contract_address::ContractAddress",
              kind: "key",
            },
            {
              name: "new_owner",
              type: "core::starknet::contract_address::ContractAddress",
              kind: "key",
            },
          ],
        },
        {
          type: "event",
          name: "openzeppelin_access::ownable::ownable::OwnableComponent::Event",
          kind: "enum",
          variants: [
            {
              name: "OwnershipTransferred",
              type: "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferred",
              kind: "nested",
            },
            {
              name: "OwnershipTransferStarted",
              type: "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferStarted",
              kind: "nested",
            },
          ],
        },
        {
          type: "event",
          name: "contracts::Counter::Counter::Increased",
          kind: "struct",
          members: [
            {
              name: "setter",
              type: "core::starknet::contract_address::ContractAddress",
              kind: "key",
            },
            {
              name: "value",
              type: "core::integer::u32",
              kind: "data",
            },
          ],
        },
        {
          type: "event",
          name: "contracts::Counter::Counter::Decreased",
          kind: "struct",
          members: [
            {
              name: "setter",
              type: "core::starknet::contract_address::ContractAddress",
              kind: "key",
            },
            {
              name: "value",
              type: "core::integer::u32",
              kind: "data",
            },
          ],
        },
        {
          type: "event",
          name: "contracts::Counter::Counter::Event",
          kind: "enum",
          variants: [
            {
              name: "OwnableEvent",
              type: "openzeppelin_access::ownable::ownable::OwnableComponent::Event",
              kind: "flat",
            },
            {
              name: "Increased",
              type: "contracts::Counter::Counter::Increased",
              kind: "nested",
            },
            {
              name: "Decreased",
              type: "contracts::Counter::Counter::Decreased",
              kind: "nested",
            },
          ],
        },
      ],
      classHash:
        "0x21be6b235301c7eb25485cb1bbf6546fb538f518c2efd5d71da48011c9dfc23",
    },
  },
  sepolia: {
    Counter: {
      address:
        "0x1090e8e8f667ecf2ef63528f16920e84c247d078875b74093281066c75b8135",
      abi: [
        {
          type: "impl",
          name: "CounterImpl",
          interface_name: "contracts::Counter::ICounter",
        },
        {
          type: "struct",
          name: "core::integer::u256",
          members: [
            {
              name: "low",
              type: "core::integer::u128",
            },
            {
              name: "high",
              type: "core::integer::u128",
            },
          ],
        },
        {
          type: "interface",
          name: "contracts::Counter::ICounter",
          items: [
            {
              type: "function",
              name: "decrease",
              inputs: [],
              outputs: [],
              state_mutability: "external",
            },
            {
              type: "function",
              name: "increase",
              inputs: [],
              outputs: [],
              state_mutability: "external",
            },
            {
              type: "function",
              name: "reset_counter",
              inputs: [
                {
                  name: "reset_value",
                  type: "core::integer::u32",
                },
                {
                  name: "reset_balance",
                  type: "core::integer::u256",
                },
              ],
              outputs: [],
              state_mutability: "external",
            },
            {
              type: "function",
              name: "get_counter",
              inputs: [],
              outputs: [
                {
                  type: "core::integer::u32",
                },
              ],
              state_mutability: "view",
            },
            {
              type: "function",
              name: "get_win_number",
              inputs: [],
              outputs: [
                {
                  type: "core::integer::u32",
                },
              ],
              state_mutability: "view",
            },
          ],
        },
        {
          type: "impl",
          name: "OwnableImpl",
          interface_name: "openzeppelin_access::ownable::interface::IOwnable",
        },
        {
          type: "interface",
          name: "openzeppelin_access::ownable::interface::IOwnable",
          items: [
            {
              type: "function",
              name: "owner",
              inputs: [],
              outputs: [
                {
                  type: "core::starknet::contract_address::ContractAddress",
                },
              ],
              state_mutability: "view",
            },
            {
              type: "function",
              name: "transfer_ownership",
              inputs: [
                {
                  name: "new_owner",
                  type: "core::starknet::contract_address::ContractAddress",
                },
              ],
              outputs: [],
              state_mutability: "external",
            },
            {
              type: "function",
              name: "renounce_ownership",
              inputs: [],
              outputs: [],
              state_mutability: "external",
            },
          ],
        },
        {
          type: "enum",
          name: "core::option::Option::<core::starknet::contract_address::ContractAddress>",
          variants: [
            {
              name: "Some",
              type: "core::starknet::contract_address::ContractAddress",
            },
            {
              name: "None",
              type: "()",
            },
          ],
        },
        {
          type: "constructor",
          name: "constructor",
          inputs: [
            {
              name: "owner",
              type: "core::starknet::contract_address::ContractAddress",
            },
            {
              name: "initial_value",
              type: "core::integer::u32",
            },
            {
              name: "token",
              type: "core::option::Option::<core::starknet::contract_address::ContractAddress>",
            },
          ],
        },
        {
          type: "event",
          name: "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferred",
          kind: "struct",
          members: [
            {
              name: "previous_owner",
              type: "core::starknet::contract_address::ContractAddress",
              kind: "key",
            },
            {
              name: "new_owner",
              type: "core::starknet::contract_address::ContractAddress",
              kind: "key",
            },
          ],
        },
        {
          type: "event",
          name: "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferStarted",
          kind: "struct",
          members: [
            {
              name: "previous_owner",
              type: "core::starknet::contract_address::ContractAddress",
              kind: "key",
            },
            {
              name: "new_owner",
              type: "core::starknet::contract_address::ContractAddress",
              kind: "key",
            },
          ],
        },
        {
          type: "event",
          name: "openzeppelin_access::ownable::ownable::OwnableComponent::Event",
          kind: "enum",
          variants: [
            {
              name: "OwnershipTransferred",
              type: "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferred",
              kind: "nested",
            },
            {
              name: "OwnershipTransferStarted",
              type: "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferStarted",
              kind: "nested",
            },
          ],
        },
        {
          type: "event",
          name: "contracts::Counter::Counter::Increased",
          kind: "struct",
          members: [
            {
              name: "setter",
              type: "core::starknet::contract_address::ContractAddress",
              kind: "key",
            },
            {
              name: "value",
              type: "core::integer::u32",
              kind: "data",
            },
          ],
        },
        {
          type: "event",
          name: "contracts::Counter::Counter::Decreased",
          kind: "struct",
          members: [
            {
              name: "setter",
              type: "core::starknet::contract_address::ContractAddress",
              kind: "key",
            },
            {
              name: "value",
              type: "core::integer::u32",
              kind: "data",
            },
          ],
        },
        {
          type: "event",
          name: "contracts::Counter::Counter::Event",
          kind: "enum",
          variants: [
            {
              name: "OwnableEvent",
              type: "openzeppelin_access::ownable::ownable::OwnableComponent::Event",
              kind: "flat",
            },
            {
              name: "Increased",
              type: "contracts::Counter::Counter::Increased",
              kind: "nested",
            },
            {
              name: "Decreased",
              type: "contracts::Counter::Counter::Decreased",
              kind: "nested",
            },
          ],
        },
      ],
      classHash:
        "0x158e7de2c28078c716361234a87e7e1681d7fe2825e745a027435fb819f82ea",
    },
  },
} as const;

export default deployedContracts;
