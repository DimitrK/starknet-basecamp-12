#[starknet::interface]
pub trait ICounter<TContractState> {
    fn increase(ref self: TContractState);
    fn decrease(ref self: TContractState);
    fn get_counter(self: @TContractState) -> u32;
}

#[starknet::contract]
pub mod Counter {
    use openzeppelin_access::ownable::OwnableComponent;
    use starknet::storage::{StoragePointerReadAccess, StoragePointerWriteAccess};
    use starknet::{ContractAddress, get_caller_address};
    use super::ICounter;

    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);

    #[abi(embed_v0)]
    impl OwnableImpl = OwnableComponent::OwnableImpl<ContractState>;
    impl OwnableInternalImpl = OwnableComponent::InternalImpl<ContractState>;

    pub const STRK_CONTRACT_ADDRESS: felt252 =
        0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d;

    #[event]
    #[derive(Drop, starknet::Event)]
    pub enum Event {
        #[flat]
        OwnableEvent: OwnableComponent::Event,
        Increased: Increased,
        Decreased: Decreased,
    }

    #[derive(Drop, starknet::Event)]
    pub struct Increased {
        #[key]
        pub setter: ContractAddress,
        pub value: u32,
    }

    #[derive(Drop, starknet::Event)]
    pub struct Decreased {
        #[key]
        pub setter: ContractAddress,
        pub value: u32,
    }

    #[storage]
    struct Storage {
        counter: u32,
        #[substorage(v0)]
        ownable: OwnableComponent::Storage,
    }

    #[constructor]
    fn constructor(ref self: ContractState, owner: ContractAddress, initial_value: u32) {
        self.counter.write(initial_value);
        self.ownable.initializer(owner);
    }

    #[abi(embed_v0)]
    impl CounterImpl of ICounter<ContractState> {
        fn increase(ref self: ContractState) {
            self.counter.write(self.counter.read() + 1);
            self.emit(Increased { setter: get_caller_address(), value: self.counter.read() });
        }

        fn decrease(ref self: ContractState) {
            assert(self.counter.read() > 0, 'Counter is zero');
            self.counter.write(self.counter.read() - 1);
            self.emit(Decreased { setter: get_caller_address(), value: self.counter.read() });
        }

        fn get_counter(self: @ContractState) -> u32 {
            return self.counter.read();
        }
    }
}
