use contracts::Counter::{
    Counter, ICounterDispatcher, ICounterDispatcherTrait, ICounterSafeDispatcher,
    ICounterSafeDispatcherTrait,
};
use openzeppelin_access::ownable::interface::{IOwnableDispatcher, IOwnableDispatcherTrait};
use openzeppelin_token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};
use openzeppelin_utils::serde::SerializedAppend;
use snforge_std::EventSpyAssertionsTrait;
use snforge_std::{
    ContractClassTrait, DeclareResultTrait, declare, spy_events, start_cheat_caller_address,
    stop_cheat_caller_address,
};
use starknet::{ContractAddress, contract_address_const};

const ZERO: u32 = 0;
const OWNER: felt252 = 0x02dA5254690b46B9C4059C25366D1778839BE63C142d899F0306fd5c312A5918;


fn USER() -> ContractAddress {
    return 'USER'.try_into().unwrap();
}


fn __deploy__(
    name: ByteArray, init_value: u32, token: Option<ContractAddress>,
) -> (ICounterDispatcher, IOwnableDispatcher) {
    // declare
    let contract_class = declare(name).unwrap().contract_class();
    //let contract_class = declare(name).expect('failed to declare').contract_class();

    // serialize contructor
    let mut calldata: Array<felt252> = array![];
    // let owner: ContractAddress = contract_address_const::<OWNER>();
    // owner.serialize(ref calldata);
    // init_value.serialize(ref calldata);
    calldata.append_serde(OWNER);
    calldata.append(init_value.into());
    calldata.append_serde(token);

    let (contract_address, _) = contract_class.deploy(@calldata).expect('failed to deploy');

    let counter = ICounterDispatcher { contract_address };
    let ownable = IOwnableDispatcher { contract_address };

    return (counter, ownable);
}


fn deploy_token() -> IERC20Dispatcher {
    // define ERC20 data
    let token = declare("ERC20Upgradeable").unwrap().contract_class();

    let token_name: ByteArray = "Stark Token";
    let token_symbol: ByteArray = "STRK";
    let token_supply: u256 = 100000;
    let token_owner = contract_address_const::<'token_owner'>();
    let token_recipient = token_owner;

    let mut token_constructor_calldata = array![];
    ((token_name, token_symbol, token_supply, token_recipient), token_owner)
        .serialize(ref token_constructor_calldata);
    let (token_address, _) = token.deploy(@token_constructor_calldata).unwrap();

    start_cheat_caller_address(token_address, token_owner);
    let token_dispatcher = IERC20Dispatcher { contract_address: token_address };
    token_dispatcher.transfer(USER(), 10000);
    token_dispatcher.transfer(OWNER.try_into().unwrap(), 10000);
    stop_cheat_caller_address(token_address);

    return token_dispatcher;
}

#[test]
fn test_coutner_deployment() {
    let (counter, ownable) = __deploy__("Counter", ZERO, Option::None);
    let count = counter.get_counter();
    let owner = ownable.owner();

    assert(count == ZERO, 'Should have initial value');
    assert(owner == OWNER.try_into().unwrap(), 'Should be the right owner');
}

#[test]
fn test_counter_increase() {
    let (counter, _) = __deploy__("Counter", ZERO, Option::None);
    let initial_counter = counter.get_counter();
    counter.increase();
    assert(counter.get_counter() == initial_counter + 1, 'Should increase by one');
}

#[test]
fn test_increase_emitted_event() {
    let (counter, _) = __deploy__("Counter", ZERO, Option::None);
    let mut spy = spy_events();
    start_cheat_caller_address(counter.contract_address, USER());
    counter.increase();
    stop_cheat_caller_address(counter.contract_address);
    spy
        .assert_emitted(
            @array![
                (
                    counter.contract_address,
                    Counter::Event::Increased(
                        Counter::Increased { setter: USER(), value: counter.get_counter() },
                    ),
                ),
            ],
        )
}

#[test]
fn test_counter_decrease() {
    let (counter, _) = __deploy__("Counter", 1, Option::None);
    let initial_counter = counter.get_counter();
    assert(initial_counter == 1, 'Should equal one');
    counter.decrease();
    assert(counter.get_counter() == initial_counter - 1, 'Should decrease by one');
}


#[test]
fn test_decrease_emitted_event() {
    let (counter, _) = __deploy__("Counter", 1, Option::None);
    let mut spy = spy_events();
    start_cheat_caller_address(counter.contract_address, USER());
    counter.decrease();
    stop_cheat_caller_address(counter.contract_address);
    spy
        .assert_emitted(
            @array![
                (
                    counter.contract_address,
                    Counter::Event::Decreased(
                        Counter::Decreased { setter: USER(), value: counter.get_counter() },
                    ),
                ),
            ],
        )
}

#[test]
#[feature("safe_dispatcher")]
fn test_safe_panic_decrease_counter() {
    let (counter, _) = __deploy__("Counter", ZERO, Option::None);
    let safe_dispatcher = ICounterSafeDispatcher { contract_address: counter.contract_address };

    match safe_dispatcher.decrease() {
        Result::Ok(_) => panic!("cannot decrease 0"),
        Result::Err(e) => assert(*e[0] == 'Counter is zero', *e.at(0)),
    };
}


#[test]
#[feature("safe_dispatcher")]
fn test_safe_panic_reset_counter_not_owner() {
    let (counter, _) = __deploy__("Counter", ZERO, Option::None);
    let safe_dispatcher = ICounterSafeDispatcher { contract_address: counter.contract_address };

    match safe_dispatcher.reset_counter(ZERO, 0) {
        Result::Ok(_) => panic!("only owner can reset"),
        Result::Err(e) => assert(*e[0] == 'Caller is not the owner', *e.at(0)),
    };
}

#[test]
fn test_counter_resets() {
    let token = deploy_token();
    let (counter, ownable) = __deploy__("Counter", ZERO, Option::Some(token.contract_address));
    let initial_counter = counter.get_counter();
    counter.increase();
    assert(counter.get_counter() == initial_counter + 1, 'Should increase by one');

    start_cheat_caller_address(counter.contract_address, ownable.owner());
    counter.reset_counter(ZERO, 0);
    stop_cheat_caller_address(counter.contract_address);

    assert(counter.get_counter() == ZERO, 'Should reset to zero');
}


#[test]
#[should_panic(expected: 'Caller is not the owner')]
fn test_counter_reset_should_panic_when_not_owner() {
    let token = deploy_token();
    let (counter, _) = __deploy__("Counter", ZERO, Option::Some(token.contract_address));

    start_cheat_caller_address(counter.contract_address, USER());
    counter.reset_counter(ZERO, 0);
    stop_cheat_caller_address(counter.contract_address);
}
