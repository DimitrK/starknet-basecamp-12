#[starknet::interface]
pub trait ICounter<TContractState> {
    fn decrease(ref self: TContractState);
    fn increase(ref self: TContractState);
    fn reset_counter(ref self: TContractState, reset_value: u32, reset_balance: u256);
    fn get_counter(self: @TContractState) -> u32;
    fn get_win_number(self: @TContractState) -> u32;
}

#[starknet::contract]
pub mod Counter {
    use openzeppelin_access::ownable::OwnableComponent;
    use openzeppelin_token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};
    use starknet::storage::{StoragePointerReadAccess, StoragePointerWriteAccess};
    use starknet::{ContractAddress, get_caller_address, get_contract_address};
    use super::ICounter;

    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);

    #[abi(embed_v0)]
    impl OwnableImpl = OwnableComponent::OwnableImpl<ContractState>;
    impl OwnableInternalImpl = OwnableComponent::InternalImpl<ContractState>;

    pub const WIN_NUMBER: u32 = 10;
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
        token: IERC20Dispatcher,
        counter: u32,
        #[substorage(v0)]
        ownable: OwnableComponent::Storage,
    }

    pub mod Errors {
        pub const INITIAL_WIN_VALUES_EQUAL: felt252 = 'Initial value is equal to win';
        pub const INITIAL_HIGHER_THAN_WIN: felt252 = 'Initial value too high';
        pub const COUNTER_IS_ZERO: felt252 = 'Counter is zero';
        pub const RESET_GAME_IN_PROGRESS: felt252 = 'Game in progress. Cannot reset';
    }

    #[generate_trait]
    impl InternalValidations of InternalValidationsrait {
        fn _validate_initial_value(ref self: ContractState, initial_value: u32) {
            assert(initial_value != WIN_NUMBER, Errors::INITIAL_WIN_VALUES_EQUAL);
            assert(initial_value < WIN_NUMBER, Errors::INITIAL_HIGHER_THAN_WIN);
        }

        fn _change_counter__payable(ref self: ContractState, next_value: u32) {
            self.counter.write(next_value);
            if next_value == WIN_NUMBER {
                let caller = get_caller_address();
                let token_dispatcher = self.token.read();
                let counter_balance = token_dispatcher.balance_of(get_contract_address());
                if (counter_balance > 0) {
                    token_dispatcher.transfer(caller, counter_balance);
                }
            }
        }
    }

    #[constructor]
    fn constructor(
        ref self: ContractState,
        owner: ContractAddress,
        initial_value: u32,
        token: Option<ContractAddress>,
    ) {
        self._validate_initial_value(initial_value);
        self.counter.write(initial_value);
        self.ownable.initializer(owner);
        match token {
            Option::Some(token_address) => {
                self.token.write(IERC20Dispatcher { contract_address: token_address });
            },
            Option::None => {
                self
                    .token
                    .write(
                        IERC20Dispatcher {
                            contract_address: STRK_CONTRACT_ADDRESS.try_into().unwrap(),
                        },
                    );
            },
        }
    }

    #[abi(embed_v0)]
    impl CounterImpl of ICounter<ContractState> {
        fn increase(ref self: ContractState) {
            let next_value = self.counter.read() + 1;
            self._change_counter__payable(next_value);
            self.emit(Increased { setter: get_caller_address(), value: self.counter.read() });
        }

        fn decrease(ref self: ContractState) {
            assert(self.counter.read() > 0, Errors::COUNTER_IS_ZERO);
            let next_value = self.counter.read() - 1;
            self._change_counter__payable(next_value);
            self.emit(Decreased { setter: get_caller_address(), value: self.counter.read() });
        }

        fn get_counter(self: @ContractState) -> u32 {
            return self.counter.read();
        }

        fn reset_counter(ref self: ContractState, reset_value: u32, reset_balance: u256) {
            self.ownable.assert_only_owner();
            self._validate_initial_value(reset_value);

            let token_dispatcher = self.token.read();
            let counter_balance = token_dispatcher.balance_of(get_contract_address());

            assert(counter_balance == 0, Errors::RESET_GAME_IN_PROGRESS);

            if reset_balance > 0 {
                token_dispatcher
                    .transfer_from(get_caller_address(), get_contract_address(), reset_balance);
                self.emit(Decreased { setter: get_caller_address(), value: 0 });
            }

            self.counter.write(reset_value);
        }

        fn get_win_number(self: @ContractState) -> u32 {
            WIN_NUMBER
        }
    }
}
